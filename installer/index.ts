import fs = require("fs");
import os = require("os");
import task = require("azure-pipelines-task-lib/task");
import tool = require("azure-pipelines-tool-lib/tool");

const FallbackVersion = "v2.14.1";
const ReleaseUrl = "https://github.com/argoproj/argo-cd/releases";
const ToolName = "argocd";
let ServerUrl = "";

const fileExtension = os.platform() === "win32" ? ".exe" : "";

async function run() {
  try {
    getEndpointDetails();
    const inputVersion: string | undefined = task.getInput('version') ?? "latest";
    const inputOpts: string | undefined = task.getInput('options');
    if (inputOpts) {
      task.setVariable("ARGOCD_OPTS", inputOpts);
    }

    const versionSpec = await resolveVersion(inputVersion);
    const toolPath = tool.findLocalTool(ToolName, versionSpec);
    if (!toolPath) {
      await installCli(versionSpec);
    } else {
      tool.prependPath(toolPath);
    }
    task.execSync(ToolName, "version --client");

  } catch (err: any) {
    task.setResult(task.TaskResult.Failed, err.message);
  }
}

function getEndpointDetails() {
  const endpoint = task.getInput("connection", false);

  if (!endpoint) {
    task.debug("No service connection provided");
    return;
  }

  ServerUrl = task.getEndpointUrlRequired(endpoint);
  const apitoken = task.getEndpointAuthorizationParameterRequired(endpoint, "apitoken");
  const url = new URL(ServerUrl);
  task.setVariable("ARGOCD_SERVER", url.host + (url.pathname !== "/" ? url.pathname : ""));
  task.setVariable("ARGOCD_AUTH_TOKEN", apitoken);
}

async function resolveVersion(inputVersion: string): Promise<string> {
  task.debug(`Requested ${inputVersion} version...`);

  switch (inputVersion.toLowerCase()) {
  case "latest":
    return resolveLatest(ReleaseUrl);
  case "server":
    return resolveServer(ServerUrl);
  default:
    return inputVersion;
  }
}

async function resolveLatest(url: string): Promise<string> {
  const response = await fetch(new Request(`${url}/latest`, { redirect: "manual" }));
  const locationHeader = response.headers.get("location");
  const parts = locationHeader?.split("/");
  const version = parts?.pop();

  if (!version) {
    task.warning(`Failed to resolve version. Using fallback version ${FallbackVersion}`);
    return FallbackVersion;
  }

  task.debug(`Resolved ${version} version`);
  return version;
}

async function resolveServer(url: string): Promise<string> {
  const response = await fetch(new Request(`${url}/api/version`));
  const data = await response.json();
  const versionFull = data.Version;

  if (!versionFull) {
    task.warning(`Failed to resolve version. Using fallback version ${FallbackVersion}`);
    return FallbackVersion;
  }

  const version = versionFull.split("+")[0];
  task.debug(`Resolved ${version} version`);
  return version;
}

async function installCli(version: string) {
  const downloadUrl = await getDownloadUrl(version);
  const tempFilePath = await tool.downloadTool(downloadUrl);

  if (os.platform() !== "win32") {
    fs.chmodSync(tempFilePath, "0755");
  }

  const cachedPath = await tool.cacheFile(tempFilePath, ToolName + fileExtension, ToolName, version);
  task.debug("Cached tool at: " + cachedPath);
  tool.prependPath(cachedPath);
}

async function getDownloadUrl(version: string): Promise<string> {
  const currentArch = os.arch() === 'x64' ? 'amd64' : os.arch();
  const currentPlatform = os.platform() === 'win32' ? 'windows' : os.platform();
  let supportedArchs: string[] = [];

  if (currentPlatform === "windows") {
    supportedArchs = ["amd64"];
  } else if (currentPlatform === "darwin" || currentPlatform === "linux") {
    supportedArchs = ["amd64", "arm64"];
  } else {
    throw new Error(`Unsupported platform: ${currentPlatform}`);
  }

  if (!supportedArchs.includes(currentArch)) {
    throw new Error(`Unsupported architecture for ${currentPlatform}: ${currentArch}`);
  }
  return `${ReleaseUrl}/download/${version}/${ToolName}-${currentPlatform}-${currentArch}${fileExtension}`;
}

run();

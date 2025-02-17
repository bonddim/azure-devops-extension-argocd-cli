const repository = "https://github.com/bonddim/argocd-azure-devops-task";
module.exports = (env) => {
  let [idPostfix, namePostfix, isPublic] =
    env.mode == "production" ? ["", "", true] : ["-dev", " (DEV)", false];

  return {
    manifestVersion: 1,
    id: `argocd-installer${idPostfix}`,
    version: "0.1.1",
    name: `Argo CD CLI Installer${namePostfix}`,
    description: "Argo CD CLI Installer Task for Azure DevOps",
    publisher: "bonddim",
    public: isPublic,
    categories: ["Azure Pipelines"],
    content: {
      details: {
        path: "README.md",
      },
      license: {
        path: "LICENSE",
      },
    },
    links: {
      repository: {
        uri: repository,
      },
      issues: {
        uri: `${repository}/issues`,
      },
      support: {
        uri: `${repository}/issues`,
      },
    },
    repository: {
      type: "git",
      uri: repository,
    },
    tags: ["Argo CD", "Argo CD CLI", "Tool", "Installer"],
    targets: [
      {
        id: "Microsoft.VisualStudio.Services",
      },
    ],
    icons: {
      default: "images/extension-icon.png",
    },
    files: [
      {
        path: "installer",
      },
    ],
    CustomerQnASupport: {
      enablemarketplaceqna: "false",
    },
    contributions: [
      {
        id: "service-endpoint",
        description: "Service endpoint type for Argo CD Server Connections",
        type: "ms.vss-endpoint.service-endpoint-type",
        targets: ["ms.vss-endpoint.endpoint-types"],
        properties: {
          name: "ArgoCDServer",
          displayName: "Argo CD Server",
          url: {
            displayName: "Argo CD Server URL",
            helpText: "URL for the Argo CD Server to connect to.",
          },
          authenticationSchemes: [
            {
              type: "ms.vss-endpoint.endpoint-auth-scheme-token",
            },
          ],
        },
      },
      {
        id: "installer-task",
        description: "Argo CD CLI Installer",
        type: "ms.vss-distributed-task.task",
        targets: ["ms.vss-distributed-task.tasks"],
        properties: {
          name: "installer",
        },
      },
    ],
  };
};

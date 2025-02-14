# Argo CD Task For Azure DevOps Pipelines

This extension installs the [Argo CD CLI](https://argo-cd.readthedocs.io/en/stable/) on an Azure DevOps agent.
It automates the installation process and configures the environment for seamless integration with your pipeline.

## Features

- Installs the latest [released](https://github.com/argoproj/argo-cd/releases) version by default.
- Supports Linux, macOS, and Windows agents.
- Creates an **Argo CD Server** service connection to securely store credentials.
- Sets **ARGOCD_SERVER** and **ARGOCD_AUTH_TOKEN** environment variables from the provided service connection.
- Optionally sets the **ARGOCD_OPTS** variable for extra configuration.

## Installation

Install the extension from the [Azure DevOps Marketplace](https://marketplace.visualstudio.com/items/bonddim.argocd-installer).

## Usage

### Install Latest Version

Use this configuration to install the latest released version:

```yaml
- task: ArgoCDInstaller@0
# or
- task: ArgoCDInstaller@0
  inputs:
    version: latest
```

### Install specific version

To install a specific version of Argo CD CLI, specify the desired version

```yaml
- task: ArgoCDInstaller@0
  inputs:
    version: v2.14.2
```

### Install server version

This option installs the version matching your server and also sets `ARGOCD_OPTS="--grpc-web"`.

```yaml
- task: ArgoCDInstaller@0
  inputs:
    connection: ServiceConnectionName or ServiceConnectionID
    version: server
    options: --grpc-web
```

## Contributing

Contributions are welcome! Please review our contributing guidelines before submitting a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Additional Information

For detailed documentation, FAQs, or troubleshooting tips, please refer to the [Argo CD documentation](https://argo-cd.readthedocs.io/en/stable/).

# 从官方文档学习-libvirt

<!--more-->
#

{{< admonition warning "about card" false >}}

这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`

{{< /admonition>}}

> [libvirt: The virtualization API](https://libvirt.org/)

## 1. 首页导航梳理

### 1.1 Deployment/operation

Deployment / operation: 该模块提供关于 libvirt 部署和操作的相关信息和指南，涵盖了如何安装、配置和管理 libvirt 环境的内容：

- Applications: 该模块列出了已知使用 libvirt 的一些应用程序，这些应用程序可能使用 libvirt API 来管理和操作虚拟化环境。

- Manual pages: 该模块提供 libvirt 工具和守护进程的手册页（manual pages），手册页包含了有关 libvirt 工具和守护进程的详细说明和使用指南。

- Windows: 该模块提供用于 Windows 系统的 libvirt 下载，包括可执行文件和相关的工具和文档。

- macOS: 该模块提供有关在 macOS 上使用 libvirt 的相关信息，包括如何安装、配置和使用 libvirt 在 macOS 系统上进行虚拟化管理的指南。

- Migration: 该模块介绍了如何在不同主机之间迁移虚拟机（guests），包括迁移操作的步骤和要考虑的因素。

- Daemons: 该模块概述了 libvirt 提供的守护进程（daemons），解释了每个守护进程的功能和作用。

- Remote access: 该模块描述了如何启用 libvirt 守护进程的远程访问功能，允许通过 TCP 连接进行远程管理和操作。

- TLS certs: 该模块提供了生成和部署用于 TLS 的 x509 证书的指南，用于加密和保护与 libvirt 的通信。

- Authentication: 该模块介绍了如何配置 libvirt 守护进程的身份验证，以确保只有授权用户可以访问和操作虚拟化环境。

- Access control: 该模块解释了如何使用 polkit 配置 libvirt API 的访问控制，以限制对 libvirt 功能的访问。

- Logging: 该模块描述了 libvirt 库和守护进程的日志记录支持，包括如何配置和管理日志记录。

- Audit log: 该模块介绍了用于记录主机操作审计日志的功能，用于跟踪和监控 libvirt 环境中的操作。

- Firewall: 该模块涵盖了防火墙和网络过滤器的配置，以保护和管理虚拟化环境中的网络流量。

- Hooks: 该模块介绍了用于特定系统管理的钩子（hooks），这些钩子可用于在 libvirt 操作期间触发特定的自定义脚本和操作。

- NSS module: 该模块描述了如何启用域主机名转换为 IP 地址的 NSS 模块，以便在 libvirt 环境中进行网络通信。

- FAQ: 该模块是 libvirt 的常见问题解答，提供了一些常见问题和解答，以帮助用户解决常见问题和疑问。

这些模块涵盖了 libvirt 官方网站提供的各种文档和资源，以帮助用户了解和使用 libvirt 虚拟化环境的不同方面和功能。

### 1.2  Application development

Application development: 应用程序开发模块提供有关如何使用libvirt API进行应用程序开发的相关信息和指南：

- API reference: API参考模块提供了libvirt C公共API的参考手册，分为多个部分，包括常规、领域（domain）、领域检查点（domain checkpoint）、领域快照（domain snapshot）、错误（error）、事件（event）、主机（host）、接口（interface）、网络（network）、节点设备（node device）、网络过滤器（network filter）、秘密（secret）、存储（storage）、流（stream）、管理（admin）、QEMU、LXC等。

- Language bindings and API modules: 语言绑定和API模块提供了libvirt API在各种编程语言（如C#、Go、Java、OCaml、Perl、Python、PHP、Ruby等）中的绑定和集成模块。

- XML schemas: XML模式模块提供了有关域（domain）、网络（network）、存储（storage）、能力（capabilities）、节点设备（node devices）、秘密（secrets）、快照（snapshots）、备份任务（backup jobs）等的XML模式描述。

- URI format: URI格式模块提供了连接到libvirt时使用的URI格式的说明。

- CGroups: CGroups模块介绍了libvirt与控制组（CGroups）的集成。

- Drivers: 驱动程序模块提供了特定于不同虚拟化平台和Hypervisor的驱动程序信息。

- Support guarantees: 支持保证模块提供了各种接口的支持状态的详细信息。

- Driver support: 驱动程序支持模块提供了每个Hypervisor在每个版本中的API支持矩阵。

- Knowledge Base: 知识库模块提供了针对关键功能的面向任务的指南。

这些模块涵盖了libvirt官方网站提供的各种文档和资源，用于帮助用户了解和使用libvirt的不同方面和功能。

### 1.3 Project development

Project development: 项目开发模块提供了有关libvirt项目开发的一般指南和贡献者指南，包括编码准则、CI（持续集成）、上游问题处理、Bug报告等：

- Docs style guide: 文档样式指南模块提供了reStructuredText文档的样式指南，用于编写和格式化libvirt的文档。

- Project strategy: 项目战略模块为libvirt项目的未来方向和技术选择提供了愿景和设定。

- CI: 持续集成模块详细介绍了libvirt项目中的持续集成（Continuous Integration）过程和细节。

- Upstream issue handling: 上游问题处理模块概述了处理问题的流程，同时描述了支持的问题类型及其生命周期。

- Bug reports: Bug报告模块介绍了如何在哪里报告Bug和请求功能的方法。

- Compiling: 编译模块说明了如何编译libvirt项目。

- Goals: libvirt API的术语和目标。

- API concepts: libvirt API的概念。

- API extensions: 添加新的公共libvirt API的方法。

- Testing: 详细介绍了libvirt可用的各种测试类型。

- New repo setup: 配置libvirt新Git仓库的流程。

- Libvirt logos: libvirt标志文件和使用指南。

这些模块提供了libvirt官方网站上关于libvirt项目开发、文档指南、战略设定、持续集成、问题处理、编译、API设计和测试等方面的相关资源和指南。它们旨在为开发者和贡献者提供必要的信息和指导，以支持libvirt项目的开发和使用。

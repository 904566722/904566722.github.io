# 虚拟化

<!--more-->
#

{{< admonition warning "about card" false >}}

这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`

{{< /admonition>}}

- [](#)
  - [KVM](#kvm)
  - [libvirt](#libvirt)
  - [QEMU](#qemu)
  - [qemu-kvm](#qemu-kvm)
  - [Q\&A](#qa)
    - [1. 两种模式的主机？](#1-两种模式的主机)
    - [2. qemu、lxc、uml 这三者是什么关系？](#2-qemulxcuml-这三者是什么关系)
  - [参考资料](#参考资料)


## KVM

KVM：Kernel-based Virtual Machine，wiki：[基于内核的虚拟机 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E5%9F%BA%E4%BA%8E%E5%86%85%E6%A0%B8%E7%9A%84%E8%99%9A%E6%8B%9F%E6%9C%BA)

![图 0](images/posts/20230707-134157266.png)  
- [](#)
  - [KVM](#kvm)
  - [libvirt](#libvirt)
  - [QEMU](#qemu)
  - [qemu-kvm](#qemu-kvm)
  - [Q\&A](#qa)
    - [1. 两种模式的主机？](#1-两种模式的主机)
    - [2. qemu、lxc、uml 这三者是什么关系？](#2-qemulxcuml-这三者是什么关系)
  - [参考资料](#参考资料)

## libvirt

[libvirt](https://zh.wikipedia.org/wiki/Libvirt) 是一套用于管理硬件虚拟化的 api、守护线程与管理工具

![图 1](images/posts/20230707-134316819.png)  

## QEMU

QEMU 是一个模拟器，虚拟机认为自己在跟实际硬件打交道，实际上指令走到底层实际的硬件，需要经过 QEMU 转译

![图 3](images/posts/20230707-140612605.png)  

## qemu-kvm

将 qemu-kvm 结合，qemu 负责模拟网卡、磁盘，kvm 负责模拟 cpu、内存

![图 5](images/posts/20230707-142453251.png)  


## Q&A
### 1. 两种模式的主机？

![图 4](images/posts/20230707-141822147.png)  

- **系统模式的主机**：在系统模式的主机中，虚拟化软件（如Hypervisor）直接运行在硬件上，而不依赖于宿主操作系统。这种模式通常被称为裸机虚拟化（Bare-Metal Virtualization）或原生虚拟化（Native Virtualization）。典型的例子是使用 KVM 或 Xen Hypervisor 的裸机虚拟化环境，它们在物理机上直接运行，而不需要额外的操作系统。系统模式的主机提供更高的性能和资源利用率，因为它们可以更直接地访问硬件资源

### 2. qemu、lxc、uml 这三者是什么关系？

QEMU、LXC（Linux Containers）和UML（User-mode Linux）是三种不同的虚拟化技术，它们在实现上有一些区别和不同的应用场景。

1. QEMU（Quick Emulator）：
   - QEMU 是一个开源的硬件虚拟化和模拟器工具。它可以模拟多种硬件架构（如x86、ARM等），并提供了虚拟机管理和设备模拟的功能。
   - QEMU 可以通过完全虚拟化或硬件辅助虚拟化的方式在宿主机上运行虚拟机。它提供了一组丰富的特性和功能，包括虚拟CPU、内存管理、设备模拟、磁盘和网络支持等。
   - QEMU 可以与不同的后端（如KVM、Xen）配合使用，提供高性能的虚拟化解决方案。

2. LXC（Linux Containers）：
   - LXC 是一种轻量级的虚拟化技术，它利用 Linux 内核的容器功能来实现操作系统级别的虚拟化。
   - LXC 允许将应用程序和其依赖项隔离在独立的容器中，每个容器运行在一个单独的用户空间环境中，与宿主机共享相同的内核。
   - LXC 提供了一种轻量级、快速启动和低开销的虚拟化解决方案，适用于运行多个独立应用程序实例的场景。

3. UML（User-mode Linux）：
   - UML 是一种虚拟化技术，它允许在 Linux 主机上以用户空间进程的形式运行另一个完整的 Linux 内核。
   - UML 利用 Linux 内核的用户模式执行（User-mode Linux）功能，将一个或多个独立的 UML 内核作为普通的用户进程在宿主机上运行。
   - UML 提供了一种轻量级、可扩展和灵活的虚拟化解决方案，可以方便地创建和管理多个独立的 Linux 实例。

总结起来，QEMU 是一个硬件虚拟化和模拟器工具，LXC 是一种基于 Linux 容器的操作系统级别虚拟化技术，而 UML 是一种以用户空间进程的形式运行另一个 Linux 内核的虚拟化技术。它们在实现和应用场景上有所区别，可根据具体需求选择适合的虚拟化技术。

## 参考资料

1. [KVM-Qemu-Libvirt三者之间的关系_乾楠有的技术博客_51CTO博客](https://blog.51cto.com/changfei/1672147)

2. [QEMU KVM学习笔记 | learn-kvm](https://yifengyou.github.io/learn-kvm/)

3. [【KVM】KVM学习—实现自己的内核 - 简书](https://www.jianshu.com/p/5ec4507e9be0)

4. [libvirt: Libvirt FAQ](https://wiki.libvirt.org/FAQ.html)

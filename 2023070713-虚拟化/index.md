# 虚拟化

<!--more-->
#

{{< admonition warning "about card" false >}}

这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`

{{< /admonition>}}

## KVM

KVM：Kernel-based Virtual Machine，wiki：[基于内核的虚拟机 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E5%9F%BA%E4%BA%8E%E5%86%85%E6%A0%B8%E7%9A%84%E8%99%9A%E6%8B%9F%E6%9C%BA)

![图 0](images/posts/20230707-134157266.png)  
- [](#)
  - [KVM](#kvm)
  - [libvirt](#libvirt)
  - [QEMU](#qemu)
  - [qemu-kvm](#qemu-kvm)
  - [问题？](#问题)
    - [1. 两种模式的主机？](#1-两种模式的主机)
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


## 问题？
### 1. 两种模式的主机？

![图 4](images/posts/20230707-141822147.png)  

- **系统模式的主机**：在系统模式的主机中，虚拟化软件（如Hypervisor）直接运行在硬件上，而不依赖于宿主操作系统。这种模式通常被称为裸机虚拟化（Bare-Metal Virtualization）或原生虚拟化（Native Virtualization）。典型的例子是使用 KVM 或 Xen Hypervisor 的裸机虚拟化环境，它们在物理机上直接运行，而不需要额外的操作系统。系统模式的主机提供更高的性能和资源利用率，因为它们可以更直接地访问硬件资源


## 参考资料

1. [KVM-Qemu-Libvirt三者之间的关系_乾楠有的技术博客_51CTO博客](https://blog.51cto.com/changfei/1672147)

2. [QEMU KVM学习笔记 | learn-kvm](https://yifengyou.github.io/learn-kvm/)

3. [【KVM】KVM学习—实现自己的内核 - 简书](https://www.jianshu.com/p/5ec4507e9be0)

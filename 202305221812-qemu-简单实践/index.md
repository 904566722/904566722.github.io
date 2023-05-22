# qemu 简单实践

<!--more-->
#

## 一些了解

- `qemu-img`：QEMU 的磁盘管理工具
- `QEMU`：模拟计算的自由软件（**纯软件**），QEMU 有整套的虚拟机实现（CPU 虚拟化、内存虚拟化、I/O 设备虚拟化）
- QEMU 是一个运行在用户态的进程，通过 KVM 模块提供的**系统调用接口**进行内核操作

	![](images/posts/Pasted%20image%2020230522181522.png)

- `qcow2` 格式：当客户系统实际写入内容的时候，才会分配镜像空间

|格式|优点|缺点|
|-|-|-|
|raw|i/o 开销小[^1]|浪费空间|
|qcow2|节省空间|性能差|

## 实际使用

命令：
```sh
qemu-img convert [-c] [-p] [-q] [-n] [-f fmt] [-t cache] [-T src_cache] [-O output_fmt] [-o options] [-s snapshot_name] [-S sparse_size] filename [filename2 [...]] output_filename
```
-   `c` 目标图像必须被压缩（仅qcow格式）
-   `p` 显示命令的进展情况
-   `n` 跳过目标卷的创建（如果卷是在运行qemu-img之前创建的，则非常有用）
-   `t cache` 写入输出磁盘镜像的缓存模式
-   `T src_cache` 读取输入磁盘镜像的缓存模式
-   `O output_fmt` 输出文件格式

例子：
```sh
qemu-img create -f qcow2 centos7.4-disk.qcow2 20G   # 创建 20G 大小的 qcow2 格式文件 centos7.4-disk.qcow2

qemu-img info centos7.4-disk.qcow2 --output=json    # 以 json 格式输出文件信息

qemu-img create -f qcow2 -o backing_file=disk1.qcow2 disk1-a.qcow2  # 创建 disk1-a.qcow2 文件，并以 disk1.qcow2 为后端镜像文件（disk1-a.qcow2 记录与后端镜像的差异部分，在使用 commit 命令的时候才将修改提交到后端镜像文件）
```



[^1]: 这是因为Raw格式的镜像**不需要进行额外的解压或解密操作**，也不需要对数据进行任何转换或处理。当系统需要访问Raw格式的镜像时，它可以直接读取文件中的二进制数据，并将其映射到内存中，从而避免了额外的IO开销和CPU负担。

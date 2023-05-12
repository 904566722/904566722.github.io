# yum 源问题记录

<!--more-->
#linux 

> rpm 包下载：[https://pkgs.org/](https://pkgs.org/)

记录一次在制作基础镜像的时候遇到的 yum 源问题

制作镜像的 dockerfile 如下
![](images/posts/Pasted%20image%2020230512131816.png)


执行完图示的命令后，yum 源目录下生成了如下一些文件：
![](images/posts/Pasted%20image%2020230512131832.png)

再次执行生成缓存命令的时候，出现了如下错误：

`cannot prepare internal mirrorlist: No URLs in mirrorlist`
![](images/posts/Pasted%20image%2020230512131848.png)

查看对应的 repo 文件，到对应的地址下看看：
![](images/posts/Pasted%20image%2020230512131908.png)

解决方法：

使用旧的仓库
```sh
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
```

重新创建缓存，发现有一个地址 404 了，应该也是没有在维护被弃用了：
![](images/posts/Pasted%20image%2020230512131943.png)

打开这个网址找找看
![](images/posts/Pasted%20image%2020230512132000.png)

发现已经没有相关的 rpm 包了
![](images/posts/Pasted%20image%2020230512132012.png)

到对应的 centos 版本下找找：
![](images/posts/Pasted%20image%2020230512132024.png)
![](images/posts/Pasted%20image%2020230512132032.png)
发现这个版本下是有相关 rpm 包的，所以可以把 yum 源的 8-stream 换掉
![](images/posts/Pasted%20image%2020230512132050.png)
问题得到解决。

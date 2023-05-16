# busybox 镜像制作

<!--more-->
#docker 

##  命令

```sh
mkdir rootfs
cd rootfs/
for module in `busybox --list-modules`; do mkdir -p `dirname "$module"` && ln -sf /bin/busybox "$module"; done
cp busybox bin/
tar cpf rootfs.tar .

cat << EOF > busybox.dockerfile
FROM scratch
ADD rootfs.tar /
CMD ["/bin/sh"]
EOF
```

## arm 架构

1. 直接下载二进制文件

[https://busybox.net/downloads/binaries/1.28.1-defconfig-multiarch/](https://busybox.net/downloads/binaries/1.28.1-defconfig-multiarch/)

2. 制作 tar 包

```sh
cp busybox /bin/busybox
mkdir rootfs
cd rootfs/
for module in `busybox --list-modules`; do mkdir -p `dirname "$module"` && ln -sf /bin/busybox "$module"; done
cp /bin/busybox bin/busybox
tar cpf rootfs.tar .
```

3. 制作镜像

```sh
cat << EOF > busybox.dockerfile
FROM scratch
ADD rootfs.tar /
CMD ["/bin/sh"]
EOF
```

----

1.  代码网址：[https://busybox.net/downloads/](https://busybox.net/downloads/)
    
2.  github： [https://github.com/docker-library/busybox](https://github.com/docker-library/busybox)
    
3.  [https://blog.csdn.net/liumiaocn/article/details/80458663](https://blog.csdn.net/liumiaocn/article/details/80458663)
    
4.  [https://www.frytea.com/technology/docker/build-a-docker-image-from-scratch/](https://www.frytea.com/technology/docker/build-a-docker-image-from-scratch/)


# 创建 iscsi 的镜像缓存

<!--more-->
#

## 任务描述

```sh
qemu-img convert -t none -p -n -W -O raw "json: {\"file.driver\": \"http\", \"file.url\": \"${IMAGE_URL}\", \"file.timeout\": 3600}" $dev_path
```

如上面命令行所示，通过 `qemu-img` 将一个镜像导入到 /dev/*** 设备中，其中 /dev/*** 通过 iscsi 挂载到容器中，完成工作后卸载

## 实现步骤

1. 制作镜像

制作一个镜像，安装好 iscsi-initiator-utils、libgcrypt、qemu-kvm-block-curl 等工具，编一个 convert.sh 脚本，脚本主要做**镜像导入**的工作

2. 编写代码

通过 `client-go` 调用 k8s 相关 api 来创建 job，job 中执行 convert.sh 脚本

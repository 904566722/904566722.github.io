# 修改 iscsi 磁盘挂载逻辑：按照 lun id 来挂载

<!--more-->
#

## 任务概览

原先的磁盘卸载逻辑：
1. 先执行 `terminate` 操作（断开磁盘与主机的连接）
2. 执行 `dettach` 操作（实际卸载磁盘）

可能产生问题：
1.  `terminate` - initialize - `dettach` - attach

	这样可能会把已经卸载的盘再挂载回来

2.  `terminate` - initialize - attach - `dettach` 

	这样可能会把挂载过来的盘卸载掉。假设上面初始化连接（initialize）的盘是一个虚机需要的启动盘，那么这个盘最终会被卸载掉，导致虚机启动失败

## 如何避免

1. 限制性 `dettach` 操作，将盘实际从虚机上卸载
2. 执行 `terminate` 操作，断开磁盘跟主机的连接

## linux 上挂卸载的操作

卸载磁盘的命令
```sh
echo 1 > /sys/block/sd*/device/delete
```

**如何使用 lun id 的方式来挂载？**
```sh
echo C T L > /sys/class/scsi_host/hostH/scan
```

如何获得 HCTL？**通过初始化连接的响应中的 session id 来寻找**

以 session`6` 为例：
![](images/posts/Pasted%20image%2020230522184136.png)

session`6` 目录存在于 /sys/class/iscsi_host/host`3`/device 目录下 :
![](images/posts/Pasted%20image%2020230522184247.png)

- H：根据路径获得H：xxx/iscsi_host/host[3]^(H)/device
- C、T：根据 target 目录获得 CT：target:3:[0]^(C):[0]^(T)
- L：发送初始化连接的时候由服务端返回的：[1]^(L)

## 一些命令备忘

```sh
ll /dev/disk/by-path/ip-10.255.245.36:3260-iscsi-iqn.2004-12.com.inspur:mcs.ipsan.b200.fsp.node2-lun-0 

iscsiadm -m discovery -t st -p 10.255.245.65:3260 
iscsiadm -m node -T 10.255.245.65:3260 -l 
iscsiadm -m node -T iqn.2004-12.com.inspur:mcs.ipsan.b200.fsp.node1 -p 10.255.245.65:3260 --login
```

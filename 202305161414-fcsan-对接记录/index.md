# fcsan 对接记录

<!--more-->
#linux #storage 

## 一、fcsan 如何进行挂载

参考资料
- [https://its401.com/article/wanminxg/54342430](https://its401.com/article/wanminxg/54342430)
- [https://github.com/openstack/os-brick/blob/7a6a09fc84a779c3ee08d122664f941195eeab8f/os_brick/initiator/linuxfc.py#L88](https://github.com/openstack/os-brick/blob/7a6a09fc84a779c3ee08d122664f941195eeab8f/os_brick/initiator/linuxfc.py#L88)
- [https://vk.masantu.com/wiki/💻工作/存储/scstadm-cmd/](https://vk.masantu.com/wiki/%F0%9F%92%BB%E5%B7%A5%E4%BD%9C/%E5%AD%98%E5%82%A8/scstadm-cmd/)


### 存储端
1. 激活 HBA 接口

```sh
# 查看当前 port 的状态
cat /sys/class/fc_host/host*/port_state
```

2. 绑定 wwn 编号

3. 划分 lun

```
fdisk 设备
```

4. 创建 group

```sh
scstadmin -add_group **ESX** -driver qla2x00t -target **21:00:00:24:ff:5c:aa:15**
```

5. 绑定 lun 进 group 

```sh
# 建立虚拟磁盘与物理盘的映射关系
scstadmin -open_dev **disk01** -handler vdisk_blockio -attributes filename=**/dev/sdb1**
	## 执行上述命令之后，是否需要执行下述命令？
  scstadmin -write_config /etc/scst.conf
# 添加虚拟磁盘到 target
scstadmin -add_lun **0** -driver qla2x00t -target **21:00:00:24:ff:5c:aa:15  -device disk01**
```

6. scst 服务检查

```sh
scstadmin -list_session
```


### 客户端
```sh
echo 1 > /sys/class/fc_host/host15/issue_lip
```

挂载盘过来之后，生成了目录： /sys/class/fc_transport/target15:0:0

```sh
# 挂载 lun 为 1 的盘
echo 0 0 1 > /sys/class/scsi_host/host15/scan
```

![](images/posts/Pasted%20image%2020230516142044.png)

```sh
# 这个目录是在有挂盘的情况下才有的
[root@iaas-test-193-ctl-226-195 ~]# cat /sys/class/fc_transport/target15\:0\:0/port_name
0x56c92bfa00218005
[root@iaas-test-193-ctl-226-195 ~]# grep -Gil 0x56c92bfa00218005 /sys/class/fc_transport/target15\:0\:0/port_name\
> \
>
/sys/class/fc_transport/target15:0:0/port_name

# 上面这个结果有可能有多行？什么情况下是多行

[root@iaas-test-193-ctl-226-195 ~]# grep -Gil 0x56c92bfa00218005123 /sys/class/fc_transport/target15\:0\:0/port_name

```

### e.g. 浪潮 fcsan 服务端配置
![](images/posts/Pasted%20image%2020230516142148.png)


## 二、开发方案

### 2.1 api 请求流程

{{< mermaid >}}
sequenceDiagram
  
ecsServer->>+nodeAgent: 获取 hostiqn
nodeAgent->>-ecsServer: 返回 hostiqn
  
ecsServer->>ebs: 初始化链接
ebs->>ecsServer: 初始化结果
{{< /mermaid >}}

### 2.2 虚机调度方案

1. 虚机添加一个属性：`fcsan_support` 用来标识虚机是否支持 fcsan 挂卸载，该属性仅支持在关机的状态下修改
2. 如果虚机

|fcsan_support|操作|描述|
|-|-|-|
|true|冷热挂卸载|允许|
|false|冷挂卸载|允许|
|false|热卸载|允许|
|false|热挂载|提示“当前虚机不支持热挂载类型为fibre channel的云盘，请在关机状态下操作”|

3. 当虚机创建的时候就挂载了 fcsan 的盘，则设置 fcsan_support 为 true
4. 插入 hba 卡，device plugin[^1] 自动识别，更新节点的资源属性

{{< admonition type=quote title="简单例子" open=false >}}
先尝试手动给 k8s 节点 打上资源信息（模拟 device plugin 给 k8s 上报 HBA 资源），然后发 api 创建虚机，看是否起到对应节点？并且资源数是否 -1

虚机pod：
![](images/posts/Pasted%20image%2020230516144303.png)

```yaml
resources:
  limits:
    fcsan/hba: "1"
  requests:
    fcsan/hba: "1"
```

node 节点信息：
![](images/posts/Pasted%20image%2020230516144339.png)

{{< /admonition >}}

### 2.3 挂卸载设计方案
#### 1.0

1.  单盘挂载
    
    第一层虚机状态的拦截：如果虚机状态为开机，不允许挂载，状态为关机则放行
    
    判断虚机 fcsan 属性，如果为 false，创建新的 sts，删除旧的 sts，虚机 fcsan 属性置为 true
    
    如果为 true 无操作
    
2.  单盘卸载
    
3.  批量挂载
    
    盘列表的情况：【fcsan盘、非fcsan盘】
    
    非fcsan的盘放行，继续后续的挂载操作
    
    fcsan的盘需要判断当前虚机状态，如果虚机状态为开机，拦截这些盘的挂载操作，返回提示：这些盘需要在关机状态下操作
    
    如果虚机状态为关机，判断虚机的fcsan属性，如果为 false，创建新的 sts，删除旧的 sts，虚机 fcsan 属性置为 true，如果为 true，则无操作
    
4.  批量卸载

```sh
# 单盘挂载
curl -H "Content-Type: application/json" -X POST -d '{"volume_id":"vol-de2w9x9nzqwggf","delete_on_termination":false,"device":""}' 10.151.0.147:8080/compute/ecs/ops/v1/210512031000400/servers/ecs-de9soljuhecvky/attachVolume
# 单盘卸载
curl -H "Content-Type: application/json" -X DELETE  10.151.0.147:8080/compute/ecs/ops/v1/210512031000400/servers/ecs-de538f14upm1rw/detachVolume/vol-de2w9x9nzqwggf
# 多盘挂载
curl -H "Content-Type: application/json" -X POST -d '{"attach_volume":[{"volume_id":"vol-de2w9x9nzqwggf","delete_on_termination":false,"device":""},{"volume_id":"vol-de8dro3ezonnpg","delete_on_termination":false,"device":""}]}' 10.151.131.90:8080/compute/ecs/ops/v1/210512031000400/servers/ecs-des5bwski1o6pa/attachVolumes
```

#### 2.0

1.  单盘挂载
    
    获取虚机 **FcsanSupport** 属性
    
    判断 FcsanSupport == true（表明虚机当前是支持fcsan盘挂载的），则后续的操作都按正常挂载，无论虚机是开机还是关机状态都能够挂载
    
    FcsanSupport == false （表明虚机当前不支持fcsan盘挂载），进一步获取 vtype protocol type 属性，
    
    如果 type == “fc”，进一步判断虚机的状态，
    
    如果 虚机状态 == 关机，支持挂载，并且改变 FcsanSupport 的值为 true，重新创建虚机的 sts 【FcsanSupport: false → true 的状态转换】
    
    如果 虚机状态 == 开机，直接返回提示：“当前虚机的状态不支持热挂载 fcsan 的盘”
2.  单盘卸载
    
    FcsanSupport == true 正常卸载
    
    FcsanSupport == false
    
    问题：如果虚机挂载过 fcsan 的盘，后来全卸载了，虚机的 FcsanSupport 是否需要变回 false？
    
    1.  如果不变回 false，好处是之后能够热挂载 fcsan 的盘，但是这样会导致挂载过 fcsan 类型盘的虚机 pod 都跑到了有 hba 的节点
        
    2.  如果需要变回 false，则需要在每次卸载的时候判断一下这块盘是不是虚机的最后一块fcsan的盘 【FcsanSupport：true→false 的状态转换】
        
3.  批量挂载
    
    FcsanSupport == true 正常卸载
    
    FcsanSupport == false 判断虚机状态
    
    虚机状态 == 开机，拦截操作，返回提示
    
    虚机状态 == 关机，【FcsanSupport： false→true 的状态转换】

---
[^1]: Kubernetes的Device Plugin是一种机制，用于管理和分配节点上的设备资源。它允许用户将自定义设备（如GPU、FPGA等）添加到Kubernetes集群中，并使这些设备可供容器使用。Device Plugin通过实现Kubernetes Device Plugin API来工作。该API定义了一组规范，用于插件与Kubernetes API Server进行通信，并向其报告可用设备资源。插件还可以响应Pod的请求，以便将设备资源分配给Pod。使用Device Plugin，用户可以轻松地将自定义设备添加到Kubernetes集群中，并确保这些设备在需要时可供容器使用。这有助于提高集群的利用率，并为用户提供更好的性能和灵活性。

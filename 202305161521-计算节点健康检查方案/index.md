# 计算节点健康检查方案

<!--more-->

## 一、为什么要支持计算节点健康检查

**问题：**有很多节点问题会影响到节点上正在运行的pod，比如**内核死锁、OOM、文件系统损坏、容器运行时异常...**，在集群中，有些问题对于上层来说不可见，pod还是有可能会调度到有问题的节点。Kubelet 默认对节点的 PIDPressure、MemoryPressure、DiskPressure 等资源状态进行监控，但是存在当 Kubelet 上报状态时节点已处于不可用状态的情况，甚至 Kubelet 可能已开始驱逐 Pod

为了解决上面的问题，引入节点健康检查，**添加更细致化的指标，在人工干预之前，及早发现问题，提前预知节点的资源压力，反馈给集群，在业务pod不可用之前提前发现节点异常，并作出相应的补救策略**


## 二、如何来做节点的健康检查

### 2.1 相关技术

- **Node Problem Detector**（NPD，节点健康检查）

- **Node Health Check Operator** （NHC，监听节点状态，触发修复）+ **Self Node Remediation Operator**（SNR，修复）

  ![](images/posts/Pasted%20image%2020230516152256.png)

### 2.2 整体节点检查、修复流程

#### 2.2.1 概览

![](images/posts/image-20220714113456297.png)

#### 2.2.2 整体流程

1. NPD 在每个节点上运行守护进程，检测并报告节点的健康状况

   NPD 组件检测节点上的故障，如 Linux Kernel Hang、容器运行时异常、文件描述符异常等，并转换为节点的事件（Event）或者 Condition上报给集群

   

   **监控项**：每个 NPD 创建子守护进程，监视对应类型的节点问题：

   - SystemLogMonitor：用于监控系统和内核的日志，根据预定义的规则来报告问题、指标。支持基于文件的日志、journald、kmsg
   - SystemStatusMonitor：从不通的系统组件收集预定义的相关健康指标，支持的组件：cpu、disk、host、memory
   - CuntomPluginMonitor：自定义插件
   - HealthChecker：检查kubelet和容器运行时的健康状况

   NPD 支持自定义监控脚本，可自定义检测期望发现的节点问题

   每个监控项通过配置文件来修改、扩展规则，e.g.

   ```yaml
   {
   	"plugin": "kmsg",
   	"logPath": "/dev/kmsg",
   	"lookback": "5m",
   	"bufferSize": 10,
   	"source": "kernel-monitor",
   	"metricsReporting": true,
   	"conditions": [
   		{
   			"type": "KernelDeadlock",
   			"reason": "KernelHasNoDeadlock",
   			"message": "kernel has no deadlock"
   		},
   		{
   			"type": "ReadonlyFilesystem",
   			"reason": "FilesystemIsNotReadOnly",
   			"message": "Filesystem is not read-only"
   		}
   	],
   	"rules": [
   		{
   			"type": "temporary",
   			"reason": "OOMKilling",
   			"pattern": "Killed process \\d+ (.+) total-vm:\\d+kB, anon-rss:\\d+kB, file-rss:\\d+kB.*"
   		},
   		{
   			"type": "temporary",
   			"reason": "TaskHung",
   			"pattern": "task [\\S ]+:\\w+ blocked for more than \\w+ seconds\\."
   		},
   		{
   			"type": "temporary",
   			"reason": "UnregisterNetDevice",
   			"pattern": "unregister_netdevice: waiting for \\w+ to become free. Usage count = \\d+"
   		},
   		...
   	]
   }
   ```

安装 NPD 之后，节点中会添加以下 Conditions：

| Condition Type            | 默认值 | 描述                                                         |
| :------------------------ | :----- | :----------------------------------------------------------- |
| ReadonlyFilesystem        | False  | 文件系统是否只读                                             |
| FDPressure                | False  | 查看主机的文件描述符数量是否达到最大值的80%                  |
| FrequentKubeletRestart    | False  | Kubelet 是否在20Min内重启超过5次                             |
| CorruptDockerOverlay2     | False  | DockerImage 是否存在问题                                     |
| KubeletProblem            | False  | Kubelet service 是否 Running                                 |
 | KernelDeadlock            | False  | 内核是否存在死锁                                             |
 | FrequentDockerRestart     | False  | Docker 是否在20Min内重启超过5次                              |
 | FrequentContainerdRestart | False  | Containerd 是否在20Min内重启超过5次                          |
 | DockerdProblem            | False  | Docker service 是否 Running（若节点运行时为 Containerd，则一直为 False） |
 | ContainerdProblem         | False  | Containerd service 是否 Running（若节点运行时为 Docker，则一直为 False） |
 | ThreadPressure            | False  | 系统目前线程数是否达到最大值的90%                            |
 | NetworkUnavailable        | False  | NTP service 是否 Running                                     |
 | SerfFailed                | False  | 分布式检测节点网络健康状态                                   |

2. 当发现问题后，将以 **NodeCondition** 和 **Event** 的形式上报给 apiserver

   发现问题后，向 k8s apiserver 报告节点问题：临时问题报告为 Event，永久问题报告为 NodeCondition

3. 问题上报之后，node 节点状态变化，NHC 根据不健康节点的判断规则

   NHC 目前判断节点不健康的条件只通过节点状态以及持续时间来判断

   NodeHealthCheck e.g.
   
   ![](images/posts/Pasted%20image%2020230516152352.png)
   
   则如果节点状态不为 Ready 的持续时间超过 300s，NHC 会将其判断为一个不健康节点
   
   <font color="blue">后续需要 NHC 能够识别由 NPD 上报的不同节点问题，识别节点不同的 Condition Type，比如：ReadonlyFilesystem、FDPressure、KubeletProblem等等，针对性地触发补救</font>
   
4. NHC 创建 SNR 提供的补救模板之后，会触发 SNR 补救逻辑

   目前 SNR 的补救策略只有 reboot 节点

   <font color="blue">后续需要根据 NHC 发送的不同的节点问题，更有针对性地进行补救</font>

   补救成功后，节点状态将被恢复为正常，NHC 删除创建的补救 CR 实例，并继续监控节点状态，形成闭环

#### 2.2.3 修复过程与结果记录

问题的发现：kube-system 命名空间下查看 NPD 对应 pod 的日志记录，通过 node 的 Event、Condition 查看上报的结果

触发修复：查看 NHC manager 日志，可知针对哪个不健康节点，创建了什么修复模板

修复结果：查看 SNR manager 的日志，可知执行了什么修复策略，调度了哪个 ds 来做的修复，查看 node 的 Event、Condition 或者相应服务的状态来确定修复是否完成

## 三、关于迭代升级

1. 对节点出现的不同问题做针对性补救

   NPD 本身支持对许多不同类型的问题进行监控，并将其上报给集群，但 <font color="red">NHC 目前对不健康节点的条件判断还比较宽泛，无法针对节点出现的不同问题，做针对性的补救</font>，只是简单将节点重启，后续需要**升级 NHC 以及 SNR**，以支持能够对节点出现的问题采取针对性的手段做修复
   
2. 控制同一时刻修复的节点面积

   需要防止同一时刻大面积节点同时触发修复的情况，NHC 需要增加限制，同一时刻只允许规定数量的节点触发修复


## *、方案描述

这个节点健康检查方案的背景呢，就是我们的集群在运行时，可能会因为许多原因导致不可用，做这个节点健康检查的目的其实就是两个：一个是对问题监控的粒度更细一些，以及对问题的反应更提前一些，现在 kubelet 会监控节点的内存压力、磁盘压力等等，监控项还是比较少，我们希望引入 NPD 来监控更多节点的状态，监控更多指标，像文件系统只读，文件描述符数量，containerd 是不是在频繁启动之类的，做到粒度更细一些，然后反应更提前就是希望通过监控更多指标，提前感知节点的压力，在节点开始驱逐pod之前就做出相应的措施。

然后具体方案可以看下，主要采用了NPD，用来做节点健康检查，然后 NHC 对节点状态、事件做监听，触发修复，SNR用来做具体的修复。

NPD： 这是NPD自身支持的几个监控类型，通过配置文件的形式增加、修改监控的规则

NHC：在节点状态发生变化之后，NHC 会根据配置的规则来判断节点是不是不健康的

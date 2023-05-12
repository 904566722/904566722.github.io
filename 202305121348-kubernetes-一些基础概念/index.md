# Kubernetes 一些基础概念

<!--more-->
#k8s 

## 简单了解
### 特点

- 基于容器技术
- 有自我修复能力
- 水平伸缩
- 自动化部署、扩展
- 服务发现和负载均衡
- ...

### master 节点相关组件
- kube-apiserver
- kube-controller-manaer
- kube-scheduler

上述组件完成了集群的 pod 调度、弹性伸缩、资源管理、安全控制等功能

### 数据库层面如何扩展功能

| 方法                                                         | 优点               | 缺点     |
| ------------------------------------------------------------ | ------------------ | -------- |
| 方法1. 数据库表预留一个很长的备注字段，之后扩展的内容以某种格式（xml、json、字符串拼接等）存入 | 代码改动小，风险小 | 不美观   |
| 方法2. 直接修改数据库表                                      | 代码改动大，风险大 | 比较美观 |

通常的做法是结合两种方法，刚开始引入特性的时候使用方法1，较小风险，等特性稳定之后，使用方法2进行重构，使代码美观。

## 一些概念
### Master - 集群的控制节点

master 节点上运行关键进程：
- kube-controller-manager：资源对象的**自动化控制**
- kube-apiserver：提供 HTTP Rest 接口的关键服务进程，相当于**集群的入口**，控制资源的增删改查等都要经过它
- kube-scheduler：资源**调度**
- etcd：保存所有资源对象的数据

### Node - 工作负载节点

node 节点上运行的关键进程：
- kubelet：负责 pod 容器的创建、起停
- kube-proxy：实现负载均衡的关键组件
- docker engine：容器的管理

![](images/posts/Pasted%20image%2020230512140017.png)

### Pod

![](images/posts/Pasted%20image%2020230512140042.png)

**pause 根容器**的两个功能：

-   关联该 pod 内容器的状态
    
-   与其他容器共享 IP、挂载的 Volume
    

**Pod 类型**：

-   普通 Pod
    
-   静态 Pod
    
    特点1. 存放位置：静态pod没有被放到 etcd 中，而是在某个 node 的一个具体文件
    
    特点2. 调度策略：只在对应的 node 上启动
    
-   File: `Pod-template.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: string      # pod 名称
  namespace: string # 命名空间
  labels:           # 标签
    name: string
  annotations:      # 注释
    - name: string
spec:
  containers:
  - name: string    # 容器 名称
    image: string   # 容器使用镜像
    imagePullPolicy: [Always | Never | IfNotPresent]    # 镜像拉取策略
    command: []string   # 为容器定义命令
    args: []string      # 为容器定义参数
                        # 以上定义的命令和参数会覆盖容器镜像(image)提供的默认命令和参数，如果只指定了 args，则将参数将配合默认命令使用
    workingDir: string  # 指定容器工作目录
    volumeMounts:
    - name: string      # 名称，可以理解为在本文件中的 volume 对象 id
      mountPath: string # 挂载到容器内的路径
      readOnly: boolean
    ports:
    - name: string
      containerPort: int
      hostPort: int # 大多数容器不需要这个。要在主机上公开的端口号
      protocol: [TCP | UDP | SCTP]
    env:
    - name: string
      value: string
   - name: string
      valueFrom:
        configMapKeyRef:
          name: string
          key: string
    resources:  # 指定容器需要的每种资源的数量，调度程序会利用此信息来决定将 Pod 放在那个节点上
      limits:   # 最小数值
        cpu: string
        memory: string
      requests: # 峰值负载情况下资源占用的最大量
        cpu: string
        memory: string
    livenessProbe:  # 存活探针
      exec:
        command: []string  # 在容器内执行的命令行，工作目录是 "/"
      httpGet:
        host: string    # 连接到的主机名，默认是 pod 的 IP
        port: number
        path: string
        scheme: string # 连接到主机的方案，默认 HTTP
        httpHeaders:
        - name: string
          value: string
      tcpSocket:
        host: string
        port: string
      initialDelaySeconds: 0 # 启动容器后 <----  秒数  ----> 启动可用性探测
      timeoutSeconds: 1
      periodSeconds: 1 # 多久执行一次探测
      successThreshold: 1 # 失败后被认为是成功的最小连续成功次数
      failureThreshold: 1 # 成功后被视为失败的最小连续失败次数。默认为3，最小值为1
    securityContext:    # 定义容器的权限和访问控制设置 （Pod 也有 securityContext，如果两者有相同字段，容器优先）
      privileged: boolean   # 是否特权模式运行容器，特权容器中的进程基本上等同于主机上的 root
      procMount: string
      allowPrivilegeEscalation: boolean # 控制一个进程是否可以获得比其父进程更多的权限
      capabilities: Object  # 运行容器时要添加/删除的能力
      readOnlyRootFilesystem: boolean   # 容器是否有一个只读的根文件系统
      runAsGroup: integer   # 用于运行容器进程的入口的 GID
      runAsNonRoot: boolean # 容器必须以非 root 用户的身份运行， 为 true 时，kubelet 将在运行的时候验证镜像，确保不会以 UID 0 （root）用户的身份运行，如果以 root 用户运行，则无法启动容器
      runAsUser: integer # 运行容器进程的 UID
      seLinuxOptions: Object   
      windowsOptions: Object
  restartPolicy: [Always | OnFailure | Never]   # pod 内容器的重启策略
  nodeSelector: map[string]string   # 须与 node 的标签相匹配，以便此 pod 在节点上调度
  imagePullSecrets:
  - name: string
  hostNetwork: boolean  # 使用主机的网络命名空间，请求主机网络
  volumes:  # 属于 pod 的容器可以挂载的卷列表
  - name: string
    hostPath:
      path: string  # 主机上的目录路径，如果是链接，会链接到真实路径
      type: ["" | DirectoryOrCreate | Directory | FileOrCreate | File | Socket | CharDevice | BlockDevice]
    emptyDir: # 临时目录，分享 pod 的声明周期
      medium: string
      sizeLimit: string
    secret: # 填充这个卷的 secret
      secretName: string
      items:
      - key: string
        path: string
      optional: boolean
      defaultMode: integer
    configMap:
      name: string
      items:
      - key: string
        path: string
    iscsi:  # 一个 iscsi 磁盘资源，连接到一个 kubelet 的主机上，然后暴露给 pod
      chapAuthDiscovery: boolean # 是否支持iSCSI发现CHAP认证
      chapAuthSession: boolean  # 是否支持 iSCSI 会话 CHAP 认证
      initiatorName: string # 自定义启动器名称
      iqn: string  
      lun: integer
      targetPortal: string
      portals: []string
      readOnly: boolean
```

### RC （Replication Controller）、RS（Replication Set）

两者的区别就是 RS 支持集合的 label selector

-   滚动升级（保持副本数量不变，每停一个旧版本的pod，同时启动一个新版本的pod）

### Deployment

内部是使用 RS 来实现的

### HPA（Horizontal Pod Autoscaler）

Pod 水平自动扩缩容

### StatefulSet

区别于 RC、Deployment、DaemonSet、Job 面向无状态服务

StatefulSet为**有状态服务**

-   sts 控制的副本启停顺序受控
    
-   采用持久化存储卷（PV or PVC）
    
-   Headless Service 与配合使用

### Service

-   RS、Service、Pod 之间的关系：

![](images/posts/Pasted%20image%2020230512140240.png)

- 关系详情：
![](images/posts/Pasted%20image%2020230512140255.png)

-  Service 与 微服务？每个 Service 就相当于一个 微服务：

![](images/posts/Pasted%20image%2020230512140320.png)

- Service 很好的解决了 k8s 服务发现的问题

pod+ip 组成的 endpoint 虽然可以访问到服务，但是 pod 一重启，这个 endpoint 随之改变，而在 service 的整个生命周期内，它的 ip 是不变的，只要将 Service 的名称与ip做一个 dns 域名映射便可用域名访问服务


一次实践的截图：
![](images/posts/Pasted%20image%2020230512140350.png)

### Volume
k8s 的支持多种类型的 volume：

-   GlusterFS
    
-   Ceph
    
-   其他分布式文件系统

### Persistent Volume（PV）

集群中某个网络存储对应的一块存储

与 Persistent Volume Claim（PVC）起到了类似的作用

...

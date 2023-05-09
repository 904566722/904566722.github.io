# operator

<!--more-->

#k8s 


# 一、概述

operator 对于 k8s 来说，是一种**扩展机制**，开发人员可以通过 CRD，来扩展 k8s API

operator 通过监视和管理 CRD，来执行一系列被预定的操作，这些操作被编写在 reconcile 逻辑里面，通过 CRD 的增加、删除、更新，可以触发不同的逻辑，在这些逻辑里面也可以对 k8s 原有的资源进行操作，比如 pod、configmap、service 等等

对于运维人员来说，operator 也是相当有用的，operator 可以负责用来做一些更高级的操作，比如扩缩容、集群的备份、恢复等操作，可以减轻运维人员的压力

# 二、名词解释、Operator 的工作流程
## 2.1 名词解释
1. **GroupVersionKind**
![[Pasted image 20230508102917.png]]

GVK 是用来描述一个 kubernetes api 对象的标准
将 GroupVersionKind 拆分成三个部分来理解：
- Group
- Version
- Kind

在 Kubernetes 环境中可以通过命令查看：
```
kubectl api-resources
kubectl explain [kind]
```
![[Pasted image 20230508103207.png]]

![[Pasted image 20230508103226.png]]

2. **GroupVersionResource**

```
`GroupVersionResource` 和 `GroupVersionKind` 都是 Kubernetes API 中用于标识资源的数据结构，它们之间有一定的关系。

`GroupVersionResource` 由三个部分组成：`group`、`version` 和 `resource`。它用于唯一地标识 Kubernetes API 中的一个资源，并指定客户端对该资源执行 CRUD 操作的方式。

`GroupVersionKind` 也由三个部分组成：`group`、`version` 和 `kind`。它用于描述 Kubernetes API 中的一个对象，其中 `kind` 表示对象的类型，例如 `Pod`、`Service` 或 `Deployment`。

可以看出，`GroupVersionResource` 和 `GroupVersionKind` 的区别在于最后一个部分。`GroupVersionResource` 的最后一个部分是资源的名称，而 `GroupVersionKind` 的最后一个部分是对象的类型。但是，它们都包含了相同的前两个部分：`group` 和 `version`。这意味着，通过 `GroupVersionKind` 可以推断出对应的 `GroupVersionResource`，反之亦然。

因此，`GroupVersionResource` 和 `GroupVersionKind` 是紧密相关的概念，它们都是 Kubernetes API 中用于标识资源和对象的重要数据结构。
```

3. **scheme**

scheme 提供了 kubernetes api 对象的**序列化、反序列化**的功能
在 operator 中，scheme 提供了向 kubernetes api **注册自定义对象**的功能

所以每个 operator 都需要 scheme，提供了 go type 与 Kind 的映射，operator 才能与kubernetes api 更好的交互

4. **Manager**

![[Pasted image 20230508105710.png]]

5. **Cache**、**informer**

![[Pasted image 20230508110457.png]]

cache负责：
- 缓存 kubernetes api 对象
- 版本控制
- 索引
informer负责：
- 监听 kubernetes api 中的事件

当 controller 想要访问某个 api 资源，首先查找 cache 中是否存在，如果不存在再往 kuberntes api 中查找，cache 能够减少访问 kuberntes api 的次数，减轻 io 压力

为了保证缓存中的资源与 kuberntes api 中的资源保持一致，informer 需要监听 kubernetes api 中的事件，如果 kuberntes api 中的资源发生改变，cache 中也要同步变化，保证**数据一致性**

cache 还提供了**对象的索引**，提高查找效率。由于api 资源对象是具备版本的，因此 cache 也需要提供**版本控制**的功能，保证与 kuberntes api 中的资源是同一个版本


informer 是基于 cache 完成的一个高级组件，两者相互协作，都是为了让客户端更好的访问api 对象资源，cache主要用来做缓存、版本控制、索引的功能，informer 主要监听 kuberntes api 中的事件，更新缓存中的资源
[aa](#^crd)

这边顺便了解一下 **ListAndWatch** 机制：
与 Informer 类似，ListAndWatch 的作用也是为了让客户端或者控制器更好的获取 k8s 资源，它的大致工作流程如下：
1. 使用 List 操作，从 Kubernetes API 获取全部的资源对象并保存
2. 然后监听 kuberntes api 中的事件，如果对象发生更新，则对自己保存的对象也做相应更新

## 2.2 operator 工作流程

例如当一个 CRD 创建，会经过什么样的流程

一个 crd 资源创建，首先 kubernetes api 会监听到这个资源的创建，informer 会从 kuberntes api 收到这个事件，并获取对应的 crd 资源，将这个资源反序列化成对应的 go type，然后触发控制器中的 reconcile 逻辑，完成预定的操作

![[Pasted image 20230508120012.png]]
 > 动画演示见文尾

1. crd 创建请求发送到 API Server
		API Server 校验请求是否合法，是否有创建这个资源的权限
2. 通过 API Server 后，到达准入控制器（Admission Controller），根据 crd 对应的校验规则进行 crd 资源的校验。此外 Admission Controller 还可能对资源进行修改操作
3. 至此，crd 的创建已经被允许，一个 crd 实例被创建，并保存到 etcd 中
4. Controller Manager 启动对应的 Controller 
5. Controller 执行相应的 reconcile 逻辑，会监听 crd 的变化，并执行相应的逻辑

# 三、实践

> 创建 operator 项目的两个脚手架：
> - kubebuilder
> - OperatorSDK

该实践使用 kubebuilder 来完成，可参考：
[kubebuilder quick start](https://book.kubebuilder.io/quick-start.html)

环境信息：
-   go1.17.10
-   kubelet v1.19.4
-   docker 20.10.12
-   kubebuilder 3.4.0
-   kustomize v4.5.4

1. 初始化项目
```sh
kubebuilder init --domain example.com --repo demo.domain/demo-operator

kubebuilder create api --group demo --version v1 --kind Demo
```
2. 修改`api/v1/xxx_types.go`
```sh
make manifests
```

> 会生成对应的 crd yaml 文件
```txt
./
├── ...
├── config
..  ├── crd
       ├── bases
           └── demo.example.com_demoes.yaml
```
![[image-20220531151549217.png]]

3. 构建 operator 镜像
```sh
docker build -t 904566722/kubebuilder-demo-operator:1.0.0 .
docker push 904566722/kubebuilder-demo-operator:1.0.0
```
4. 部署 crd
```sh
make install 
# $(KUSTOMIZE) build config/crd | kubectl apply -f -
```
5. 部署 rbac 相关 yaml
```sh
 kubectl  apply -f config/rbac/
```
6. 创建 manager controller
修改 image 为上面制作的 operator 镜像

```sh
kubectl apply -f config/manager/manager.yaml
```
7. pod 成功运行之后，创建 cr 实例
```yaml
apiVersion: demo.example.com/v1
kind: Demo
metadata:
  name: demo-sample
spec:
  size: 19
  type: demo
  config_map_name: demo
```

```sh
kubectl apply -f  config/samples/demo_v1_demo.yaml
```

operator 监听到 Demo kind 资源的创建，出发 reconcile：
![[image-20220531165746637.png]]


---
# 参考资料
1.  [Kubernetes Operator 开发教程](https://developer.aliyun.com/article/798703)
2. [kustomization管理k8s对象](https://kubernetes.io/zh/docs/tasks/manage-kubernetes-objects/kustomization/)

---
![[GIF 2023-5-8 12-12-36.gif]]

# 高性能计算-支持作业高级调度策略方案

<!--more-->

## 一、需求背景

### 1.1 提出问题

目前越来越多的应用往 Kubernetes 上迁移，包括需要进行大量计算的人工智能、机器学习，而想要以原生的 Kubernetes 来运行这些任务，在调度策略上并不能完全满足，存在以下问题：

1. 多个 TFJob 同时提交产生的**资源竞争**可能导致**死锁**，多个任务都无法完成
2. 单个大资源任务长期抢占或者不合理分配资源，导致小任务无法获得资源
3. 同一个任务中需要频繁交流的几个子任务分布到了不同节点，导致训练效率低下
4. ...

### 1.2 问题场景举例

1. 多个 TFJob 同时作业导致死锁的场景

	![](images/posts/Pasted%20image%2020230516150933.png)
	
   TFJob1 与 TFJob2 均需要 4 个 GPU 资源，需要其四个子任务 Pod 同时运行才能开始作业，如果 TFJob1 与 TFJob2 同时提交，各自只有两个 Pod 获取到了 GPU 资源，便出现互相等待对方释放资源的情况，形成死锁，无法完成作业，也造成了 GPU 资源的浪费

2. Kubernetes 默认调度策略下，产生较多碎片资源的场景

   ![](images/posts/Pasted%20image%2020230516150945.png)

   Kubernetes 默认使用的 LeastRequestedPriority 优先级策略会将 Pod 优先调度到消耗资源少的节点上，让各节点的资源使用率尽量均匀，但这样容易产生碎片，如上图所示，在集群的角度，还可以提供 2 个 GPU 资源，但无法调度一个需要 2 GPU 资源的 Pod

3. ...

### 1.3 需求

> https://wiki.cestc.cn/pages/viewpage.action?pageId=190216766

至少需要支持以下两种调度策略：

- **Gang Scheduling**

  作业的所有子任务都能满足资源需求才整体分配，否则不分配任务资源。避免由于资源死锁，导致大作业挤占小作业

- **Binpack Scheduling**

  作业优先集中分配在某个节点，当节点资源不足时，依次在下一节点集中分配，适合单机多卡训练任务，避免跨机数据传输，防止资源碎片

## 二、*友商方案对比

### 2.1 Kubernetes Scheduler 扩展方式简单对比

| 扩展调度的方式       | 特点                                                         | 缺点                                                         |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Scheduler Extender   | 支持 Filter、Preempt、Prioritize、Bind 的扩展；<br />首先执行 Kubernetes 内置的调度策略，通过 http 调用 Extender 注册的 webhook 运行扩展逻辑，影响调度结果 | 使用 http 请求获取自定义的调度结果，<font color="red">受网络影响，性能不及本地函数调用</font>；<br />扩展点有限，<font color="red">较不灵活</font>；<br /><font color="red">必须执行完 Kubernetes 默认的 Filter 策略</font>后才调用自定义的策略 |
| Multiple schedulers  | 调度性能强于 Scheduler Extender<br />可扩展性强              | 与默认调度器同时部署会导致<font color="red">资源冲突</font><br /><font color="red">研发、维护成本较高</font> |
| Scheduling Framework | Kubernetes 调度器的可插拔架构                                |                                                              |

- Scheduler Extender

  ![](images/posts/Pasted%20image%2020230516151003.png)

- Multiple Schedulers

  ![](images/posts/Pasted%20image%2020230516151015.png)

- Scheduling Framework

  ![](images/posts/Pasted%20image%2020230516151026.png)


### 2.2 友商已有解决方案对比

#### 2.2.1 华为云 - Volcano

> https://volcano.sh/zh/

Volcano是[CNCF](https://www.cncf.io/) 下首个也是唯一的基于Kubernetes的容器批量计算平台，主要用于**高性能计算场景**。它提供了Kubernetes目前缺 少的一套机制，这些机制通常是**机器学习大数据应用、科学计算、特效渲染等**多种高性能工作负载所需的。作为一个通用批处理平台，**Volcano与几乎所有的主流计算框 架无缝对接**，如[Spark](https://spark.apache.org/) 、[TensorFlow](https://tensorflow.google.cn/) 、[PyTorch](https://pytorch.org/) 、 [Flink](https://flink.apache.org/) 、[Argo](https://argoproj.github.io/) 、[MindSpore](https://www.mindspore.cn/) 、 [PaddlePaddle](https://www.paddlepaddle.org.cn/) 等。它还提供了包括基于各种主流架构的CPU、GPU在内的异构设备混合调度能力。Volcano的设计 理念建立在15年来多种系统和平台大规模运行各种高性能工作负载的使用经验之上，并结合来自开源社区的最佳思想和实践。(https://volcano.sh/zh/docs/#%E7%AE%80%E4%BB%8B)



支持的**调度策略**：

- Gang-scheduling
- Binpack-scheduling
- Fair-share scheduling
- Queue scheduling
- Preemption scheduling
- Topology-based scheduling
- Reclaims
- Backfill
- Resource Reservation
- (Volcano支持用户自定义plugin和action以支持更多调度算法)



支持的**计算框架**：

- TensoFlow
- Pytorch
- MindSpore
- PaddlePaddle
- Spark
- Flink
- OpenMPI
- Horovod
- MXNet
- Kubeflow
- Argo
- KubeGene

#### 2.2.2 阿里云方案

- [阿里云 Gang scheduling](https://help.aliyun.com/document_detail/178169.html)
- [阿里云 Capacity Scheduling](https://help.aliyun.com/document_detail/213695.html)

只找到相关的一些实现思路、解决方案，没有已有的开源项目

## 三、整体方案架构/组件架构

### 3.1选用开源项目 Volcano 以支持多种调度策略

选用已有的，由华为**开源**的 Volcano 项目，**满足我们的需求，提供了丰富的调度策略与 Job 控制能力。Volcano 与 Kubernetes 天然兼容**，其系统架构如下图所示：

![](images/posts/Pasted%20image%2020230516151048.png)

Volcano 主要由 Scheduler、ControllerManager、Admission 组成：

- **Scheduler**：通过一些列 action、plugin 调度 Job，为其找到最合适的节点，与 Kubernetes default-scheduler 相比，Volcano 支持 Job 的多种调度算法

  - action：定义了调度各环节中执行的动作
  - plugin：根据不同的场景提供了 action 中算法的具体细节

  > scheduler 具体工作流程：https://volcano.sh/zh/docs/schduler_introduction/#%E5%B7%A5%E4%BD%9C%E6%B5%81

- **ControllerManager**：管理 CRD 资源的生命周期。主要由 Queue CM、PodGroup CM、VCJob CM 组成

- **Admission**：负责对 CRD API 资源进行校验

### 3.2 如何对接到我们的集群

通过 **Application Operator** 的形式，用户在 OperatorHub 界面通过安装 **volcano-operator**，将 Volcano 的相关资源安装到集群中：

![](images/posts/Pasted%20image%2020230516151135.png)


## 四、方案流程详细设计

### 4.1 流程主要分为三大部分 （具体图示见 3.2）

- volcano 的**安装**：由 volcano-operator 来完成 volcano 所需资源的安装
- volcano 的**使用**
  - 通过 volcano-operator 在界面上提供 volcano APIs 的操作入口
  - 对于具体调度逻辑的验证
- volcano 的**卸载**
  - 删除用于触发创建 volcano 资源的 VolcanoBackend CR 实例，触发 volcano-operator 完成 volcano 相关资源的卸载
  - 卸载 volcano-operator

### 4.2 该方案具体需要完成工作

| 任务项                 | todo                                                         |
| ---------------------- | ------------------------------------------------------------ |
| 调度逻辑支持           | 使用  [volcano](https://github.com/volcano-sh/volcano)  开源项目（huawei） |
| volcano 资源安装、卸载 | volcano-operator 开发                                        |
| 组件 e2e               | 新增特性，ceake-origin 需新增对应的测试例<br />需具体了解 volcano 项目相关特性，完成测试例开发 |

## 五、API 接口设计/参考

目前 volcano-operator 提供的 api 主要是 1 个自身的 API  + volcano 项目提供的 5 个 API 共 6 个 API

![](images/posts/Pasted%20image%2020230516151157.png)
### 5.1 [VolcanoBackend](http://10.253.11.215:6060/pkg/code.cestc.cn/ccos/cea/volcano-operator/apis/operator/v1/#VolcanoBackend)

> - VolcanoBackend 是 volcano-operator 本身提供的 api
> - volcano-operator 在安装的时候会自己创建一个默认的 VolcanoBackend 资源，位于`default`命名空间下，名称为`default`该资源主要有两个作用：
>   - 触发 VolcanoBackendReconcile 逻辑，从而安装 volcano 的[相关资源]()
>   - 卸载 volcano-operator 之前需要删除该默认资源，卸载 volcano 的相关资源
>
> - 用户无需创建该资源

| Property          | Type                                                         | Description |
| ----------------- | ------------------------------------------------------------ | ----------- |
| metav1.TypeMeta   | [metav1.TypeMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#TypeMeta) |             |
| metav1.ObjectMeta | [metav1.ObjectMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#ObjectMeta) |             |
| Spec              | [VolcanoBackendSpec](http://10.253.11.215:6060/pkg/code.cestc.cn/ccos/cea/volcano-operator/apis/operator/v1/#VolcanoBackendSpec) |             |
| Status            | [VolcanoBackendStatus](http://10.253.11.215:6060/pkg/code.cestc.cn/ccos/cea/volcano-operator/apis/operator/v1/#VolcanoBackendStatus) |             |

[VolcanoBackendSpec](http://10.253.11.215:6060/pkg/code.cestc.cn/ccos/cea/volcano-operator/apis/operator/v1/#VolcanoBackendSpec):

| Property    | Type                                                    | Description    |
| ----------- | ------------------------------------------------------- | -------------- |
| Description | [string](http://10.253.11.215:6060/pkg/builtin/#string) | 可选的描述字段 |

`e.g.`

```yaml
apiVersion: operator.volcano.sh/v1
kind: VolcanoBackend
metadata:
  finalizers:
  - operator.volcano.sh/finalizer
  name: default
  namespace: default
spec:
  description: 'func: triggering volcano resources creation'
```

### 5.2 [Job](http://10.253.11.215:6060/pkg/code.cestc.cn/ccos/cea/volcano-operator/apis/batch/v1alpha1/#Job)

> - Job 是 [volcano](https://github.com/volcano-sh/volcano) 项目提供的 API，通过 OperatorHub 中的 volcano-operator 给用户提供界面上的操作入口

| Property          | Type                                                         | Description                                                  |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| metav1.TypeMeta   | [metav1.TypeMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#TypeMeta) |                                                              |
| metav1.ObjectMeta | [metav1.ObjectMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#ObjectMeta) |                                                              |
| Spec              | [vcv1alpha1.JobSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/batch/v1alpha1/#JobSpec) | Specification of the desired behavior of the volcano job, including the minAvailable |
| Status            | [vcv1alpha1.JobStatus](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/batch/v1alpha1/#JobStatus) | Current status of the volcano Job                            |

  [vcv1alpha1.JobSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/batch/v1alpha1/#JobSpec):

| Property                | Type                                                         | Description                                                  |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| SchedulerName           | [string](http://10.253.11.215:6060/pkg/builtin/#string)      | SchedulerName is the default value of `tasks.template.spec.schedulerName`. |
| MinAvailable            | [int32](http://10.253.11.215:6060/pkg/builtin/#int32)        | The minimal available pods to run for this Job<br />Defaults to the summary of tasks' replicas |
| Volumes                 | [] [VolumeSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/batch/v1alpha1/#VolumeSpec) | The volumes mount on Job                                     |
| Tasks                   | [] [TaskSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/batch/v1alpha1/#TaskSpec) | Tasks specifies the task specification of Job                |
| Policies                | [] [LifecyclePolicy](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/batch/v1alpha1/#LifecyclePolicy) | Specifies the default lifecycle of tasks                     |
| Plugins                 | map [string] []string                                        | Specifies the plugin of job<br />Key is plugin name, value is the arguments of the plugin |
| RunningEstimate         | *[metav1.Duration](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#Duration) | Running Estimate is a user running duration estimate for the job<br />Default to nil |
| Queue                   | [string](http://10.253.11.215:6060/pkg/builtin/#string)      | Specifies the queue that will be used in the scheduler, "default" queue is used this leaves empty. |
| MaxRetry                | [int32](http://10.253.11.215:6060/pkg/builtin/#int32)        | Specifies the maximum number of retries before marking this Job failed.<br />Defaults to 3. |
| TTLSecondsAfterFinished | *[int32](http://10.253.11.215:6060/pkg/builtin/#int32)       | ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Completed or Failed).  If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted. If this field is unset, the Job won't be automatically deleted. If this field is set to zero, the Job becomes eligible to be deleted immediately after it finishes. |
| PriorityClassName       | [string](http://10.253.11.215:6060/pkg/builtin/#string)      | If specified, indicates the job's priority.                  |
| MinSuccess              | *[int32](http://10.253.11.215:6060/pkg/builtin/#int32)       | The minimal success pods to run for this Job<br />Minimum=1  |

`e.g.` // TODO

```yaml

```

### 5.3 [Command](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/bus/v1alpha1/#Command)

> - Command 是 [volcano](https://github.com/volcano-sh/volcano) 项目提供的 API，通过 OperatorHub 中的 volcano-operator 给用户提供界面上的操作入口

| Property          | Type                                                         | Description                                                  |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| metav1.TypeMeta   | [metav1.TypeMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#TypeMeta) |                                                              |
| metav1.ObjectMeta | [metav1.ObjectMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#ObjectMeta) |                                                              |
| Action            | [string](http://10.253.11.215:6060/pkg/builtin/#string)      | Action defines the action that will be took to the target object. |
| TargetObject      | *[metav1.OwnerReference](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#OwnerReference) | TargetObject defines the target object of this command.      |
| Reason            | [string](http://10.253.11.215:6060/pkg/builtin/#string)      | Unique, one-word, CamelCase reason for this command.         |
| Message           | [string](http://10.253.11.215:6060/pkg/builtin/#string)      | Human-readable message indicating details of this command.   |

`e.g.` // TODO

```yaml
```



### 5.4 [Numatopology](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/nodeinfo/v1alpha1/#Numatopology)

> - Numatopology 是 [volcano](https://github.com/volcano-sh/volcano) 项目提供的 API，通过 OperatorHub 中的 volcano-operator 给用户提供界面上的操作入口

| Property          | Type                                                         | Description |
| ----------------- | ------------------------------------------------------------ | ----------- |
| metav1.TypeMeta   | [metav1.TypeMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#TypeMeta) |             |
| metav1.ObjectMeta | [metav1.ObjectMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#ObjectMeta) |             |
| Spec              | [NumatopoSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/nodeinfo/v1alpha1/#NumatopoSpec) |Specification of the numa information of the worker node|

[NumatopoSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/nodeinfo/v1alpha1/#NumatopoSpec):

| Property    | Type                                                         | Description                                                  |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Policies    | map[ [PolicyName](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/nodeinfo/v1alpha1/#PolicyName) ] [string](http://10.253.11.215:6060/pkg/builtin/#string) | Specifies the policy of the manager                          |
| ResReserved | map[ [string](http://10.253.11.215:6060/pkg/builtin/#string) ] [string](http://10.253.11.215:6060/pkg/builtin/#string) | Specifies the reserved resource of the node<br />Key is resource name |
| NumaResMap  | map[ [string](http://10.253.11.215:6060/pkg/builtin/#string) ] [ResourceInfo](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/nodeinfo/v1alpha1/#ResourceInfo) | Specifies the numa info for the resource<br />Key is resource name |
| CPUDetail   | map[ [string](http://10.253.11.215:6060/pkg/builtin/#string) ] [CPUInfo](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/nodeinfo/v1alpha1/#CPUInfo) | Specifies the cpu topology info<br />Key is cpu id           |

`e.g.` // TODO

```yaml

```

### 5.5 [Queue](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#Queue)

> - Queue 是 [volcano](https://github.com/volcano-sh/volcano) 项目提供的 API，通过 OperatorHub 中的 volcano-operator 给用户提供界面上的操作入口

| Property          | Type                                                         | Description                                                  |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| metav1.TypeMeta   | [metav1.TypeMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#TypeMeta) |                                                              |
| metav1.ObjectMeta | [metav1.ObjectMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#ObjectMeta) |                                                              |
| Spec              | [QueueSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#QueueSpec) | Specification of the desired behavior of the queue.<br />More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status |
| Status            | [QueueStatus](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#QueueStatus) | The status of queue.                                         |

[QueueSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#QueueSpec):

| Property       | Type                                                         | Description                                                  |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Weight         | [int32](http://10.253.11.215:6060/pkg/builtin/#int32)        |                                                              |
| Capability     | [v1.ResourceList](http://10.253.11.215:6060/pkg/k8s.io/api/core/v1/#ResourceList) |                                                              |
| Reclaimable    | *[bool](http://10.253.11.215:6060/pkg/builtin/#bool)         | Reclaimable indicate whether the queue can be reclaimed by other queue |
| ExtendClusters | [] [Cluster](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#Cluster) | extendCluster indicate the jobs in this Queue will be dispatched to these clusters. |
| Guarantee      | [Guarantee](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#Guarantee) | Guarantee indicate configuration about resource reservation  |

`e.g.` // TODO

```yaml
```



### 5.6 [PodGroup](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#PodGroup)

> - PodGroup 是 [volcano](https://github.com/volcano-sh/volcano) 项目提供的 API，通过 OperatorHub 中的 volcano-operator 给用户提供界面上的操作入口

| Property          | Type                                                         | Description                                                  |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| metav1.TypeMeta   | [metav1.TypeMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#TypeMeta) |                                                              |
| metav1.ObjectMeta | [metav1.ObjectMeta](http://10.253.11.215:6060/pkg/k8s.io/apimachinery/pkg/apis/meta/v1/#ObjectMeta) |                                                              |
| Spec              | [PodGroupSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#PodGroupSpec) | Specification of the desired behavior of the pod group.<br />More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status |
| Status            | [PodGroupStatus](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#PodGroupStatus) | Status represents the current information about a pod group.<br />This data may not be up to date. |

[PodGroupSpec](http://10.253.11.215:6060/pkg/volcano.sh/apis/pkg/apis/scheduling/v1beta1/#PodGroupSpec):

| Property          | Type                                                         | Description                                                  |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| MinMember         | [int32](http://10.253.11.215:6060/pkg/builtin/#int32)        | MinMember defines the minimal number of members/tasks to run the pod group;<br />if there's not enough resources to start all tasks, the scheduler will not start anyone. |
| MinTaskMember     | map[ [string](http://10.253.11.215:6060/pkg/builtin/#string) ] [int32](http://10.253.11.215:6060/pkg/builtin/#int32) | MinTaskMember defines the minimal number of pods to run each task in the pod group;<br />if there's not enough resources to start each task, the scheduler will not start anyone. |
| Queue             | [string](http://10.253.11.215:6060/pkg/builtin/#string)      | Queue defines the queue to allocate resource for PodGroup; if queue does not exist, the PodGroup will not be scheduled. Defaults to `default` Queue with the lowest weight. |
| PriorityClassName | [string](http://10.253.11.215:6060/pkg/builtin/#string)      | If specified, indicates the PodGroup's priority. "system-node-critical" and "system-cluster-critical" are two special keywords which indicate the  highest priorities with the former being the highest priority. Any other name must be defined by creating a PriorityClass object with that name.  If not specified, the PodGroup priority will be default or zero if there is no |
| MinResources      | [v1.ResourceList](http://10.253.11.215:6060/pkg/k8s.io/api/core/v1/#ResourceList) | MinResources defines the minimal resource of members/tasks to run the pod group; if there's not enough resources to start all tasks, the scheduler will not start anyone. |

`e.g.` // TODO

```yaml
```

## *、参考资料

1. https://www.6aiq.com/article/1628641646793
2. https://support.huaweicloud.com/bestpractice-cce/cce_bestpractice_0075.html#section1
3. https://volcano.sh/
4. https://developer.aliyun.com/article/766998
5. https://www.cncf.io/wp-content/uploads/2020/08/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%A6%82%E4%BD%95%E6%89%A9%E5%B1%95Kubernetes-%E8%B0%83%E5%BA%A6%E5%99%A8%E6%94%AF%E6%8C%81-AI-%E5%92%8C%E5%A4%A7%E6%95%B0%E6%8D%AE%E4%BD%9C%E4%B8%9A%EF%BC%9F1-xi-jiang.pdf
6. https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/kep/9-capacity-scheduling/README.md

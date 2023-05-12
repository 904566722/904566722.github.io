# 问题定位：Evicted

<!--more-->

#k8s #问题定位

## 问题现场

![](images/posts/Untitled-16527874479231.png)

```
kubectl -n product-ebs get pod -o wide | grep vtype-xxx
```
扎到了一个状态为 `Evicted` 的 pod

## 问题分析

通过现场可以看到 pod 原先的节点，所以可以查看一下节点的日志

![](images/posts/Untitled%201-16527874479242.png)

接着就发现了节点有磁盘压力，kubelet 主动终止 pod 以回收节点上的资源，以此来保证节点的稳定

## 学习
### 可能导致节点压力的因素有什么

cpu、内存、磁盘空间...

### kubelet 是如何做出驱逐的决定的

1.  分析这个问题的步骤： 回答这个问题需要了解 Kubernetes 中 kubelet 组件以及 Eviction API，再结合节点资源使用情况等因素来判断是否要驱逐 Pod。具体的分析步骤如下：

-   了解 Kubernetes 中 kubelet 组件和 Eviction API 的作用和原理。
-   确认 kubelet 是否开启了 Eviction 功能。
-   判断当前节点资源（如内存、CPU、磁盘空间）使用情况是否达到了预定义的阈值，若达到或超出，则根据优先级逻辑对 Pod 进行驱逐操作。

2.  产生这个问题的原因： 在 Kubernetes 下，由于各种原因（如资源紧缺，节点故障等），kubelet 可能会决定驱逐一些 Pod 以保证集群正常运转，因此了解 kubelet 决策的原因和方式对于提高 Kubernetes 集群的稳定性和安全性非常重要。
    
3.  这个问题的答案： kubelet 驱逐 Pod 是通过以下步骤进行的：
    
4.  kubelet 定期与 kube-apiserver 通信，获取当前 Node 上的 Pod 列表信息。
    
5.  kubelet 根据容器的 QoS 类别（Guaranteed > Burstable > BestEffort） 和优先级（pod priority/Preemption）进行排序。（Preemption 时过程中，kubelet 不会限制一些特定 Pod 从来不被驱逐。）
    
6.  kubelet 判断当前 Node 是否处于 out of memory 或者 DiskPressure 的状态，如果是的话，则使用相应的 Eviction API 驱逐 Pod。
    
7.  如果还没有达到阈值，则尝试驱逐优先级最低的 Pod。如果此时节点有足够的资源可供使用，则该操作不会执行。否则，kubelet 将继续驱逐优先级下一个较低的 Pod 直到可以保证目标阈值。
    
8.  如果使用上述步骤无法满足 Eviction 要求（如Pod 强占资源），kubelet 可能会强制删除其他 Pod 以便为当前占用的 Pod 腾出资源。
    

需要注意的是，kubelet 是被动的进行驱逐操作的，即只有在当前节点资源使用情况达到或超过了预设的阈值时才会进行驱逐，而这些阈值可以通过修改 Kubernetes 集群中的参数来调整。

**容器的 QoS**：

```sh
kubectl describe pod <pod-name> | grep QoS
```

该命令会列出 Pod 的详细信息，并在结果中搜索 QoS 相关的部分。

Kubernetes 中的 QoS (Quality of Service) 是一个特性，它用来管理节点上运行的 Pod 的资源分配和调度。在 Kubernetes 中，QoS 有三种级别：

-   `Guaranteed`：这种类型的 Pod 被保证能够获得所请求的 CPU 和内存资源。如果节点上的资源不足，优先级较低的 Pod 将被暂停或驱逐。
-   `Burstable`：这种类型的 Pod 具有最小的 CPU 和内存要求，但可以在需要时进行扩展，以获得更多资源。当节点上的资源不足时，Burstable Pod 可能会受到限制，但不会被完全暂停或驱逐。
-   `BestEffort`：这种类型的 Pod 不会被保证任何资源。它们将尽力在节点上占用尽可能少的资源，并且在节点资源不足时首先被削减或删除。

QoS 主要的作用是帮助 Kubernetes 管理资源，确保相同级别的 Pod 在节点上得到公平的资源分配，并且在资源不足的情况下，根据其级别的不同，采取适当的措施以保持节点的健康状态。

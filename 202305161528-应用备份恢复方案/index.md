# 应用备份恢复方案

<!--more-->

## 一、方案背景

在 CeaKE 环境中许多应用会产生数据，通过应用备份，可以将期望备份的 k8s 资源、PV 进行备份、恢复等操作，防止数据的丢失

## 二、如何实现

### 2.1 相关技术

- **Velero**

  > 官方文档：https://velero.io/docs/v1.9/index.html

  Velero 作为提供备份和恢复 **Kubernetes 集群资源**和**持久卷**能力的工具，提供以下功能：

  - 备份集群，并在丢失时恢复
  - 将集群迁移到其他集群
  - ...

  持久卷备份的两种方式：

  - 快照（条件：存储后端需要具备快照API）
  - Restic（不支持 hostPath）

- **oadp-operator**

  > 开源代码：https://github.com/openshift/oadp-operator
  >
  > 参考文档：https://access.redhat.com/documentation/zh-cn/openshift_container_platform/4.9/html/backup_and_restore/index
  
  该 operator 实现在集群中**安装 Velero**，并**提供 API** 给用户去备份与恢复应用

### 2.2 整体概览

![](images/posts/image-20220817202409093.png)

**大致流程说明：**

1. **安装 oadp-operator**

   用户通过 OperatorHub 安装 oadp-operator

	![](images/posts/image-20220817175445266.png)

2. **安装 Velero**

   oadp-operator 安装成功后，创建 DPA（DataProtectionApplication）实例，触发 oadp-operator 安装 Velero

   > 假设我拥有一个集群外的 Minio，我想将数据备份到该后端，首先创建一个带有 Minio 账号密码的 Secret
   >
   >![](images/posts/image-20220817180118920.png)
   >
   > DPA 样例：
   >
   > ```yaml
   > apiVersion: oadp.ccos.io/v1alpha1
   > kind: DataProtectionApplication
   > metadata:
   >   name: velero-sample
   >   namespace: ccos-adp
   > spec:
   >      backupLocations:
   >     - velero:
   >         config:
   >           insecureSkipTLSVerify: 'true'
   >           profile: default
   >           region: minio
   >           s3ForcePathStyle: 'true'
   >           s3Url: 'http://10.253.11.215:9000'
   >         credential:
   >           key: cloud
   >           name: cloud-credentials
   >         default: true
   >         objectStorage:
   >           bucket: velero
   >           prefix: single
   >         provider: aws
   >   configuration:
   >     restic:
   >       enable: true
   >     velero:
   >       defaultPlugins:
   >         - aws
   >         - csi
   >         - ccos
   > ```

   DPA 创建成功后，触发 oadp-operator 创建 deployment/velero 以及 daemonset/restic（dpa 配置 restic.enable 为 true 才创建）

3. **备份**

   Velero 安装成功后，用户创建 Backup 实例，指定 BSL（BackupStorageLocation）以及其他相关参数，触发 Velero 备份逻辑

## 三、实现功能（不同备份场景实践）

### 3.1 应用备份

#### 准备工作

模拟一个 mysql 应用

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: mysql
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: local-storage-pvc
  namespace: mysql
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ccos-hostpath-data-stor
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-local-storage
  namespace: mysql
  labels:
    app: mysql-local-storage
spec:
  selector:
    matchLabels:
      app: mysql-local-storage
  template:
    metadata:
      labels:
        app: mysql-local-storage
    spec:
      containers:
      - image: image.cestc.cn/ceake/mysql:5.6
        name: mysql
        command: ["sleep", "1d"]
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: admin123
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /data
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: local-storage-pvc
```



#### 3.1.1 （集群内）备份与恢复

- 往挂载的目录里面写入数据

![](images/posts/image-20220817182336142.png)

- 创建 Backup，对 mysql 的命名空间进行备份

  ![](images/posts/image-20220817182642993.png)

  删除 mysql 命名空间下的相关资源

- 查看 Minio 后端对应的备份数据

  k8s 资源数据：

  ![](images/posts/image-20220817182844727.png)

  pv 数据：

	![](images/posts/image-20220817183001227.png)

- 创建 Restore 进行恢复操作

  指定要恢复的备份名称

  ![](images/posts/image-20220817183238069.png)

  恢复结果：

  ![](images/posts/image-20220817183336178.png)

#### 3.1.2 定时备份任务

- 创建 Schedule，指定每天 10:40 触发一个对于 mysql 命名空间的备份

![](images/posts/image-20220817184541289.png)

- 10:40 触发备份：

  ![](images/posts/image-20220817184640568.png)

#### 3.1.3 （跨集群）备份与恢复

- 新集群创建与源集群相同的 DPA，Velero 会对同步 Backup 资源

- 资源同步完成后，创建 Restore 进行恢复

  > <font color="red">问题 1：</font>**（已解决）**
  >
  > ![](images/posts/image-20220817194656272.png)
  >
  > 查看 kube-ovn-controller 相关日志发现 ip 已被占用
  >
  > ![](images/posts/image-20220817195005326.png)
  >
  > （192.168.0.65 为备份的时候 pod 的 ip）
  >
  > 删除对应 ip 的 pod 之后重新进行恢复操作，仍未成功...
  >
  > 查看新的报错：
  >
  > ![](images/posts/image-20220818104150647.png)
  >
  > restic 找不到 id（如果这个集群之前创建过 DPA，需要检查一下 ResticRepository 配置是否跟源集群的一样，如果不一样，需要手动同步）
  >
  > ![](images/posts/image-20220818104323321.png)

- 恢复成功

![](images/posts/image-20220818104350164.png)

### 3.2 集群备份（无法使用 velero 实现）

> 1. 备份的对象？
>
>    etcd（备份之后的文件：etcd快照、静态pod资源压缩包）
>
> 2. 有什么样集群坏掉的场景？
>
>    etcd异常、kube-apiserver异常等等
>
> 物理备份 & 逻辑备份
>
> - 物理备份：etcd 备份
> - 逻辑备份：基于 velero 的备份

#### 3.2.1 <font color="red">velero 为什么无法做集群备份？</font>

1. 在集群不可用的情况下，**velero 应用也无法在集群中使用**，无法做恢复操作
2. etcd 的数据使用 hostPath 方式挂载到 etcd pod，velero 不**支持 hostPath 备份**，无法备份数据，只能备份 yaml 资源

![](images/posts/image-20220823195811139.png)

#### 3.2.2 *官方使用的备份方式实践（ing...）

- 执行集群备份脚本

  ```sh
  sh /usr/local/bin/cluster-backup.sh <备份目录>
  ```

  > ```sh
  > [root@guxsve0ry7y4fhl ~]# sh /usr/local/bin/cluster-backup.sh /root/bak
  > found latest kube-apiserver: /etc/kubernetes/static-pod-resources/kube-apiserver-pod-15
  > found latest kube-controller-manager: /etc/kubernetes/static-pod-resources/kube-controller-manager-pod-7
  > found latest kube-scheduler: /etc/kubernetes/static-pod-resources/kube-scheduler-pod-6
  > found latest etcd: /etc/kubernetes/static-pod-resources/etcd-pod-2
  > e714891717a1c13ce92256f0699c1918d84f696fe0491afc389f01ee3fa9f18c
  > etcdctl version: 3.5.0
  > API version: 3.5
  > {"level":"info","ts":1661246888.927277,"caller":"snapshot/v3_snapshot.go:68","msg":"created temporary db file","path":"/root/bak/snapshot_2022-08-23_172803.db.part"}
  > {"level":"info","ts":1661246888.9341154,"logger":"client","caller":"v3/maintenance.go:211","msg":"opened snapshot stream; downloading"}
  > {"level":"info","ts":1661246888.9348633,"caller":"snapshot/v3_snapshot.go:76","msg":"fetching snapshot","endpoint":"https://10.253.10.107:2379"}
  > {"level":"info","ts":1661246891.0776105,"logger":"client","caller":"v3/maintenance.go:219","msg":"completed snapshot read; closing"}
  > {"level":"info","ts":1661246894.7033532,"caller":"snapshot/v3_snapshot.go:91","msg":"fetched snapshot","endpoint":"https://10.253.10.107:2379","size":"332 MB","took":"5 seconds ago"}
  > {"level":"info","ts":1661246894.7034357,"caller":"snapshot/v3_snapshot.go:100","msg":"saved","path":"/root/bak/snapshot_2022-08-23_172803.db"}
  > Snapshot saved at /root/bak/snapshot_2022-08-23_172803.db
  > Deprecated: Use `etcdutl snapshot status` instead.
  > 
  > {"hash":1726260631,"revision":43288532,"totalKey":27994,"totalSize":332025856}
  > snapshot db and kube resources are successfully saved to /root/bak
  > ```

  生成备份文件：

  ```shell
  [root@guxsve0ry7y4fhl ~]# ll /root/bak/
  total 324312
  -rw-------. 1 root root 332025888 Aug 23 17:28 snapshot_2022-08-23_172803.db                          # etcd 快照
  -rw-------. 1 root root     63022 Aug 23 17:28 static_kuberesources_2022-08-23_172803.tar.gz          # 静态 pod 的资源
  ```
  
- 模拟集群出问题的情况

- 执行恢复脚本恢复集群

### 3.3 其他备份场景验证

#### 3.3.1 ccos 相关资源备份（velero-plugins）

- [x] SecurityContextConstraints 备份及恢复
- [x] Route 备份及恢复
- [ ] ...

#### 3.3.* 待补充

## 四、前端相关截图

### 4.1 operator 安装

进入 Operator 仓库选择 OADP-Operator 进行安装

![](images/posts/image-20220823163829145.png)

### 4.2 安装 Velero

- 选择创建 DPA 实例

![](images/posts/image-20220823164058506.png)

- 配置 DPA

![](images/posts/image-20220823190753542.png)


### 4.3 单次备份

- 选择创建 Backup 实例

  ![](images/posts/image-20220823193110012.png)

- 配置 Backup 实例参数

  主要配置**备份名称、存储位置、命名空间**等信息

  ![](images/posts/image-20220823193208579.png)

### 4.5 定时备份

- 选择创建 Schedule 实例

  ![](images/posts/image-20220823194140058.png)

- 配置 Schedule 实例参数

  ![](images/posts/image-20220823194222112.png)

### 4.4 恢复

- 选择创建 Restore 实例

  ![](images/posts/image-20220823193850049.png)

- 配置 Restore 实例参数

  ![](images/posts/image-20220823193932678.png)

### 4.* ...

## 五、关联仓库

1. oadp-operator
2. velero
3. velero-plugin-for-aws
4. velero-plugin-for-csi
5. velero-plugin-for-gcp
6. velero-plugin-for-microsoft-azure
7. ccos-velero-plugin
8. kubevirt-velero-plugin
9. volume-snapshot-mover




| index | 仓库                                  | 作用                                                         | 开源地址                                                     | code.cestc.cn                                         |
| ----- | ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------- |
| 01    | （必须）oadp-operator                 | **安装 Velero**，提供 API                                    | https://github.com/openshift/oadp-operator                   | https://code.cestc.cn/ccos/cea/oadp-operator          |
| 02    | （必须）velero                        | 做**具体备份恢复等操作**                                     | https://github.com/vmware-tanzu/velero                       | https://code.cestc.cn/ccos/cea/velero                 |
| 03    | （必须）velero-plugin-for-s3          | 支持**对象存储**备份和恢复（**aws s3**）                     | https://github.com/vmware-tanzu/velero-plugin-for-aws        | https://code.cestc.cn/ccos/cea/velero-plugin-for-s3   |
| 04    | （）velero-plugin-for-csi             | 支持使用 **csi 快照**备份持久卷                              | https://github.com/vmware-tanzu/velero-plugin-for-csi        | https://code.cestc.cn/ccos/cea/velero-plugin-for-csi  |
|       | ~~velero-plugin-for-gcp~~             |                                                              | https://github.com/vmware-tanzu/velero-plugin-for-gcp        |                                                       |
|       | ~~velero-plugin-for-microsoft-azure~~ |                                                              | https://github.com/vmware-tanzu/velero-plugin-for-microsoft-azure |                                                       |
| 05    | （）ccos-velero-plugin                | 使用对象存储备份和恢复 Ccos Container Platform 资源          | https://github.com/openshift/openshift-velero-plugin         | https://code.cestc.cn/ccos/cea/velero-plugin          |
| 06    | （）kubevirt-velero-plugin            | 支持备份并恢复**由Kubevirt和CDI管理的虚拟机**，数据流和其他资源 | https://github.com/kubevirt/kubevirt-velero-plugin           | https://code.cestc.cn/ccos/cea/kubevirt-velero-plugin |
| 07    | （）volume-snapshot-mover             | 将群集的快照重新定位到对象存储中                             | https://github.com/konveyor/volume-snapshot-mover            | https://code.cestc.cn/ccos/cea/volume-snapshot-mover  |

新增镜像：

```
oadp-operator
oadp-operator-bundle

velero
velero-restic-restore-helper
velero-plugin-for-s3
velero-plugin-for-csi
velero-plugin
kubevirt-velero-plugin
volume-snapshot-mover
```



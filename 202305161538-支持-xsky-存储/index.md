# 支持 xsky 存储

<!--more-->

## *、总结

![](images/posts/image-20220620180218098.png)

- **节点安装 iscsi、multipath**

  option#1. 装机的时候完成

  option#2. 容器化（CSI Driver使用的镜像内没有安装 iscsi、multipath，无法容器化）

- **对接 xsky 存储**

  由 xsky-operator 拉起所需的通用资源：CRD、CSI Driver 相关资源

- **添加 xsky 存储后端**

  通过修改 xsky-cr，编辑 xsky 存储后端的相关信息，operator 创建所需的资源：

  - secret
  - accesspath
  - storageclass

- **修改 xsky 存储后端**

  通过修改 xsky-cr，operator 根据 storageclass 查找到对应的 secret、accesspath、storageclass 资源，进行修改

`xsky-cr`e.g.

```yaml
...
spec:
  xskyBackends:
  - scName: xsky-sc1
    token: NGIyMzhmNDU5NzFhNGJhZmFmNjlmYzI3NjkxNGU0ODI=
    accessPaths:
    - name: csi-ap1
      type: iSCSI
      clusterInfo:
        secret_name: xsky-sc1-secret
      gateway: sds01,sds02,sds03
    fsType: xfs
    pool: pool1
    xmsServers: 10.255.68.115,10.255.68.116,10.255.68.117
    secretName: xsky-secret1
  - ...
     
```



## 一、准备工作

### 1.1 环境依赖：iscsid、multipathd

```sh
yum install -y iscsi-initiator-utils sg3_utils device-mapper-multipath device-mapper

cat << EOF > /etc/multipath.conf
defaults {
          user_friendly_names yes
          failback immediate
          no_path_retry fail
}
blacklist {
          devnode "^sda$"
}
devices{
}
EOF

cat << EOF > /etc/iscsi/iscsid.conf
iscsid.startup = /bin/systemctl start iscsid.socket iscsiuio.socket
node.startup = automatic
node.leading_login = No
node.session.timeo.replacement_timeout = 20
node.conn[0].timeo.login_timeout = 15
node.conn[0].timeo.logout_timeout = 15
node.conn[0].timeo.noop_out_interval = 1
node.conn[0].timeo.noop_out_timeout = 1
node.session.err_timeo.abort_timeout = 15
node.session.err_timeo.lu_reset_timeout = 30
node.session.err_timeo.tgt_reset_timeout = 30
node.session.initial_login_retry_max = 8
node.session.cmds_max = 512
node.session.queue_depth = 512
node.session.xmit_thread_priority = -20
node.session.iscsi.InitialR2T = No
node.session.iscsi.ImmediateData = Yes
node.session.iscsi.FirstBurstLength = 262144
node.session.iscsi.MaxBurstLength = 16776192
node.conn[0].iscsi.MaxRecvDataSegmentLength = 262144
node.conn[0].iscsi.MaxXmitDataSegmentLength = 0
discovery.sendtargets.iscsi.MaxRecvDataSegmentLength = 32768
node.conn[0].iscsi.HeaderDigest = None
node.session.nr_sessions = 1
node.session.reopen_max = 0
node.session.iscsi.FastAbort = Yes
node.session.scan = auto
EOF

systemctl enable iscsid;systemctl start iscsid
systemctl enable multipathd;systemctl start multipathd
```

### 1.2 需要同步镜像

```yaml
## 压缩包
quay.io/k8scsi/csi-attacher:v2.0.0
quay.io/k8scsi/csi-provisioner:v1.5.0
quay.io/k8scsi/csi-node-driver-registrar:v1.1.0
quay.io/k8scsi/csi-resizer:v0.5.0
quay.io/k8scsi/csi-snapshotter:v3.0.3
quay.io/k8scsi/snapshot-controller:v3.0.3

localhost/xskydriver/csi-iscsi:3.0.301.0 # m

## 仓库
image.cestc.cn/iaas_pub/k8scsi/csi-provisioner:v1.5.0
image.cestc.cn/iaas_pub/k8scsi/csi-resizer:v0.5.0
image.cestc.cn/iaas_pub/k8scsi/xskydriver/csi-iscsi:3.0.301.0
image.cestc.cn/iaas_pub/k8scsi/csi-node-driver-registrar:v1.1.0
image.cestc.cn/iaas_pub/k8scsi/csi-snapshotter:v3.0.3
image.cestc.cn/iaas_pub/k8scsi/snapshot-controller:v3.0.3
```

> ```sh
> cd offline_image/
> for file in ./*; do podman load -i $file; done
> ```



## 二、CSI Driver 安装

```sh
oc apply -f  accesspath-crd/crd-ap.yaml
oc apply -f .
```

## 三、使用

### 3.1 在 xsky 后端创建 token，转成 base64

```sh
echo -n "1880ecc063a54ec5a96c96a630682ad8" | base64  # MTg4MGVjYzA2M2E1NGVjNWE5NmM5NmE2MzA2ODJhZDg=
```

### 3.2 用这个 token 创建 secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: test-secret
data:
  token: MTg4MGVjYzA2M2E1NGVjNWE5NmM5NmE2MzA2ODJhZDg=
```

### 3.3 创建ap

```yaml
apiVersion: "sds.xsky.com/v1"
kind: AccessPath
metadata:
  name: cke-csi-ap1 #object name in kubernetes
spec:
  name: cke-csi-ap1 #name in SDS
  type: Kubernetes #one of Kubernetes,iSCSI
  cluster_info:
    secret_name: test-secret
    secret_namespace: default
    xmsServers: 10.255.68.115,10.255.68.116,10.255.68.117
  gateway: sds01,sds02,sds03 #separated by comma,
  vip_group:
    preempt: true #optional
    vips: []
    #- vip: 10.255.68.120
    #   mask: 24 #optional, default 32
    #   default_gateway: vm39 #optional,preferred network
```

### 3.4 创建sc

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: iscsi-sc
parameters:
 accessPaths: cke-csi-ap1
 fsType: xfs
 pool: ebs
 xmsServers: 10.255.68.115,10.255.68.116,10.255.68.117
 csi.storage.k8s.io/provisioner-secret-name: test-secret
 csi.storage.k8s.io/provisioner-secret-namespace: default
provisioner: iscsi.csi.xsky.com
reclaimPolicy: Delete
allowVolumeExpansion: true
mountOptions:
 - _netdev
```

### 3.5 创建 pvc、pod 测试

`pvc`

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
 name: xsky-iscsi-pvc-block
 namespace: default
spec:
  #volumeMode: Filesystem
  volumeMode: Block
  storageClassName: iscsi-sc
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

`pod`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hhq-pv-pod-block
spec:
  volumes:
    - name: iscsi-pvc-block-5-1
      persistentVolumeClaim:
        claimName: xsky-iscsi-pvc-block
  containers:
    - name: hhq-pv-con
      image: image.cestc.cn/ceake/busybox:0.0.0-test-build
      command: ["sleep", "1d"]
      volumeDevices:
        - devicePath: /dev/block
          name: iscsi-pvc-block-5-1
```

## 四、xsky operator

```sh
mkdir xsky-operator; cd xsky-operator
operator-sdk init --domain=ceake.io --repo=code.cestc.cn/ccos/cea/xsky-operator
operator-sdk create api --resource=true --controller=true --group operator --version v1 --kind XskyBackend
编辑 api
make manifests
编辑 Dockerfile
编辑 controller
make docker-build docker-push IMG=image.cestc.cn/ceake/xsky-operator:0.0.1
make bundle IMG=image.cestc.cn/ceake/xsky-operator:0.0.1
## 修改 csv
make bundle-build bundle-push BUNDLE_IMG="image.cestc.cn/ceake/xsky-operator-bundle:0.0.1"
```

> make bundle 做的事情



```sh
opm index add --bundles image.cestc.cn/ceake/xsky-operator-bundle:0.0.1 --tag image.cestc.cn/ceake/marketplace-index:0.0.1-hhq

tag=0.0.2-628;opm index add --bundles image.cestc.cn/ceake/xsky-storage-operator-bundle:${tag} --tag image.cestc.cn/ceake/marketplace-index:${tag}; podman push image.cestc.cn/ceake/marketplace-index:${tag}
```

### 放开 OperatorHub

> `catalogsource`
>
> ```yaml
> apiVersion: "operators.coreos.com/v1alpha1"
> kind: "CatalogSource"
> metadata:
> name: "redhat-operators"
> namespace: "openshift-marketplace"
> annotations:
>  target.workload.openshift.io/management: '{"effect": "PreferredDuringScheduling"}'
> spec:
> sourceType: grpc
> image: image.cestc.cn/ceake/marketplace-index:0.0.1-preZYH05
> displayName: "Red Hat Operators"
> publisher: "Red Hat"
> priority: -100
> updateStrategy:
>  registryPoll:
>    interval: 10m
> grpcPodConfig:
>  nodeSelector:
>      node-role.kubernetes.io/master: ""
>      kubernetes.io/os: "linux"
>  priorityClassName: "system-cluster-critical"
>  tolerations:
>     - key: "node-role.kubernetes.io/master"
>       operator: Exists
>       effect: "NoSchedule"
>     - key: "node.kubernetes.io/unreachable"
>       operator: "Exists"
>       effect: "NoExecute"
>       tolerationSeconds: 120
>     - key: "node.kubernetes.io/not-ready"
>       operator: "Exists"
>       effect: "NoExecute"
>       tolerationSeconds: 120
> 
> ```
>
> 

> 安装的时候遇到的问题
>
> 问题1.
>
> ![](images/posts/image-20220624102214494.png)
>
> ![](images/posts/image-20220624103057695.png)



> 创建 pod 的时候出现问题
>
> ```yaml
> allowHostDirVolumePlugin: true
> allowHostIPC: true
> allowHostNetwork: true
> allowHostPID: true
> allowHostPorts: true
> allowPrivilegedContainer: true
> allowedCapabilities:
>   - '*'
> apiVersion: security.openshift.io/v1
> defaultAddCapabilities: []
> fsGroup:
>   type: RunAsAny
> groups:
>   - system:authenticated
> kind: SecurityContextConstraints
> metadata:
>   annotations:
>     kubernetes.io/description: xsky scc
>   name: xsky-scc
> priority: null
> readOnlyRootFilesystem: false
> runAsUser:
>   type: RunAsAny
> seLinuxContext:
>   type: RunAsAny
> supplementalGroups:
>   type: RunAsAny
> volumes:
>   - '*'
> ```
>
> ```sh
>oc adm policy add-scc-to-user xsky-scc system:serviceaccount:openshift-xsky:
> oc adm policy add-scc-to-user xsky-scc system:serviceaccount:openshift-operators:xsky-operator-controller-manager
> ```
> 
> driver 有问题：
>
> ![](images/posts/image-20220625185627212.png)



**TODO List:**

- [x] handleXskyBackendEvent() 监听 xskyBakcend 资源事件：创建、修改
  - 学习 
  - client 创建 CRD
- [x] 整体 operator 化
- [x] e2e
- [x] 梳理 make bundle
- [ ] 支持自定义命名空间安装
- [ ] 公共的部分放到安装的时候就做



### 为流水线做准备

```sh
### 制作 xsky-operator 镜像
docker build -t image.cestc.cn/ceake/xsky-operator:3.0.0-hhq .
vim bundle/manifests/xsky-operator.clusterserviceversion.yaml # modify image:
docker build -f bundle.Dockerfile -t image.cestc.cn/ceake/xsky-operator-bundle:3.0.0-hhq .
```

### 更新版本需要更改

- csv

### 手动验证（MR 需要）

#### 前置资源创建

```yaml
apiVersion: "sds.xsky.com/v1"
kind: AccessPath
metadata:
  name: cke-csi-ap-e2e-handle #object name in kubernetes
  namespace: default
spec:
  name: cke-csi-ap-e2e-handle #name in SDS
  type: Kubernetes #one of Kubernetes,iSCSI
  cluster_info:
    secret_name: secret-xsky-e2e
    secret_namespace: default
    xmsServers: 10.255.68.115,10.255.68.116,10.255.68.117
  gateway: sds01,sds02,sds03 #separated by comma,
  vip_group:
    preempt: true #optional
    vips: []
---
apiVersion: v1
kind: Secret
metadata:
  name: secret-xsky-e2e
  namespace: default
data:
  token: MTg4MGVjYzA2M2E1NGVjNWE5NmM5NmE2MzA2ODJhZDg=
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: sc-xsky-e2e
parameters:
  accessPaths: cke-csi-ap-e2e-handle
  fsType: xfs
  pool: ebs
  xmsServers: 10.255.68.115,10.255.68.116,10.255.68.117
  csi.storage.k8s.io/provisioner-secret-name: secret-xsky-e2e
  csi.storage.k8s.io/provisioner-secret-namespace: default
provisioner: iscsi.csi.xsky.com
reclaimPolicy: Delete
allowVolumeExpansion: true
mountOptions:
  - _netdev
```

#### case 1. 创建 PVC & 挂载至 pod

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: xsky-iscsi-pvc-e2e
  namespace: default
spec:
  volumeMode: Block
  storageClassName: sc-xsky-e2e
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: xsky-e2e-test-pod
  namespace: default
spec:
  volumes:
    - name: xsky-iscsi-pvc-e2e
      persistentVolumeClaim:
        claimName: xsky-iscsi-pvc-e2e
  containers:
    - name: xsky-e2e
      image: image.cestc.cn/ceake/busybox:0.0.0-test-build
      command: ["sleep", "1d"]
      volumeDevices:
        - devicePath: /dev/block
          name: xsky-iscsi-pvc-e2e
```

读写

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: xsky-iscsi-pvc2-e2e
  namespace: default
spec:
  storageClassName: sc-xsky-e2e
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: xsky-test-write
  namespace: default
spec:
  containers:
    - name: test
      image: image.cestc.cn/ceake/busybox:0.0.0-test-build
      command: ["sleep", "1d"]
      volumeMounts:
        - name: test
          mountPath: /test
      securityContext:
        privileged: true
  restartPolicy: Never
  volumes:
    - name: test
      persistentVolumeClaim:
        claimName: xsky-iscsi-pvc2-e2e
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: xsky-test-cm
  namespace: default
data:
  test.sh: |
    #!/bin/sh
    id
    ls -al /test && \
    echo 'Hello from xsky-storage-operator' && \
    cp /config/text.txt /test/test.txt && \
    touch /test/foo && \
    ls -al /test
  text.txt: |
    hello, xsky !
```



### bugfix-安装operator 的时候默认安装资源

更新商店

```sh
tag=xxx; opm index add --bundles image.cestc.cn/ceake/xsky-storage-operator-bundle:${tag} --tag image.cestc.cn/ceake/hhq-index:${tag}; podman push image.cestc.cn/ceake/hhq-index:${tag}; oc -n ccos-marketplace patch  catalogsource/hhq-operators -p '{"spec":{"image":image.cestc.cn/ceake/hhq-index:${tag}}}'
```



## 五、kubebuilder 注释

> 参考文档：
>
> 1. https://cloudnative.to/kubebuilder/reference/markers/crd-validation.html

### 5.1 字段检查



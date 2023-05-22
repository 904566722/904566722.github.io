# iscsid、multipathd 容器化

<!--more-->
#

## 一、iscsid、multipathd 运行的节点

```yaml
{{- if .Values.request.imageImporterNodeSelector}}
nodeSelector:
  {{- range $key, $value := .Values.request.imageImporterNodeSelector }}
  {{ $key }}: {{ $value | quote}}
  {{- end }}
{{- end }}
```

```yaml
# 传入
iscsiAffinityNodeSelectors: ["role/controller", "role/tenants-ecs"]
# 使用
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        {{- range .Values.iscsiAffinityNodeSelectors }}
        - matchExpressions:
            - key: {{ . }}
              operator: In
              values:
                - "true"
        {{- end }}
```

实际结果：
```yaml
affinity:
	nodeAffinity:
	  requiredDuringSchedulingIgnoredDuringExecution:
	    nodeSelectorTerms:
	      - matchExpressions:
	          - key: role/controller
	            operator: In
	            values:
	              - "true"
	      - matchExpressions:
	          - key: role/tenants-ecs
	            operator: In
	            values:
	              - "true"
```

## 二、场景验证
### 2.1 物理机、容器中均有 iscsid、multipathd 服务，是否冲突

用于测试的 iscsid 服务
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: iscsid-hhq-test
  namespace: product-ebs
spec:
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      name: iscsid-hhq-test
  template:
    metadata:
      creationTimestamp: null
      labels:
        name: iscsid-hhq-test
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: role/controller
                operator: In
                values:
                - "true"
            - matchExpressions:
              - key: role/tenants-ecs
                operator: In
                values:
                - "true"
      containers:
      - command:
        - sh
        - -c
        - /start-iscsi.sh
        env:
        - name: HOST_IP
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: status.hostIP
        image: harbor.ceclouddyn.com/iaas_pub/iscsi-multipath:CECStack3.1.0-beta1
        imagePullPolicy: Always
        name: iscsid-con
        resources: {}
        securityContext:
          privileged: true
        volumeMounts:
        - mountPath: /lib/modules
          name: lib-modules
        - mountPath: /dev
          name: dev
        - mountPath: /sys
          name: sys
        - mountPath: /run
          name: run
        - mountPath: /etc/iscsi
          name: etc-iscsi
      dnsPolicy: ClusterFirstWithHostNet
      enableServiceLinks: true
      hostNetwork: true
      hostPID: true
      priority: 0
      restartPolicy: Alwaysr
      terminationGracePeriodSeconds: 30
      volumes:
      - hostPath:
          path: /dev
          type: ""
        name: dev
      - hostPath:
          path: /lib/modules
          type: ""
        name: lib-modules
      - hostPath:
          path: /sys
          type: ""
        name: sys
      - hostPath:
          path: /run
          type: ""
        name: run
      - hostPath:
          path: /etc/iscsi
          type: DirectoryOrCreate
        name: etc-iscsi
```


|物理机 iscsid 状态|pod iscsid|描述|
|-|-|-|
|failed|未起|在物理机上能够使用 `systemctl start` 正常启动服务；且使用 iscsiadm 命令挂载成功|
|active|启动|pod 中的脚本执行成功；且在物理环境也能够使用 iscsiadm 正常挂卸载|
|dead|未启动|挂卸载失败|
|dead|启动|挂卸载成功|


## 2.2 容器中运行 `iscsid -d 8 -f` 命令验证各种场景下是否能拉起来线程

容器启动之后，线程情况：
![](images/posts/Pasted%20image%2020230522192131.png)

在容器中实行 iscsiadm 结果：
![](images/posts/Pasted%20image%2020230522192205.png)

脚本实际放到 pod 中运行：
![](images/posts/Pasted%20image%2020230522192323.png)

**`思考`**：
以前使用 iscsid 命令来运行，现在换成 iscsid -d 8 -f 来运行，之后还是有可能再换命令的，应该把这个命令放到环境变量里面，读取这个变量来运行，不至于更改代码

## 脑图

![](images/posts/Pasted%20image%2020230522193212.png)

## Q&A
### 1. 镜像缓存过程中 multipathd 不存在

job 执行结果：
![](images/posts/Pasted%20image%2020230522192546.png)

可能的原因：
1. 物理机没有 multipathd 服务
2. 容器没有 multipathd 服务

实际定位：因为管控节点没有 multipath，而计算节点有 multipath，如果 importer 中不安装 multipath 包，那么 importer job 起到管控节点是能正常运行的，原因是管控节点没有 multipath，那么挂载过来的盘是单路径的，job 中不会执行到 multipath 相关的内容，因此缓存镜像能够成功创建，但是如果有个节点既有管控节点标签，又有计算节点标签，这个时候节点是有multipath服务的，跑iscsiadm -R就会将挂过来的盘映射成为多路径，脚本会走到多路径的逻辑，执行multipath命令就会报错，因此，把节点的计算标签去掉就行了

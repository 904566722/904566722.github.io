# App Operator 安装脚本化（cdp）

<!--more-->

## 场景实践

### Operator install

手动安装，记录发送的api：

```
https://console-ccos-console.apps.hhqcluster.hhqdomain/api/kubernetes/apis/operators.coreos.com/v1alpha1/namespaces/ccos-operators/subscriptions
POST
{"apiVersion":"operators.coreos.com/v1alpha1","kind":"Subscription","metadata":{"name":"xsky-operator","namespace":"ccos-operators"},"spec":{"source":"ceake-operators","sourceNamespace":"ccos-marketplace","name":"xsky-operator","startingCSV":"xsky-operator.v1.0.0","channel":"alpha","installPlanApproval":"Automatic"}}
```

需要的两个 Header：`cookie`、`X-CSRFToken`

返回的结果：

```json
{
	"apiVersion": "operators.coreos.com/v1alpha1",
	"kind": "Subscription",
	"metadata": {
		"creationTimestamp": "2022-09-05T06:23:06Z",
		"generation": 1,
		"managedFields": [
			{
				"apiVersion": "operators.coreos.com/v1alpha1",
				"fieldsType": "FieldsV1",
				"fieldsV1": {
					"f:spec": {
						".": {},
						"f:channel": {},
						"f:installPlanApproval": {},
						"f:name": {},
						"f:source": {},
						"f:sourceNamespace": {},
						"f:startingCSV": {}
					}
				},
				"manager": "ApiPOST Runtime +https:",
				"operation": "Update",
				"time": "2022-09-05T06:23:06Z"
			}
		],
		"name": "xsky-operator",
		"namespace": "ccos-operators",
		"resourceVersion": "3039592",
		"uid": "08282869-7cf5-4a7a-b33a-ce71821282bb"
	},
	"spec": {
		"channel": "alpha",
		"installPlanApproval": "Automatic",
		"name": "xsky-operator",
		"source": "ceake-operators",
		"sourceNamespace": "ccos-marketplace",
		"startingCSV": "xsky-operator.v1.0.0"
	}
}
```

convert to yaml:

```yaml
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: xsky-operator
  namespace: ccos-operators
spec:
  channel: alpha
  installPlanApproval: Automatic
  name: xsky-operator
  source: ceake-operators
  sourceNamespace: ccos-marketplace
  startingCSV: xsky-operator.v1.0.0

```

### 发送 api 创建 CR 资源



## 脚本化

> 安装operator、创建自定义的 CR 等在测试前需要做的操作都可以通过创建所需的 yaml 资源来完成

### yaml

- Namespace
- OperatorGroup
- Subscription

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ccos-adp
---
apiVersion: operators.coreos.com/v1
kind: OperatorGroup
metadata:
  generateName: ccos-adp-
  generation: 1
  name: ccos-adp-cj4jr
  namespace: ccos-adp
spec:
  targetNamespaces:
    - ccos-adp
---
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: oadp-operator
  namespace: ccos-adp
spec:
  channel: stable
  installPlanApproval: Automatic
  name: oadp-operator
  source: hhq-operators
  sourceNamespace: ccos-marketplace
  startingCSV: oadp-operator.v1.0.0
```

- Secret

```yaml
apiVersion: v1
data:
  cloud: W2RlZmF1bHRdCmF3c19hY2Nlc3Nfa2V5X2lkPW1pbmlvCmF3c19zZWNyZXRfYWNjZXNzX2tleT1taW5pbzEyMw==
kind: Secret
metadata:
  name: cloud-credentials
  namespace: ccos-adp
type: Opaque
```

- DPA

```yaml
apiVersion: oadp.ccos.io/v1alpha1
kind: DataProtectionApplication
metadata:
  name: velero-sample
  namespace: ccos-adp
spec:
  backupLocations:
    - velero:
        config:
          insecureSkipTLSVerify: "true"
          profile: default
          region: minio
          s3ForcePathStyle: "true"
          s3Url: http://10.253.11.215:9000
        credential:
          key: cloud
          name: cloud-credentials
        default: true
        objectStorage:
          bucket: velero
          prefix: single
        provider: aws
  configuration:
    restic:
      enable: true
    velero:
      defaultPlugins:
        - aws
        - csi
        - ccos
```

### 在流程中的位置

![](images/posts/image-20220905151959933.png)


- 每个Application Operator 对应一个自动化安装脚本

  如 oadp-operator 的自动化安装脚本：`oadp-operator.sh`

- 自动化脚本仓库：`10.253.6.101:/root/ApplicationOperatorScripts`


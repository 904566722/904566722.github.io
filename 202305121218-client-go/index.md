# client-go

<!--more-->
#Golang 

## 一、基本了解

### 1.1 基本概念、背景、用途

client-go 是用于 **Go 客户端**与 **Kubernetes 集群**通信的一个开源项目

## 二、安装流程、使用

### 2.1 安装

> https://github.com/kubernetes/client-go/blob/master/INSTALL.md


### 2.2 使用

对于 client-go 的使用主要分两种场景：

- 应用程序运行在集群中的 Pod 中 --> 使用集群内的方式（https://github.com/kubernetes/client-go/tree/master/examples/in-cluster-client-configuration）
- or --> 使用集群外的方式（https://github.com/kubernetes/client-go/tree/master/examples/out-of-cluster-client-configuration）

#### 2.2.1 简单使用（进群内外创建ClientSet，并与 Kubernetes API 通信）

**主要编码步骤**

1. **创建 cluster config（调用 InClusterConfig，使用 Pod 内的 token）**
   - **Pod 内使用 InClusterConfig 创建 cluster config**
   - **不是 Pod 内的应用可以使用 kubeconfig 来初始化客户端**
2. **通过 cluster config 创建一个 client set**
3. **通过 client set 访问 Kubernetes API， 完成业务逻辑编码**

##### 2.2.1.1 集群内

> https://github.com/kubernetes/client-go/tree/master/examples/in-cluster-client-configuration

应用程序运行在 Pod 内部的时候，使用安装在 Pod 内部的 `/var/run/secrets/kubernetes.io/serviceaccount` 路径下的 Service Account token

`main.go`

```go
/*
Copyright 2016 The Kubernetes Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Note: the example only works with the code within the same release/branch.
package main

import (
	"context"
	"fmt"
	"time"

	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	//
	// Uncomment to load all auth plugins
	// _ "k8s.io/client-go/plugin/pkg/client/auth"
	//
	// Or uncomment to load specific auth plugins
	// _ "k8s.io/client-go/plugin/pkg/client/auth/azure"
	// _ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
	// _ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	// _ "k8s.io/client-go/plugin/pkg/client/auth/openstack"
)

func main() {
	// creates the in-cluster config
	config, err := rest.InClusterConfig()
	if err != nil {
		panic(err.Error())
	}
	// creates the clientset
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}
	for {
		// get pods in all the namespaces by omitting namespace
		// Or specify namespace to get pods in particular namespace
		pods, err := clientset.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{})
		if err != nil {
			panic(err.Error())
		}
		fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))

		// Examples for error handling:
		// - Use helper functions e.g. errors.IsNotFound()
		// - And/or cast to StatusError and use its properties like e.g. ErrStatus.Message
		_, err = clientset.CoreV1().Pods("default").Get(context.TODO(), "example-xxxxx", metav1.GetOptions{})
		if errors.IsNotFound(err) {
			fmt.Printf("Pod example-xxxxx not found in default namespace\n")
		} else if statusError, isStatus := err.(*errors.StatusError); isStatus {
			fmt.Printf("Error getting pod %v\n", statusError.ErrStatus.Message)
		} else if err != nil {
			panic(err.Error())
		} else {
			fmt.Printf("Found example-xxxxx pod in default namespace\n")
		}

		time.Sleep(10 * time.Second)
	}
}
```

构建二进制，构建 docker 镜像

```
go buidl -o app main.go
```

```
docker build -t 904566722/in-cluster-app:1.0.0 
```

使用该镜像启动一个 Pod

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: in-cluster-client-go
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: in-cluster-client-go
rules:
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: in-cluster-client-go
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: in-cluster-client-go
subjects:
- kind: ServiceAccount
  name: in-cluster-client-go
  namespace: default
---
apiVersion: v1
kind: Pod
metadata:
  name: in-cluster-client-go
  namespace: default
spec:
  serviceAccountName: in-cluster-client-go
  containers:
  - image: 904566722/in-cluster-app:1.0.0 
    imagePullPolicy: IfNotPresent
    name: client-go
  restartPolicy: Never
```

查看 Pod 执行结果：

```shell
[root@master in-cluster-client-configuration]# kubectl  logs in-cluster-client-go
There are 80 pods in the cluster
Pod example-xxxxx not found in default namespace
```

##### 2.2.1.1 集群外

> https://github.com/kubernetes/client-go/tree/master/examples/out-of-cluster-client-configuration

#### 2.2.2 创建、更新、删除一个 Deployment



## 三、代码组织

### 3.1 目录结构

![](images/posts/Pasted%20image%2020230512121939.png)

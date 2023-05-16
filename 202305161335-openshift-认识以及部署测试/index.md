# openshift 认识以及部署测试

<!--more-->
#openshift


## 一、OpenShift 理解

### 1.1 容器的发展

- 2008 年，**LXC**（Linux Container）

- 2013 年，**Docker** 引擎，起初 Docker 想要使用 LXC，但是由于 LXC 隔离性较差，Docker 开发了 Libcontainer，最终形成了 **runC**

- 2014 年，**Kubernetes** 发布，直接使用 Docker

- 2014年，随着 Docker 越来越重，CoreOS 发布 **rkt**（rkt 展现了更简单的运行时的优势）

- 2015年，随着容器运行时的变多，标准也就随之而来，该年 6 月，**OCI**（Open Container Initiative）成立，这个项目是对容器运行时的**接口标准化**（runC 第一时间通过了认证）

- 为了 K8s 与 容器运行时两者之间实现解耦，针对 k8s，在两者中间加入了一层标准：**CRI**（Container Runtime Interface），它是 k8s 与 Container Runtime 之间进行交互的接口。

  CRI 与 OCI 并不冲突，CRI 针对于 k8s 而言，而 OCI 是容器运行时本身的标准

- 2017年，**CRI-O** 发布。专门为 k8s 做的一个轻量级容器运行时，重用了 runC 等基本组件来启动容器。

- 同时 Docker 也在研究 CRI 标准，从而出现了 containerd 运行时（从 Docker 1.12 版本开始），k8s 将 containerd 接入 CRI 标准，成为 cri-containerd。

![](images/posts/Pasted%20image%2020230516134010.png)

调用结构：

old:  k8s → kubelet → **Docker engine → containerd** → runC → linux kernel

new: k8s → kubelet → **cri-o**                                        → runC → linux kernel

![](images/posts/Pasted%20image%2020230516134023.png)


### 1.2 OpenShift 的发展

- 2011 年，OpenShift 诞生，核心架构：Gear
- 2014 年，Kubernetes 发布，红帽对 OpenShift 进行重构
- 2014 年，OpenShift 3.0 发布（基于 Kubernetes 1.0， 早期 Kubernetes 功能尚弱，OpenShift 补充了大量的企业级功能）
- 2018 年，红帽收购 CoreOS 公司，随着 CoreOS 被纳入，OpenShift 也融入了 CoreOS 的优秀基因。同时也进一步推进了 k8s 的发展

### 1.3 OpenShift 与 Kubernetes 的对比

OpenShift 与 Kubernetes 之间相互促进，共同进步，**OpenShift 相比于 k8s 有许多增强：**

- k8s 面向容器调度；OpenShift 面向企业 PaaS 平台，OpenShift 除了包含 k8s，也包含了许多其他组件，如：认证集成、日志监控等

  ![](images/posts/Pasted%20image%2020230516134035.png)

- 一个集群，多个租户

  OpenShift 在 3.0 版本（基于 k8s 1.0）就有了 RBAC 的功能，但是 k8s 在 1.6 才推出了 RBAC，得以满足许多用户该方面的需求，由此可见 OpenShift 推动着 k8s 的发展。

- 应用程序的简单、安全部署

  - 简单部署：早期 k8s 的应用程序版本管理并非简单的，OpenShift 3.0 开发了 DeploymentConfig（参数化部署输入、滚动部署、回滚、自动部署...），该功能也最终成为 k8s Deployments功能集的一部分，当然 OpenShift 支持 k8s Deployments 的全部功能
  - 安全部署：由于用户可以用任何镜像来部署应用（尽管应用的不安全的），k8s 使用 pod 安全策略来保障安全（受 OpenShift SCC（上下文安全约束）启发）；红帽为 k8s 开发了 **CRI-O 容器运行时**，真正实现容器镜像的安全

- 更多类型的应用负载（有状态、无状态）

- 应用的快速访问

  OpenShift 3.0 中，红帽开发了 Router（k8s ingress 的前身），提供入口请求的自动负载均衡

- 容器镜像的便捷管理：ImageStream

  - 通过将镜像导入 ImageStream 来使用镜像
  - - -scheduled=true 参数：定期检查镜像库的更新
  - Trigger：出现新的镜像或者镜像的Tag发生变化时触发自动部署

### 1.4 OpenShift 相对 Kubernetes 的延伸

1. 与 Jenkins 集成

2. 开发运维一体化

   Tectonic、Container Linux、Quay、Operator、Prometheus

3. 有状态应用的全生命周期管理

   OpenShift 开发了 Operator 来管理 k8s 上运行的应用，扩展了 k8s api

4. 实现了对 IaaS 资源的管理

5. 通过 Istio 实现微服务架构

6. 实现 Serverless

## 二、OpenShift 架构

### 2.1 逻辑架构

![](images/posts/Pasted%20image%2020230516134044.png)

- 底层基础设施
- 服务层
- 控制节点
- 计算节点
- 路由层
- 持久存储
- 开发
- 运维

### 2.2 技术架构

### 2.3 组件架构

![](images/posts/Pasted%20image%2020230516134052.png)

## 三、基于 OpenShift 构建企业级 PaaS 平台

### 3.1 整体部署架构

#### 节点

- **Master 节点**：有且只有 **3** 个 master 节点

  这种情况下怎么实现高可用？

  - worker 节点变多 → 提高 master 的 cpu、mem，而不改变 master 的数量
  - api 层面 → 使用软件负载均衡实现高可用
  - 每个节点运行一个 etcd

- 计算节点

  - Infra：运行基础组件
  - App：运行业务

#### 架构图

单集群高可用架构：

![](images/posts/Pasted%20image%2020230516134123.png)

### 3.2 实际部署要点记录

1. 两种部署类型（**Installer/User** Provisioned Infrastructure）

   1. IPI：Master、Worker 节点都必须使用 RHCOS 操作系统
   2. UPI：Master 需要使用 RHCOS 操作系统

2. 企业版连接：[https://access.redhat.com/documentation/en-us/openshift_container_platform/4.6/html-single/installing_on_bare_metal/index](https://access.redhat.com/documentation/en-us/openshift_container_platform/4.6/html-single/installing_on_bare_metal/index)

3. 安装需要的角色

   1. 管理机

   2. 容器镜像服务器

   3. DNS 服务器

   4. HTTP 服务器

      HAproxy、F5...

   5. 负载均衡器

   6. NFS 服务器

   7. Bootstrap

   8. Master

   9. Worker

4. 离线部署大致流程

   ![](images/posts/Pasted%20image%2020230516134204.png)

   - 4.3、4.4、4.5 部署方式相同，4.6 稍有区别
   - RHCOS 操作系统镜像下载地址：[https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos](https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos)

## *、[社区版 okd] OpenShift 安装部署实操

### 1. 节点规划

1 master & infra、2 app（node）

| 节点     | hostname             | ip            | 规格          | 版本                          |
| -------- | -------------------- | ------------- | ------------- | ----------------------------- |
| master01 | master01.example.com | 192.168.58.31 | 4C16G 40G+50G | CentOS Linux release 7.9.2009 |
| node01   | node01.example.com   | 192.168.58.32 | 4C16G 40G+20G | CentOS Linux release 7.9.2009 |
| node02   | node02.example.com   | 192.168.58.33 | 4C16G 40G+20G | CentOS Linux release 7.9.2009 |

### 2. 节点前置准备

3个节点配置 hosts

```bash
192.168.58.31 master01.example.com
192.168.58.32 node01.example.com
192.168.58.33 node02.example.com
```

上述 domain 需要与节点的 hostname 一致

3个节点都：

```bash
# 开启 selinux，保证 /etc/sysconfig/selinux 为如下配置
SELINUX=enforcing
SELINUXTYPE=targeted

# 关闭 iptables、firewalld、NetworkManager
systemctl stop NetworkManager && systemctl stop iptables && systemctl stop firewalld
systemctl disable NetworkManager &&  systemctl disable iptables && systemctl disable firewalld
```

在 master01 节点生成密钥并分发到各节点

```bash
ssh-keygen -t rsa
ssh-copy-id -i .ssh/id_rsa.pub master01
ssh-copy-id -i .ssh/id_rsa.pub node01
ssh-copy-id -i .ssh/id_rsa.pub node02
```

各节点时间同步

```bash
ntpdate time2.aliyun.com
```

各节点安装依赖软件包

```bash
yum update -y

yum install -y wget git net-tools bind-utils yum-utils iptables-services bridge-utils bash-completion kexec-tools sos psacct java-1.8.0-openjdk-headless python-passlib

yum -y install nfs-utils lrzsz gcc gcc-c++ make cmake libxml2-devel openssl-devel curl curl-devel unzip sudo ntp libaio-devel vim ncurses-devel autoconf automake zlib-devel python-devel epel-release lrzsz openssh-server socat ipvsadm conntrack

yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
```

master 节点安装 ansible-2.6.5、pyOpenSSL、openshift-3.10

```bash
# 安装指定版本的 ansible 
# https://releases.ansible.com/ansible/rpm/release/epel-7-x86_64/ 可以到该目录下找到对应的 rpm 包，指定安装
yum install -y https://releases.ansible.com/ansible/rpm/release/epel-7-x86_64/ansible-2.6.5-1.el7.ans.noarch.rpm

# 安装
sed -i -e "s/^enabled=1/enabled=0/" /etc/yum.repos.d/epel.repo
yum -y --enablerepo=epel install pyOpenSSL

# https://github.com/openshift/openshift-ansible/tags 找到对应的 openshift-ansible 版本，上传到 master 节点

```

各节点 docker 安装

```bash
yum install -y docker-1.13.1

# docker 配置文件
vim /etc/sysconfig/docker
	## options 改成
OPTIONS='--selinux-enabled=false --signature-verification=False'

	## 配置加速
vi /etc/docker/daemon.json
{
"registry-mirrors": ["https://rsbud4vc.mirror.aliyuncs.com","https://registry.docker-cn.com","https://docker.mirrors.ustc.edu.cn","https://dockerhub.azk8s.cn","http://hub-mirror.c.163.com","http://qtid6917.mirror.aliyuncs.com"]
}

	## 重启docker
systemctl daemon-reload
systemctl restart docker.service
```

master 节点配置docker私有仓库

```bash
docker pull registry:2.5
yum install httpd -y
systemctl start httpd
mkdir -p /opt/registry-var/auth/
docker run --entrypoint htpasswd registry:2.5 -Bbn admin admin >> /opt/registry-var/auth/htpasswd

# 设置配置文件
mkdir -p /opt/registry-var/config
vim /opt/registry-var/config/config.yml

version: "0.1"
log:
  fields:
    service: registry
storage:
  delete:
    enabled: true
  cache:
    blobdescriptor:  inmemory
  filesystem:
    rootdirectory: /var/lib/registry
http:
  addr: :5000
  headers:
    X-Content-Type-Options: [nosniff]
health:
  storagedriver:
    enabled: true
interval: 10s
threshold: 3

# 启动服务
docker run -d -p 5000:5000 --restart=always  --name=registry -v /opt/registry-var/config/:/etc/docker/registry/ -v /opt/registry-var/auth/:/auth/ -e "REGISTRY_AUTH=htpasswd"  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd -v /opt/registry-var/:/var/lib/registry/ registry:2.5
```

各节点配置 https 权限支持

```bash
vim /etc/docker/daemon.json

{
"registry-mirrors": [""https://rsbud4vc.mirror.aliyuncs.com","https://registry.docker-cn.com","https://docker.mirrors.ustc.edu.cn","https://dockerhub.azk8s.cn","http://hub-mirror.c.163.com","http://qtid6917.mirror.aliyuncs.com""],
"insecure-registries":["192.168.58.31:5000"]
}

# 重启 docker

systemctl daemon-reload

systemctl restart docker.service
systemctl enable docker
```

测试登录 docker 仓库

```bash
docker login 192.168.58.31:5000
```

各节点配置 dcoker-storage

```bash
[~] vim /etc/sysconfig/docker-storage-setup

DEVS=/dev/sdb
VG=docker-vg

[~] docker-storage-setup
```

镜像下载

master01：

```bash
docker pull quay.io/coreos/etcd:v3.2.22

docker pull openshift/origin-control-plane:v3.10

docker pull docker.io/openshift/origin-service-catalog:v3.10

docker pull openshift/origin-node:v3.10

docker pull openshift/origin-deployer:v3.10

docker pull openshift/origin-deployer:v3.10.0

docker pull openshift/origin-template-service-broker:v3.10

docker pull openshift/origin-pod:v3.10

docker pull openshift/origin-pod:v3.10.0

docker pull openshift/origin-web-console:v3.10

docker pull openshift/origin-docker-registry:v3.10

docker pull openshift/origin-haproxy-router:v3.10

docker pull cockpit/kubernetes:latest

docker pull docker.io/cockpit/kubernetes:latest

docker pull docker.io/openshift/origin-control-plane:v3.10

docker pull docker.io/openshift/origin-deployer:v3.10

docker pull docker.io/openshift/origin-docker-registry:v3.10

docker pull docker.io/openshift/origin-haproxy-router:v3.10

docker pull docker.io/openshift/origin-pod:v3.10
```

node01、node02：

```bash
docker pull quay.io/coreos/etcd:v3.2.22

docker pull openshift/origin-control-plane:v3.10

docker pull openshift/origin-node:v3.10

docker pull docker.io/openshift/origin-node:v3.10

docker pull openshift/origin-haproxy-router:v3.10

docker pull openshift/origin-deployer:v3.10

docker pull openshift/origin-pod:v3.10

docker pull ansibleplaybookbundle/origin-ansible-service-broker:v3.10

docker pull openshift/origin-docker-registry:v3.10

docker pull cockpit/kubernetes:latest

docker pull openshift/origin-haproxy-router:v3.10

docker pull docker.io/cockpit/kubernetes:latest

docker pull docker.io/openshift/origin-control-plane:v3.10

docker pull docker.io/openshift/origin-deployer:v3.10

docker pull docker.io/openshift/origin-docker-registry:v3.10

docker pull docker.io/openshift/origin-haproxy-router:v3.10

docker pull docker.io/openshift/origin-pod:v3.10
```

master 配置 ansible 清单文件：

vim /etc/ansible/hosts

```bash
[OSEv3:children]
masters
nodes
etcd

[OSEv3:vars]
openshift_deployment_type=origin
ansible_ssh_user=root
ansible_become=yes
openshift_repos_enable_testing=true
openshift_enable_service_catalog=false
template_service_broker_install=false
debug_level=4
openshift_clock_enabled=true
openshift_version=3.10.0
openshift_image_tag=v3.10
openshift_disable_check=disk_availability,docker_storage,memory_availability,docker_image_availability,os_sdn_network_plugin_name=redhat/openshift-ovs-multitenant
openshift_master_identity_providers=[{'name': 'htpasswd_auth','login': 'true', 'challenge': 'true','kind': 'HTPasswdPasswordIdentityProvider'}]
os_firewall_use_firewalld=true

[masters]
master01.example.com

[nodes]
master01.example.com openshift_node_group_name='node-config-master-infra'
node01.example.com openshift_node_group_name='node-config-compute'
node02.example.com openshift_node_group_name='node-config-compute'

[etcd]
master01.example.com
```

### 3. 集群安装

检查：

```bash
ansible-playbook -i /etc/ansible/hosts openshift-ansible-release-3.10/playbooks/prerequisites.yml
```

检查没问题开始安装：

```bash
ansible-playbook -i /etc/ansible/hosts openshift-ansible-release-3.10/playbooks/deploy_cluster.yml
```

安装过程中碰到的问题记录：

- 1.Control plane pods didn’t come up

  ![](images/posts/Pasted%20image%2020230516134234.png)

  查看了下 `/var/log/messages` 日志

  搜索了下说是 ansible 版本太高导致的（安装成了 2.9 的版本），于是将 ansible 降级得到解决

- 2.Could not find csr for nodes:.....

  ![](images/posts/Pasted%20image%2020230516134307.png)

  要保证 /etc/hosts 、 /etc/ansible/hosts、个节点 hostname 都是一致的。
  /etc/hosts dns 更改之后需要重启下 dnsmasq

卸载 ocp 集群（？）

```bash
ansible-playbook -i /etc/ansible/hosts openshift-ansible-release-3.10/playbooks/adhoc/uninstall.yml
```

### 4. 创建管理员账号

```bash
htpasswd -cb /etc/origin/master/htpasswd admin admin

htpasswd -b /etc/origin/master/htpasswd dev dev

oc login -u system:admin

oc adm policy add-cluster-role-to-user cluster-admin admin
```

### 5. 登录 console 控制台

https://192.168.58.31:8443

碰到的问题：

- 1.网页一直无响应，打不开

  不知道到底哪个环节出了问题，自己写个demo服务，来探究下 OpenShift 的请求转发到后端的过程：

  Go 代码：

  ```go
  func HelloHandler(w http.ResponseWriter, r *http.Request) {
      fmt.Fprintf(w, "Hello World")
  }
  func main()  {
      http.HandleFunc("/", HelloHandler)
      if err := http.ListenAndServe(":8000", nil); err != nil {
          log.Println("listener failed", err)
      }
  }
  ```

  在 8000 端口提供服务

  制作成 docker 镜像 `192.168.58.31:5000/hello:latest` ，pod运行起来后，初步验证通过：

  ![](images/posts/Pasted%20image%2020230516134326.png)

  创建对应的 svc 服务，验证通过：

  ![](images/posts/Pasted%20image%2020230516134334.png)

  通过网页也是能够访问到的：

  ![](images/posts/Pasted%20image%2020230516134341.png)

  ...

  结果：因为访问是 https 协议，配置的 hosts 是 [xx.example.com](http://xx.example.com) ，不要写成域名的形式就行了。

### 番外

#### rpm 同步库

[https://www.ibm.com/docs/zh/cloud-pak-system-w3550/2.3.2.0?topic=pattern-openshift-container-platform-faqs](https://www.ibm.com/docs/zh/cloud-pak-system-w3550/2.3.2.0?topic=pattern-openshift-container-platform-faqs)

[http://feilunshuai.tpddns.net:8446/repos/rhel-7-server-ose-3.11-rpms/Packages/a/](http://feilunshuai.tpddns.net:8446/repos/rhel-7-server-ose-3.11-rpms/Packages/a/)

[https://www.jianshu.com/p/429f7cfa6089](https://www.jianshu.com/p/429f7cfa6089)

#### 命令行

```bash
subscription-manager register --auto-attach
subscription-manager repos --enable="rhel-7-server-rpms"  --enable="rhel-7-server-extras-rpms" --enable="rhel-7-server-ose-3.11-rpms" --enable="rhel-7-server-ansible-2.9-rpms"
[root@master01 ~]# subscription-manager repos --list
This system has no repositories available through subscriptions.

# 检查服务器的所有可用订阅
subscription-manager list --available

subscription-manager  attach --auto
subscription-manager attach --pool=8a82c6557ffabbea018020c21a4f127e

```

## *、[社区版 okd] master 节点服务启动详情

### *.1 api-server

启动命令

```bash
#!/bin/bash
set -euo pipefail
if [[ -f /etc/origin/master/master.env ]]; then
  set -o allexport
  source /etc/origin/master/master.env
fi
exec openshift start master api --config=/etc/origin/master/master-config.yaml --loglevel=${DEBUG_LOGLEVEL:-2}
```

- file: `/etc/origin/master/master.env`

  ```bash
  # Proxy configuration
  # See https://docs.openshift.com/container-platform/3.10/install_config/http_proxies.html
  
  DEBUG_LOGLEVEL=4
  ```

- file: `/etc/origin/master/master-config.yaml`

  ```yaml
  admissionConfig:
    pluginConfig:
      BuildDefaults:
        configuration:
          apiVersion: v1
          env: []
          kind: BuildDefaultsConfig
          resources:
            limits: {}
            requests: {}
      BuildOverrides:
        configuration:
          apiVersion: v1
          kind: BuildOverridesConfig
      openshift.io/ImagePolicy:
        configuration:
          apiVersion: v1
          executionRules:
          - matchImageAnnotations:
            - key: images.openshift.io/deny-execution
              value: 'true'
            name: execution-denied
            onResources:
            - resource: pods
            - resource: builds
            reject: true
            skipOnResolutionFailure: true
          kind: ImagePolicyConfig
  aggregatorConfig:
    proxyClientInfo:
      certFile: aggregator-front-proxy.crt
      keyFile: aggregator-front-proxy.key
  apiLevels:
  - v1
  apiVersion: v1
  authConfig:
    requestHeader:
      clientCA: front-proxy-ca.crt
      clientCommonNames:
      - aggregator-front-proxy
      extraHeaderPrefixes:
      - X-Remote-Extra-
      groupHeaders:
      - X-Remote-Group
      usernameHeaders:
      - X-Remote-User
  controllerConfig:
    election:
      lockName: openshift-master-controllers
    serviceServingCert:
      signer:
        certFile: service-signer.crt
        keyFile: service-signer.key
  controllers: '*'
  corsAllowedOrigins:
  - (?i)//127\.0\.0\.1(:|\z)
  - (?i)//localhost(:|\z)
  - (?i)//192\.168\.58\.31(:|\z)
  - (?i)//kubernetes\.default(:|\z)
  - (?i)//kubernetes\.default\.svc\.cluster\.local(:|\z)
  - (?i)//kubernetes(:|\z)
  - (?i)//openshift\.default(:|\z)
  - (?i)//master01(:|\z)
  - (?i)//openshift\.default\.svc(:|\z)
  - (?i)//172\.30\.0\.1(:|\z)
  - (?i)//openshift\.default\.svc\.cluster\.local(:|\z)
  - (?i)//kubernetes\.default\.svc(:|\z)
  - (?i)//openshift(:|\z)
  dnsConfig:
    bindAddress: 0.0.0.0:8053
    bindNetwork: tcp4
  etcdClientInfo:
    ca: master.etcd-ca.crt
    certFile: master.etcd-client.crt
    keyFile: master.etcd-client.key
    urls:
    - https://master01:2379
  etcdStorageConfig:
    kubernetesStoragePrefix: kubernetes.io
    kubernetesStorageVersion: v1
    openShiftStoragePrefix: openshift.io
    openShiftStorageVersion: v1
  imageConfig:
    format: docker.io/openshift/origin-${component}:${version}
    latest: false
  imagePolicyConfig:
    internalRegistryHostname: docker-registry.default.svc:5000
  kind: MasterConfig
  kubeletClientInfo:
    ca: ca-bundle.crt
    certFile: master.kubelet-client.crt
    keyFile: master.kubelet-client.key
    port: 10250
  kubernetesMasterConfig:
    apiServerArguments:
      storage-backend:
      - etcd3
      storage-media-type:
      - application/vnd.kubernetes.protobuf
    controllerArguments:
      cluster-signing-cert-file:
      - /etc/origin/master/ca.crt
      cluster-signing-key-file:
      - /etc/origin/master/ca.key
    masterCount: 1
    masterIP: 192.168.58.31
    podEvictionTimeout: null
    proxyClientInfo:
      certFile: master.proxy-client.crt
      keyFile: master.proxy-client.key
    schedulerArguments: null
    schedulerConfigFile: /etc/origin/master/scheduler.json
    servicesNodePortRange: ''
    servicesSubnet: 172.30.0.0/16
    staticNodeNames: []
  masterClients:
    externalKubernetesClientConnectionOverrides:
      acceptContentTypes: application/vnd.kubernetes.protobuf,application/json
      burst: 400
      contentType: application/vnd.kubernetes.protobuf
      qps: 200
    externalKubernetesKubeConfig: ''
    openshiftLoopbackClientConnectionOverrides:
      acceptContentTypes: application/vnd.kubernetes.protobuf,application/json
      burst: 600
      contentType: application/vnd.kubernetes.protobuf
      qps: 300
    openshiftLoopbackKubeConfig: openshift-master.kubeconfig
  masterPublicURL: https://master01:8443
  networkConfig:
    clusterNetworks:
    - cidr: 10.128.0.0/14
      hostSubnetLength: 9
    externalIPNetworkCIDRs:
    - 0.0.0.0/0
    networkPluginName: redhat/openshift-ovs-subnet
    serviceNetworkCIDR: 172.30.0.0/16
  oauthConfig:
    assetPublicURL: https://master01:8443/console/
    grantConfig:
      method: auto
    identityProviders:
    - challenge: true
      login: true
      mappingMethod: claim
      name: htpasswd_auth
      provider:
        apiVersion: v1
        file: /etc/origin/master/htpasswd
        kind: HTPasswdPasswordIdentityProvider
    masterCA: ca-bundle.crt
    masterPublicURL: https://master01:8443
    masterURL: https://master01:8443
    sessionConfig:
      sessionMaxAgeSeconds: 3600
      sessionName: ssn
      sessionSecretsFile: /etc/origin/master/session-secrets.yaml
    tokenConfig:
      accessTokenMaxAgeSeconds: 86400
      authorizeTokenMaxAgeSeconds: 500
  pauseControllers: false
  policyConfig:
    bootstrapPolicyFile: /etc/origin/master/policy.json
    openshiftInfrastructureNamespace: openshift-infra
    openshiftSharedResourcesNamespace: openshift
  projectConfig:
    defaultNodeSelector: node-role.kubernetes.io/compute=true
    projectRequestMessage: ''
    projectRequestTemplate: ''
    securityAllocator:
      mcsAllocatorRange: s0:/2
      mcsLabelsPerProject: 5
      uidAllocatorRange: 1000000000-1999999999/10000
  routingConfig:
    subdomain: router.default.svc.cluster.local
  serviceAccountConfig:
    limitSecretReferences: false
    managedNames:
    - default
    - builder
    - deployer
    masterCA: ca-bundle.crt
    privateKeyFile: serviceaccounts.private.key
    publicKeyFiles:
    - serviceaccounts.public.key
  servingInfo:
    bindAddress: 0.0.0.0:8443
    bindNetwork: tcp4
    certFile: master.server.crt
    clientCA: ca.crt
    keyFile: master.server.key
    maxRequestsInFlight: 500
    requestTimeoutSeconds: 3600
  volumeConfig:
    dynamicProvisioningEnabled: true
  ```

### *.2 scheduler

### *.3 controller

启动命令

```yaml
#!/bin/bash
set -euo pipefail
if [[ -f /etc/origin/master/master.env ]]; then
  set -o allexport
  source /etc/origin/master/master.env
fi
exec openshift start master controllers --config=/etc/origin/master/master-config.yaml --listen=https://0.0.0.0:8444 --loglevel=${DEBUG_LOGLEVEL:-2}
```

- file: `/etc/origin/master/master.env`
- file: `/etc/origin/master/master-config.yaml`

## *、[cclinux ocp 公司版] 安装

### 流程梳理

[【cclinux-ocp】 | ProcessOn免费在线作图,在线流程图,在线思维导图 |](https://www.processon.com/view/link/626264830e3e74777e1a2277)

## *、[cclinux ocp 公司版] master 节点服务启动详情

kubec

## *、相关学习资料

1. [https://docs.openshift.com/container-platform/4.10/welcome/index.html](https://docs.openshift.com/container-platform/4.10/welcome/index.html)

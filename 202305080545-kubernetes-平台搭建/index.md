# 在 vmware 上本地搭建 kubernetes 集群

<!--more-->


#k8s

# 一、环境准备
1. 关闭防火墙
```sh
systemctl stop firewalld
systemctl disable firewalld
```
2. 关闭 selinux
```sh
sed -i 's/enforcing/disabled/' /etc/selinux/config
```
3. 关闭 swap
```sh
sed -ri 's/.*swap.*/#&/' /etc/fstab
```
4. 添加 hosts
```sh
cat >> /etc/hosts << EOF
192.168.108.132 centos7-master
192.168.108.130 centos7-node1
EOF
```
5. 设置网桥参数
```sh
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

sysctl --system # 生效
```
6. 时间同步
```sh
yum install ntpdate -y # 没有的 ntpdate 则安装
ntpdate time.windows.com # 同步时间
```

# 二、安装

> 安装 Docker、kubeadm、kubelet、kubectl

1. Docker 安装
```sh
wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo # 更新 docker 的 yum 源

yum install docker-ce-19.03.13 -y
```
配置镜像
```sh
mkdir /etc/docker
cat << EOF > /etc/docker/daemon.json
{
"registry-mirrors": ["https://kfwkfulq.mirror.aliyuncs.com"]
}
EOF

systemctl enable docker.service
```

2. 添加 k8s 的yum源
```sh
cat > /etc/yum.repos.d/kubernetes.repo << EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

3. 安装 kubeadm、kubelet、kubectl
```sh
yum install kubelet-1.19.4 kubeadm-1.19.4 kubectl-1.19.4 -y

systemctl enable kubelet.service # 开启服务
```

重启 centos

4. 部署 master 节点

```sh
kubeadm init --apiserver-advertise-address=【master服务器ip地址】 --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.19.4 --service-cidr=10.96.0.0/12 --pod-network-cidr=10.244.0.0/16
```

```sh
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

5. 添加 node 节点
```sh
kubeadm join 192.168.108.132:6443 --token d99d8g.3wr8skktnv3m9e46 \
    --discovery-token-ca-cert-hash sha256:0ba36403007aa7ef77b174a65a8e3de27bcbcac9fbb5b2bb31c337a565d4e16
```

6. 部署网络插件
```sh
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

kubectl apply -f kube-flannel.yml
```

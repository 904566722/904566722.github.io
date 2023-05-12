# linux 起 nfs 服务

<!--more-->
#linux 

##

安装软件包
```sh
yum install rpcbind nfs-utils
```

创建共享目录
```sh
mkdir /home/test
chmod -R 777 /home/test/
cd /home/test/
echo "hello nfs!" > hello-nfs.txt
```

修改服务端配置文件
```sh
vim /etc/exports
# 配置允许的网段以及权限
/home/test 192.168.121.0/24(rw) 
```

开启服务
```sh
systemctl start rpcbind
systemctl start nfs-server
```

客户端查看服务端的共享信息
```sh
showmount -e 10.253.8.90
```

创建目录，挂载
```sh
mkdir /mnt/test
mount 10.253.8.90:/home/test /mnt/test
```

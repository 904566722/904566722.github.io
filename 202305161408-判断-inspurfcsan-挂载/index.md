# 判断 inspur、fcsan 挂载

<!--more-->
#linux #storage 

## 判断 inspur、fcsan 挂载
```sh
# 通过以下命令判断
ll /dev/disk/by-path/ | grep sd*
```

e.g.

```sh
[root@iaas-test-193-ctl-226-194 by-path]# ll /dev/disk/by-path/ | grep sdaq
lrwxrwxrwx 1 root root 10 Feb 11 18:51 fc-0x100000109bcc0016-0x56c92bfa00228004-lun-1 -> ../../sdaq
lrwxrwxrwx 1 root root 10 Feb 11 18:51 pci-0000:b0:00.1-fc-0x56c92bfa00228004-lun-1 -> ../../sdaq
```

由此判断磁盘 sdaq 是 fc 方式挂载


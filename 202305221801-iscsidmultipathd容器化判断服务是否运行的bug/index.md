# iscsid、multipathd容器化判断服务是否运行的bug

<!--more-->
#

## 问题描述

容器化的 pod 运行起来之后，正常情况下的进程情况是这样的：
![](images/posts/Pasted%20image%2020230522180307.png)
在物理机上查看两个服务的情况：
![](images/posts/Pasted%20image%2020230522180348.png)

如果物理机的这两个服务是运行着的，那么容器中服务的情况是这样的：
![](images/posts/Pasted%20image%2020230522180619.png)

上面无论哪种情况，服务都是能够正常运行的，但是如果在物理机开启 iscsid、multipathd 服务的情况下，通过手动的方式将物理机上的两个服务停掉，容器中也没有相关线程了，就无法提供 iscsid、multipathd 的服务
![](images/posts/Pasted%20image%2020230522180859.png)

## 解决

通过修改容器中服务的执行脚本得以解决：
```sh
#!/bin/bash

psAuxOutput=$(ps aux | grep iscsid | grep -v grep | grep -v kubectl)

if [ -z "$psAuxOutput" ]; then
  echo "ps aux do not have iscsid process"
  iscsid || true
else
  echo "have iscsid process"
  echo $psAuxOutput
fi
```

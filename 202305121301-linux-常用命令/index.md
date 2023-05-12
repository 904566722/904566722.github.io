# Linux 常用命令

<!--more-->
#linux 


## 一、基本操作

### 查看系统、cpu信息

```sh
# 查看系统架构
arch 
# 查看系统内核信息
uname -a  
# 查看系统内核版本
cat /proc/version  

# 查看当前用户环境变量
env  

# 显示CPU info的信息
cat /proc/cpuinfo  
# 查看有几个逻辑cpu, 包括cpu型号
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
# 查看有几颗cpu,每颗分别是几核
cat /proc/cpuinfo | grep physical | uniq -c
# 查看当前CPU运行在32bit还是64bit模式下, 如果是运行在32bit下也不代表CPU不支持64bit
getconf LONG_BIT
# 结果大于0, 说明支持64bit计算. lm指long mode, 支持lm则是64bit
cat /proc/cpuinfo | grep flags | grep ' lm ' | wc -l

cat /proc/meminfo  # 检验内存使用
```

### 罗列设备
```
# 罗列 pci 设备
lspci -tv
```

### sshkey
```sh
# 创建sshkey
ssh-keygen -t rsa -C your_email@example.com

#id_rsa.pub 的内容拷贝到要控制的服务器的 home/username/.ssh/authorized_keys 中,如果没有则新建(.ssh权限为700, authorized_keys权限为600)
```

### 命令别名
```sh
# 在各个用户的.bash_profile中添加重命名配置
alias ll='ls -alF'
```

### 同步服务器时间
```sh
sudo ntpdate -u ntp.api.bz
```

### 后台运行命令
```sh
# 后台运行,并且有nohup.out输出
nohup xxx &

# 后台运行, 不输出任何日志
nohup xxx > /dev/null &

# 后台运行, 并将错误信息做标准输出到日志中 
nohup xxx >out.log 2>&1 &
```

### 查看命令路径
```sh
#显示一个二进制文件或可执行文件的完整路径
which <命令>

#显示一个二进制文件、源码或man的位置
whereis <命令>
```

### 查看域名路由表
```sh
nslookup google.com
```

### 最近登录信息列表
```sh
last -n 5
```

### 设置固定ip
```sh
ifconfig em1 192.168.5.177 netmask 255.255.255.0
```

## 磁盘、文件、目录相关操作

### vim
```sh
#normal模式下 g表示全局, x表示查找的内容, y表示替换后的内容
:%s/x/y/g

#normal模式下
0  # 光标移到行首(数字0)
$  # 光标移至行尾
shift + g # 跳到文件最后
gg # 跳到文件头

# 显示行号
:set nu

# 去除行号
:set nonu

# 检索
/xxx(检索内容)  # 从头检索, 按n查找下一个
?xxx(检索内容)  # 从尾部检索
```

### 磁盘、文件目录基本信息
```sh
mount             # 查看磁盘挂载情况
df                # 查看磁盘分区信息
df -h
df -lh
df -h 路径
du -H -h          # 查看目录及子目录大小
du -sh *          # 查看当前目录下各个文件, 文件夹占了多少空间, 不会递归
du -sh dir1       #估算目录 'dir1' 已经使用的磁盘空间'
ls -lSr |more     #以尺寸大小排列文件和目录
```

### fdisk
```sh
############ 创建一个分区

fdisk /dev/sdb

Command (m for help): m
Command action
   a   toggle a bootable flag
   b   edit bsd disklabel
   c   toggle the dos compatibility flag
   d   delete a partition
   g   create a new empty GPT partition table
   G   create an IRIX (SGI) partition table
   l   list known partition types
   m   print this menu
   n   add a new partition
   o   create a new empty DOS partition table
   p   print the partition table
   q   quit without saving changes
   s   create a new empty Sun disklabel
   t   change a partition's system id
   u   change display/entry units
   v   verify the partition table
   w   write table to disk and exit
   x   extra functionality (experts only)

Command (m for help): n
Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended
Select (default p): p
Partition number (1-4, default 1): 1
First sector (2048-20971519, default 2048):
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-20971519, default 20971519): 1G
Value out of range.
Last sector, +sectors or +size{K,M,G} (2048-20971519, default 20971519): +1G
Partition 1 of type Linux and of size 1 GiB is set

Command (m for help): w
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

#### 实践-删除分区
- 遇到设备繁忙的问题 → 解决：使用 `lsof` 命令查看正在使用该设备的程序，关闭程序再尝试
![](images/posts/Pasted%20image%2020230512130617.png)

### 查看文件内容

```sh
cat file1      #从第一个字节开始正向查看文件的内容
tac file1      #从最后一行开始反向查看一个文件的内容
more file1     #查看一个长文件的内容
less file1     #类似于 'more' 命令，但是它允许在文件中和正向操作一样的反向操作
head -2 file1    #查看一个文件的前两行
tail -2 file1    #查看一个文件的最后两行
tail -f /var/log/messages     #实时查看被添加到一个文件中的内容
```

### 挂载文件系统
```sh
mount /dev/hda2 /mnt/hda2    #挂载一个叫做hda2的盘 - 确定目录 '/ mnt/hda2' 已经存在
umount /dev/hda2            #卸载一个叫做hda2的盘 - 先从挂载点 '/ mnt/hda2' 退出
fuser -km /mnt/hda2         #当设备繁忙时强制卸载
umount -n /mnt/hda2         #运行卸载操作而不写入 /etc/mtab 文件- 当文件为只读或当磁盘写满时非常有用
mount /dev/fd0 /mnt/floppy        #挂载一个软盘
mount /dev/cdrom /mnt/cdrom       #挂载一个cdrom或dvdrom
mount /dev/hdc /mnt/cdrecorder    #挂载一个cdrw或dvdrom
mount /dev/hdb /mnt/cdrecorder    #挂载一个cdrw或dvdrom
mount -o loop file.iso /mnt/cdrom    #挂载一个文件或ISO镜像文件
mount -t vfat /dev/hda5 /mnt/hda5    #挂载一个Windows FAT32文件系统
mount /dev/sda1 /mnt/usbdisk         #挂载一个usb 捷盘或闪存设备
mount -t smbfs -o username=user,password=pass //WinClient/share /mnt/share      #挂载一个windows网络共享
mount -t cifs -o username=iaas,password=iaas@123 //10.32.43.2/iaas开发部/cke smb
```

### 文件系统、初始化一个文件系统
```sh
badblocks -v /dev/hda1    #检查磁盘hda1上的坏磁块
fsck /dev/hda1            #修复/检查hda1磁盘上linux文件系统的完整性
fsck.ext2 /dev/hda1       #修复/检查hda1磁盘上ext2文件系统的完整性
e2fsck /dev/hda1          #修复/检查hda1磁盘上ext2文件系统的完整性
e2fsck -j /dev/hda1       #修复/检查hda1磁盘上ext3文件系统的完整性
fsck.ext3 /dev/hda1       #修复/检查hda1磁盘上ext3文件系统的完整性
fsck.vfat /dev/hda1       #修复/检查hda1磁盘上fat文件系统的完整性
fsck.msdos /dev/hda1      #修复/检查hda1磁盘上dos文件系统的完整性
dosfsck /dev/hda1         #修复/检查hda1磁盘上dos文件系统的完整性

mkfs /dev/hda1        #在hda1分区创建一个文件系统
mke2fs /dev/hda1      #在hda1分区创建一个linux ext2的文件系统
mke2fs -j /dev/hda1   #在hda1分区创建一个linux ext3(日志型)的文件系统
mkfs -t vfat 32 -F /dev/hda1   #创建一个 FAT32 文件系统
fdformat -n /dev/fd0           #格式化一个软盘
mkswap /dev/hda3               #创建一个swap文件系统
```

### 备份
```sh
dump -0aj -f /tmp/home0.bak /home    #制作一个 '/home' 目录的完整备份
dump -1aj -f /tmp/home0.bak /home    #制作一个 '/home' 目录的交互式备份
restore -if /tmp/home0.bak          #还原一个交互式备份

rsync -rogpav --delete /home /tmp    #同步两边的目录
rsync -rogpav -e ssh --delete /home ip_address:/tmp           #通过SSH通道rsync
rsync -az -e ssh --delete ip_addr:/home/public /home/local    #通过ssh和压缩将一个远程目录同步到本地目录
rsync -az -e ssh --delete /home/local ip_addr:/home/public    #通过ssh和压缩将本地目录同步到远程目录

dd bs=1M if=/dev/hda | gzip | ssh user@ip_addr 'dd of=hda.gz'  
#通过ssh在远程主机上执行一次备份本地磁盘的操作
dd if=/dev/sda of=/tmp/file1 
#备份磁盘内容到一个文件
tar -Puf backup.tar /home/user 执行一次对 '/home/user' 
#目录的交互式备份操作
( cd /tmp/local/ && tar c . ) | ssh -C user@ip_addr 'cd /home/share/ && tar x -p' 
#通过ssh在远程目录中复制一个目录内容
( tar c /home ) | ssh -C user@ip_addr 'cd /home/backup-home && tar x -p' 
#通过ssh在远程目录中复制一个本地目录
tar cf - . | (cd /tmp/backup ; tar xf - ) 
#本地将一个目录复制到另一个地方，保留原有权限及链接

find /home/user1 -name '*.txt' | xargs cp -av --target-directory=/home/backup/ --parents 
#从一个目录查找并复制所有以 '.txt' 结尾的文件到另一个目录
find /var/log -name '*.log' | tar cv --files-from=- | bzip2 > log.tar.bz2 
#查找所有以 '.log' 结尾的文件并做成一个bzip包

dd if=/dev/hda of=/dev/fd0 bs=512 count=1 
#做一个将 MBR (Master Boot Record)内容复制到软盘的动作
dd if=/dev/fd0 of=/dev/hda bs=512 count=1 
#从已经保存到软盘的备份中恢复MBR内容
```

### 字符设置和文件格式转换
```sh
dos2unix filedos.txt fileunix.txt      #将一个文本文件的格式从MSDOS转换成UNIX
unix2dos fileunix.txt filedos.txt      #将一个文本文件的格式从UNIX转换成MSDOS
recode ..HTML < page.txt > page.html   #将一个文本文件转换成html
recode -l | more                       #显示所有允许的转换格式
```

### wc
```sh
wc -l filename     # 查看文件里有多少行
wc -w filename     # 看文件里有多少个word
wc -L filename     # 文件里最长的那一行是多少个字
wc -c              # 统计字节数
```

### 压缩、解压缩
```sh
tar czvf xxx.tar 压缩目录

zip -r xxx.zip 压缩目录

tar zxvf xxx.tar

# 解压到指定文件夹
tar zxvf xxx.tar -C /xxx/yyy/

unzip xxx.zip

bunzip2 file1.bz2   #解压一个叫做 'file1.bz2'的文件
bzip2 file1         #压缩一个叫做 'file1' 的文件
gunzip file1.gz     #解压一个叫做 'file1.gz'的文件
gzip file1          #压缩一个叫做 'file1'的文件
gzip -9 file1       #最大程度压缩

rar a file1.rar test_file          #创建一个叫做 'file1.rar' 的包
rar a file1.rar file1 file2 dir1   #同时压缩 'file1', 'file2' 以及目录 'dir1'
rar x file1.rar     #解压rar包
unrar x file1.rar   #解压rar包

tar -cvf archive.tar file1   #创建一个非压缩的 tarball
tar -cvf archive.tar file1 file2 dir1  #创建一个包含了 'file1', 'file2' 以及 'dir1'的档案文件
tar -tf archive.tar    #显示一个包中的内容
tar -xvf archive.tar   #释放一个包
tar -xvf archive.tar -C /tmp     #将压缩包释放到 /tmp目录下
tar -cvfj archive.tar.bz2 dir1   #创建一个bzip2格式的压缩包
tar -jxvf archive.tar.bz2        #解压一个bzip2格式的压缩包
tar -cvfz archive.tar.gz dir1    #创建一个gzip格式的压缩包
tar -zxvf archive.tar.gz         #解压一个gzip格式的压缩包

zip file1.zip file1    #创建一个zip格式的压缩包
zip -r file1.zip file1 file2 dir1    #将几个文件和目录同时压缩成一个zip格式的压缩包
unzip file1.zip    #解压一个zip格式压缩包
```

### 拷贝、创建目录
```sh
cp xxx.log             #复制
cp -f xxx.log          # 复制并强制覆盖同名文件
cp -r xxx(源文件夹) yyy(目标文件夹)   # 复制文件夹
scp -P ssh端口 username@10.10.10.101:/home/username/xxx /home/xxx  # 远程复制
mkdir -p /xxx/yyy/zzz  # 级联创建目录
mkdir -p src/{test,main}/{java,resources}  # 批量创建文件夹, 会在test,main下都创建java, resources文件夹                                                                                                                                                                   
```

### 软链接
```sh
#创建一个指向文件或目录的软链接 -> 在选定的位置生成镜像
ln -s source dest
#创建一个指向文件或目录的物理链接（硬链接）（绝对地址 -> 在选定的位置生成和源相同的文件）
ln source dest     
```

### grep 检索
```sh
grep -v xxx            # 反向匹配, 查找不包含xxx的内容
grep -v '^/pre>        # 排除所有空行
grep -n “^$” 111.txt   # 返回结果 2,则说明第二行是空行 
grep -n “^abc” 111.txt # 查询以abc开头的行
grep 'xxx' -n xxx.log  # 同时列出该词语出现在文章的第几行
grep 'xxx' -c xxx.log  # 计算一下该字串出现的次数
grep 'xxx' -i xxx.log  # 比对的时候，不计较大小写的不同
```

### find
```sh
find /home/eagleye -name '*.mysql' -print           # 在目录下找后缀是.mysql的文件
find /usr -atime 3 –print                           # 会从 /usr 目录开始往下找，找最近3天之内存取过的文件。
find /usr -ctime 5 –print                           # 会从 /usr 目录开始往下找，找最近5天之内修改过的文件。
find /doc -user jacky -name 'j*' –print             # 会从 /doc 目录开始往下找，找jacky 的、文件名开头是 j的文件。
find /doc \( -name 'ja*' -o- -name 'ma*' \) –print  # 会从 /doc 目录开始往下找，找寻文件名是 ja 开头或者 ma开头的文件。
#  会从 /doc 目录开始往下找，找到凡是文件名结尾为 bak的文件，把它删除掉。-exec 选项是执行的意思，rm 是删除命令，{ } 表示文件名，“\;”是规定的命令结尾。 
find /doc -name '*bak' -exec rm {} \;
```

### awk
```sh
# 用法一 行匹配语句 ps. '' 只能用单引号
awk '{[pattern] action}' filenames
	ie. awk '{print $1, $10}' test.log         # 打印出 test.log 每行的第1项、第10项（如果没有则该项为空）（以 TAB 或者 空格 作为分隔符）

awk -F分隔符 '{[pattern] action}' filenames
	ie. awk -F, '{print $1,$2}' test.log       # 以 , 作为分隔符
      awk -F '[:,]' '{print $1,$2,$3,$4}'    # 先用 : 分割，再用 , 分割

awk -vone=line '{print $1one,$2}' test2.log  # 第一项拼接'line'字符
```

### sed

### rename
```sh
rename '.repo' '.repo.bak' ./*.repo
```

## 网络
### 网络信息统计
```sh
netstat -a       #列出所有连接
netstat -tnl     #列出监听中的连接
nestat  -nlpt    #获取进程名、进程号以及用户 ID

netstat -atnp | grep ESTA  #打印active状态的连接
netstat -at/netstat -au    #只列出TCP或者UDP
```

### tcpdump
```sh
tcpdump -i eth0              #捕获特定网口数据包
tcpdump -c 1000 -i eth0      #捕获特定个数(1000)的包
tcpdump -w a.pcap -i eth0    #将捕获的包保存到文件
tcpdump -r a.pcap            #读取pcap格式的包
tcpdump -i eth0 arp          #指定捕获包的协议类型
tcpdump -i eth0 post 22      #捕获指定端口
tcpdump -i eth0 dst address and port 22    #捕获特定目标ip+port的包 
```

### iptables
```sh
service iptables status               # 查看iptables状态
iptables -I INPUT -s ***.***.***.*** -j DROP  # 要封停一个ip
iptables -D INPUT -s ***.***.***.*** -j DROP  # 要解封一个IP，使用下面这条命令：
备注: 参数-I是表示Insert（添加），-D表示Delete（删除）。后面跟的是规则，INPUT表示入站，***.***.***.***表示要封停的IP，DROP表示放弃连接。

#开启9090端口的访问
/sbin/iptables -I INPUT -p tcp --dport 9090 -j ACCEPT 

# 防火墙开启、关闭、重启
/etc/init.d/iptables status
/etc/init.d/iptables start
/etc/init.d/iptables stop
/etc/init.d/iptables restart
```

## 程序
### 进程
```sh
pidof iscsid  # 查看运行 iscsid 的进程号
lsof -i:8080  # 查看使用 8080 端口的程序
```

### rpm
```sh
rpm -ivh package.rpm    #安装一个rpm包
rpm -ivh --nodeeps package.rpm   #安装一个rpm包而忽略依赖关系警告
rpm -U package.rpm        #更新一个rpm包但不改变其配置文件
rpm -F package.rpm        #更新一个确定已经安装的rpm包
rpm -e package_name.rpm   #删除一个rpm包
rpm -qa      #显示系统中所有已经安装的rpm包
rpm -qa | grep httpd    #显示所有名称中包含 "httpd" 字样的rpm包
rpm -qi package_name    #获取一个已安装包的特殊信息
rpm -qg "System Environment/Daemons"     #显示一个组件的rpm包
rpm -ql package_name       #显示一个已经安装的rpm包提供的文件列表
rpm -qc package_name       #显示一个已经安装的rpm包提供的配置文件列表
rpm -q package_name --whatrequires     #显示与一个rpm包存在依赖关系的列表
rpm -q package_name --whatprovides    #显示一个rpm包所占的体积
rpm -q package_name --scripts         #显示在安装/删除期间所执行的脚本l
rpm -q package_name --changelog       #显示一个rpm包的修改历史
rpm -qf /etc/httpd/conf/httpd.conf    #确认所给的文件由哪个rpm包所提供
rpm -qp package.rpm -l    #显示由一个尚未安装的rpm包提供的文件列表
rpm --import /media/cdrom/RPM-GPG-KEY    #导入公钥数字证书
rpm --checksig package.rpm      #确认一个rpm包的完整性
rpm -qa gpg-pubkey      #确认已安装的所有rpm包的完整性
rpm -V package_name     #检查文件尺寸、 许可、类型、所有者、群组、MD5检查以及最后修改时间
rpm -Va                 #检查系统中所有已安装的rpm包- 小心使用
rpm -Vp package.rpm     #确认一个rpm包还未安装
rpm2cpio package.rpm | cpio --extract --make-directories *bin*   #从一个rpm包运行可执行文件
rpm -ivh /usr/src/redhat/RPMS/`arch`/package.rpm    #从一个rpm源码安装一个构建好的包
rpmbuild --rebuild package_name.src.rpm       #从一个rpm源码构建一个 rpm 包

#安装
rpm -ivh xx.rpm 
#卸载
rpm -e --nodeps xx.rpm 
#降级
rpm -Uvh --oldpackage xx.rpm 
```

### yum
```sh
yum install package_name             #下载并安装一个rpm包
yum localinstall package_name.rpm    #将安装一个rpm包，使用你自己的软件仓库为你解决所有依赖关系
yum update package_name.rpm    #更新当前系统中所有安装的rpm包
yum update package_name        #更新一个rpm包
yum remove package_name        #删除一个rpm包
yum list                   #列出当前系统中安装的所有包
yum search package_name     #在rpm仓库中搜寻软件包
yum clean packages          #清理rpm缓存删除下载的包
yum clean headers           #删除所有头文件
yum clean all                #删除所有缓存的包和头文件
```

### apt
```sh
apt-get install package_name      #安装/更新一个 deb 包
apt-cdrom install package_name    #从光盘安装/更新一个 deb 包
apt-get update      #升级列表中的软件包
apt-get upgrade     #升级所有已安装的软件
apt-get remove package_name     #从系统删除一个deb包
apt-get check     #确认依赖的软件仓库正确
apt-get clean     #从下载的软件包中清理缓存
apt-cache search searched-package    #返回包含所要搜索字符串的软件包名称
```

### wget
```sh
wget -nd -r -l1 --no-parent http://admin.na.shared.opentlc.com/repos/ocp/3.11.51/rhel-7-server-ose-3.11-rpms/Packages/
```

## 其他
### openssl
```sh
生成随机字符串
openssl rand -base64 12 | md5sum | cut -c1-12
```
### sh
```sh
#/bin/bash

dir=$(dirname $0) # 获取脚本所在的目录

#...
```

### dd
```sh
测试写性能
time dd if=/dev/zero of=/test.txt bs=8k count=10000 oflag=direct

测试读性能
time dd if=/test.txt of=/dev/null bs=1M count=100 iflag=direct
```

### fping
```sh
yum -y install epel-release
fping -s -g 192.168.0.1 192.168.0.70
```

### dlv
```sh
dlv --listen=:2345 --headless=true --api-version=2 exec ./promApi
```

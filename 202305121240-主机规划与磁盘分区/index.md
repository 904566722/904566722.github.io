# 主机规划与磁盘分区

<!--more-->
#linux 

## 主机规划与磁盘分区

![](images/posts/Pasted%20image%2020230512124331.png)

## 磁盘分区
### 常见的磁盘接口
-   IDE（几乎见不到了）
    
-   SATA
    
-   SCSI
    
-   SAS
    

### 磁盘的组成

![](images/posts/Pasted%20image%2020230512124446.png)

-   盘片（数据存放的位置）
    
    扇区的两种单位：512Bytes、4K Bytes
    
-   机械手臂
    
-   磁头
    
-   主轴马达

### 磁盘分区表格式

1. **MBR（Master Boot Record）**：第一个扇区存储重要信息

![](images/posts/Pasted%20image%2020230512124522.png)

分区的作用？

两种分区：

-   **主分区**（Primary）
    
-   **扩展分区**（Extend）
    
    扩展分区的不同就是能够划分很多的逻辑分区

如果把磁盘分成四个分区，方式只有两种：

**PPPP** 或者 **PPPE**，Extend 分区只能有一个

为什么 64 Byte的分区表只能记录四组信息？

一个分区记录需要16Byte

![](images/posts/Pasted%20image%2020230512124613.png)

##### 实践 - 给磁盘 sdd 创建 4 个 P 分区
![](images/posts/Pasted%20image%2020230512124658.png)

当我想要再多创建一个分区的时候，已经不行了，如果想要创建更多的分区，需要把其中的一个 P 分区换成 E 分区

![](images/posts/Pasted%20image%2020230512124714.png)

当我把第四个分区换成 E 分区之后，使用 lsblk 看见的 sdd4 为什么是 1K 大小呢？

![](images/posts/Pasted%20image%2020230512124736.png)

E 分区创建之后，不能直接拿来使用，还需要创建逻辑分区

![](images/posts/Pasted%20image%2020230512124758.png)

好了，我们现在已经有了 P、E 分区，现在尝试对 P 分区进行挂载，或出现下面的错误：

![](images/posts/Pasted%20image%2020230512124826.png)

我们可以看到现在磁盘只创建了分区，并没有文件系统，所以无法进行挂载，在 sdd1 创建文件系统，然后再进行挂载

![](images/posts/Pasted%20image%2020230512124845.png)

```sh
mount /dev/sdd1 /home/honghuiqiang/sdd1/
```

查看挂载情况：

![](images/posts/Pasted%20image%2020230512124911.png)

试一下挂载逻辑分区 sdd5，与上面相同

![](images/posts/Pasted%20image%2020230512124932.png)

那么 PPPE 这种形式的分区，逻辑分区能够分多少个区？

![](images/posts/Pasted%20image%2020230512124948.png)

为什么能够这么多的区出来，分区记录是怎么被存储的？

只有 sdd4 是延伸分区，大小为 1K，用来记录逻辑分区的信息，延伸分区本身不能用来做格式化，一个分区记录需要占用 16Byte，那么 1K 大小的延伸分区是不是只能存 1K/16Bype = 64 个分区记录？

##### 实践2

```
sdd               8:48   0   20G  0 disk
├─sdd1            8:49   0    5G  0 part
├─sdd2            8:50   0    5G  0 part
├─sdd3            8:51   0    5G  0 part
├─sdd4            8:52   0    1K  0 part
├─sdd5            8:53   0    1G  0 part
├─sdd6            8:54   0    1G  0 part
├─sdd7            8:55   0   10M  0 part
├─sdd8            8:56   0   10M  0 part
├─sdd9            8:57   0   10M  0 part
├─sdd10           8:58   0   10M  0 part
├─sdd11           8:59   0   10M  0 part
├─sdd12           8:60   0   10M  0 part
├─sdd13           8:61   0   10M  0 part
├─sdd14           8:62   0   10M  0 part
├─sdd15           8:63   0   10M  0 part
├─sdd16         259:0    0   10M  0 part
├─sdd17         259:1    0   10M  0 part
├─sdd18         259:2    0   10M  0 part
├─sdd19         259:3    0   10M  0 part
├─sdd20         259:4    0   10M  0 part
├─sdd21         259:5    0   10M  0 part
├─sdd22         259:6    0   10M  0 part
├─sdd23         259:7    0   10M  0 part
├─sdd24         259:8    0   10M  0 part
├─sdd25         259:9    0   10M  0 part
├─sdd26         259:10   0   10M  0 part
├─sdd27         259:11   0   10M  0 part
├─sdd28         259:12   0   10M  0 part
├─sdd29         259:13   0   10M  0 part
├─sdd30         259:14   0   10M  0 part
├─sdd31         259:15   0   10M  0 part
├─sdd32         259:16   0   10M  0 part
├─sdd33         259:17   0   10M  0 part
├─sdd34         259:18   0   10M  0 part
├─sdd35         259:19   0   10M  0 part
├─sdd36         259:20   0   10M  0 part
├─sdd37         259:21   0   10M  0 part
├─sdd38         259:22   0   10M  0 part
├─sdd39         259:23   0   10M  0 part
├─sdd40         259:24   0   10M  0 part
├─sdd41         259:25   0   10M  0 part
├─sdd42         259:26   0   10M  0 part
├─sdd43         259:27   0   10M  0 part
├─sdd44         259:28   0   10M  0 part
├─sdd45         259:29   0   10M  0 part
├─sdd46         259:30   0   10M  0 part
├─sdd47         259:31   0   10M  0 part
├─sdd48         259:32   0   10M  0 part
├─sdd49         259:33   0   10M  0 part
├─sdd50         259:34   0   10M  0 part
├─sdd51         259:35   0   10M  0 part
├─sdd52         259:36   0   10M  0 part
├─sdd53         259:37   0   10M  0 part
├─sdd54         259:38   0   10M  0 part
├─sdd55         259:39   0   10M  0 part
├─sdd56         259:40   0   10M  0 part
├─sdd57         259:41   0   10M  0 part
├─sdd58         259:42   0   10M  0 part
├─sdd59         259:43   0   10M  0 part
└─sdd60         259:44   0   10M  0 part
```

在创建了 60 个分区后，不能继续创建了

![](images/posts/Pasted%20image%2020230512125040.png)

![](images/posts/Pasted%20image%2020230512125057.png)

那么是谁受到了限制呢？

删除一个 P 分区 sdd2 之后尝试创建：

![](images/posts/Pasted%20image%2020230512125121.png)

提示所有的逻辑分区在使用中，创建出来的是一个 P 分区

删除一个 E 分区 sdd59 之后尝试创建分区：

![](images/posts/Pasted%20image%2020230512125134.png)

创建出来的是逻辑分区

这样其实还是没搞明白是谁收到了限制，使用一个新的盘，只创建扩展分区

![](images/posts/Pasted%20image%2020230512125147.png)

创建扩展分区的时候指定了100M，为什么创建了90M的分区后就不能在创建了（提示没有剩余空间）

![](images/posts/Pasted%20image%2020230512125202.png)

查看一下这九个逻辑分区的详细情况：

![](images/posts/Pasted%20image%2020230512125214.png)

发现其实每个分区的地址头尾并不是连续的，中间存在一点缝隙，因此没有办法再分出一个 10M 的分区也就可以解释了，但是新的疑问又来了，为什么中间有存在一点缝隙呢，有用来存储东西吗？

仔细观察发现每个间隔的大小都是一样的，都是 2049（1.000488...M），为什么是这个数？\

![](images/posts/Pasted%20image%2020230512125240.png)

先来看这边的单位是怎么算的 Blocks 这边的单位应该是 **K**

而 Start、End 的单位应该是 **512 byte**，计算 sde5 的大小应该是：

(24575-4096)/2/1024=9.9995117...M

这种分区方式最多能用在多大的磁盘上？ 2T

每一条16byte的分区记录里，有四个字节用来记录分区起始的相对扇区号，这个也就是磁盘大小的上限

4byte = 4 * 8 bit= 32 bit

可以表示的最大数为 2^32 = **4294967296**

每个扇区大小为 **512 byte**

因此最大磁盘大小为 **4294967296 / 2 = 2147483648 K**

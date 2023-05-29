# Golang 中 map 的实现

<!--more-->
#golang #map #底层原理 

## 一、对哈希表的回顾

一种最简单的情况，是使用数组来实现哈希表：
![](images/posts/Pasted%20image%2020230525120255.png)

**`哈希冲突`** 的产生：多个 key 经过哈希函数之后的结果相同

哈希冲突如何解决：
- **`扩大容量`**
- **`优化哈希表的表示来缓解哈希冲突`**
	- 链式地址
	- 开放寻址

**`负载因子`**：[`元素数量`]/[`桶数量`]，通常用负载因子来描述哈希表中冲突产生的严重程度

通常当负载因子 ------**大于 0.75**-----> **扩容**

### 冲突解决 - 链式地址

当冲突发生，即不同的 key 被映射到同一个值，将 **`单个元素转变成链表`**，发生冲突的元素都被放在这个链表中。<font color=grey>跟开放寻址的方式比较，链式地址引入新的数据结构，每个元素除了要保存 (key, value) 键值对，还需要 **保存指向下一个节点的指针，增加了空间开销** </font>

> 相当于图的邻接表实现
> 
> local [202305040737 图基础](content/posts/algorithm/202305040737%20图基础.md)

![](images/posts/Pasted%20image%2020230525121347.png)

|操作|描述|
|-|-|
|查询|计算哈希函数结果得到索引，再遍历链表寻找元素|
|增加|计算哈希函数结果得到索引，添加到链表头节点|
|删除|计算哈希函数结果得到索引，再遍历链表删除元素|

可以发现在得到索引后都会有一个遍历链表的操作，可以通过优化链表的表现形式，来减少操作的时间，比如：将链表转化成 **平衡二叉搜索树** 或者 **红黑树**

> local [202305222352 平衡二叉搜索树-AVL](content/posts/algorithm/202305222352%20平衡二叉搜索树-AVL.md)



### 冲突解决 - 开放寻址

开放寻址**不引入额外数据结构，通过「`多次探测`」来解决冲突**

探测的方式通常有：
- 线性探测
- 平方探测
- 多次哈希

|探测方式|冲突产生时步骤|缺点|
|-|-|-|
|线性探测|从冲突位置向后遍历（步长通常为 1），知道找到空位| `伪删除`、`元素聚集` |
|多次哈希|如果第一个哈希函数结果冲突，尝试使用第二个哈希函数来计算，直到不冲突|`额外计算`|

## 二、Golang 如何实现 map

go 语言中，解决冲突采用`链式地址`的方式，规定每个桶最多存储 `8` 个键值对，超出容量则链接一个`溢出桶`，当溢出桶过多，执行一次特殊的`等量扩容`，当 map 的装载因子 > 6.5，执行一次 2 倍容量的扩容

### 2.1 hmap 和 bmap
这是包含 hmap 和 bmap 的一个抽象模型图：
![](images/posts/Pasted%20image%2020230525200658.png)

hmap 结构体：
```go
type hmap struct {
	count     int
	flags     uint8
	B         uint8
	noverflow uint16
	hash0     uint32

	buckets    unsafe.Pointer
	oldbuckets unsafe.Pointer
	nevacuate  uintptr

	extra *mapextra
}

type mapextra struct {
	overflow    *[]*bmap
	oldoverflow *[]*bmap
	nextOverflow *bmap
}
```

![](images/posts/Pasted%20image%2020230525200940.png)
上图中 hmap.buckets 指向的是一个 bmap 的列表，大小为 2^B



一个桶 bmap 的结构体：
```go
type bmap struct {
	tophash [bucketCnt]uint8
}
```
在编译期间，会产生一个新的 bmap 结构：
```go
type bmap struct {
    topbits  [8]uint8
    keys     [8]keytype
    values   [8]valuetype
    pad      uintptr
    overflow uintptr
}
```

![](images/posts/Pasted%20image%2020230525201150.png)

假设当有 9 个元素被放到同一个桶，会创建一个新的「溢出桶」，用来存放溢出的元素。

看一下 bmap 具体是如何保存键值对的，这是一个 bmap 的内存模型图：
![](images/posts/Pasted%20image%2020230525201331.png)
hob hash 指的是 top hash，也就是哈希值的「高 8 位」，同时 key 与 value 的存放是分别连续的，而不是 key-value-key-value... 的形式，为的是避免字节对齐带来的内存浪费，假设一个哈希值高 8 位对应的是桶的第一个位置，那么它保存的元素应该是：

![](images/posts/Pasted%20image%2020230525202141.png)

### 2.2 哈希函数 与 key 的定位

// todo 哈希函数的 选择

在经过哈希函数处理后得到的哈希值有 64 bit（在 64 位的机器上），假设下面是一个哈希值
![](images/posts/Pasted%20image%2020230525203434.png)

其中最低的 B 位用来确定在`哪个桶`，高 8 位用来确定在`桶的哪个位置`。上面这个例子中，B 为 5，map 中有 2^5 = 32 个 bucket，01010 代表的二进制数为 10，也就说明这个 key 应该落在 10 号桶，当元素找到属于的桶之后，会从前往后遍历桶的八个位置，找到一个空的位置就放入，如果不存在空位置，那么就按同样的方法在 overflow 中寻找。

## 总结心得

相比于传统的哈希表采用的链地址法来解决哈希冲突，go map 的实现也采用到了这个方法，传统的链地址法中，每个节点保存的是一个元素，每个节点都需要一个额外的内存来保存下一个节点的指针，造成了不少的空间开销，go 采用了`短数组+链表`的形式，相当于每个节点保存的是一个桶，每个桶中可以保存 8 个元素，但与链地址法不同的是，Go 中是不会让这个链表变得太长的，具体涉及到 map 的扩容机制。

---
1. https://www.hello-algo.com/chapter_hashing/hash_map/``
2. https://segmentfault.com/a/1190000039101378
3. https://blog.csdn.net/xiaodaoge_it/article/details/121297144


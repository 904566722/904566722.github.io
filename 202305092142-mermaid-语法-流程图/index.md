# mermaid 语法-流程图

<!--more-->
#mermaid

## 流程图

流程图的方向：
- 水平：[LR]^(Left Right)、[RL]^(Right Left)
- 垂直：[TD]^(Top Down)

流程图的组成元素分成两大类：
- 框框
- 线

### 框
```sh

A[方形]
A(圆角)
A{菱形}

A([体育场])

A[[子程序]]
A[(数据库)]
A((圆))

A>就这个形状]
A{{六边形}}
A[/平行四边形/]
A[\平行四边形\]
A[/平行四边形\]
A[\平行四边形/]
A(((双圆圈)))
```

|框|渲染|
|:---:|---|
|a[方形]|![](images/posts/Pasted%20image%2020230509222004.png)|
|a(圆角)|![](images/posts/Pasted%20image%2020230509222034.png)|
|A{菱形}|![](images/posts/Pasted%20image%2020230509222055.png)|
|A([体育场])|![](images/posts/Pasted%20image%2020230509222111.png)|
|A[\[子程序\]]|![](images/posts/Pasted%20image%2020230509222141.png)|
|A[(数据库)]|![](images/posts/Pasted%20image%2020230509222229.png)|
|A((圆))|![](images/posts/Pasted%20image%2020230509222254.png)|
|A>就这个形状]|![](images/posts/Pasted%20image%2020230509222326.png)|
|A{{六边形}}|![](images/posts/Pasted%20image%2020230509222351.png)|
|A[/平行四边形/]|![](images/posts/Pasted%20image%2020230509222420.png)|
|...||
|A(((双圆圈)))|![](images/posts/Pasted%20image%2020230509222448.png)|

填色：
```txt
%% 1. 类定义
classDef yellow fill:yellow

a---b---c  

%% 2. 把样式给方块
class a yellow
```

{{< mermaid >}}graph LR
%% 1. 类定义
classDef yellow fill:yellow

a---b---c  

%% 2. 把样式给方块
class a yellow
{{< /mermaid >}}

### 线
```txt
--->
---

-.->
==>   # 厚

--o
--x

<-->

-- text --  OR  A----|text|B
-- text --> OR  A---->|text|B

```
看不见的链接：（如果想要改变框框的位置，这可能是有用的）
```txt
~~~
```

|线|渲染|说明|
|:---:|---|---|
|--->|![](images/posts/Pasted%20image%2020230509220931.png)||
|---|![](images/posts/Pasted%20image%2020230509220952.png)||
|-.->|![](images/posts/Pasted%20image%2020230509221028.png)||
|==>|![](images/posts/Pasted%20image%2020230509221044.png)|比较厚的线|
|--o|![](images/posts/Pasted%20image%2020230509221109.png)||
|--x|![](images/posts/Pasted%20image%2020230509221122.png)||
|<-->|![](images/posts/Pasted%20image%2020230509221234.png)||
|A-->\|text\|B|![](images/posts/Pasted%20image%2020230509221257.png)||
|\~\~\~||两个元素之间空白的连线|


### 组合

同一行内可以写多个连接
```txt
a-->b -->c

a--B&c-->d

A & B--> C & D
上面这行写法可读性可能不太好，不如写成：
a --> c & d
b --> c & d
```

### 子图

- 使用 `subgraph` ... `end` 来划分子图
- 子图之间可以画线、子图与元素之间可以画线
- 子图可以用 `direction` 指定方向<font color=grey>(例如 direction LD，放在 subgraph 后面一行)</font>


```
graph TD
a---c

subgraph one
d---c
end

subgraph two
e---f
end
```

![](images/posts/Pasted%20image%2020230509220609.png)

### 文本

- 文本也可以像 Markdown 一样使用星号加粗

### 注释

```
%%
```

### 润色

- 图标：
{{< mermaid >}}graph LR
a---b[fa:fa-spinner]
{{< /mermaid >}}

- 类定义
```
%% 1. 类定义
classDef classname fill:yellow, stroke:yellow, stroke-width: 4px, storoke-dasharray: 5, 5

a---b---c  

%% 2. 把样式给方块
class a classname
```

`fill` 用颜色填满元素
`stroke` 边框颜色
`stroke-width` 边框宽度
`stroke-dasharray` 虚线边框

## 例子

{{< mermaid >}}
flowchart TD
%% 重要性的分类
classDef important stroke:red, stroke-width:2px
classDef pass stroke:grey, stroke-dasharray: 5,5
%% 流程的分类
classDef success stroke:green
%% 解释
classDef stick fill:yellow, stroke:yellow
classDef stickImp fill:pink, stroke:pink, color:black
  
a[重要]---b[一般]---c[可忽略]
b---d[重要]
d---e[成功]
  
f[实现类似便签的效果<br>对一个元素或者流程节点加以解释]
f-.-d
  
class a,d important
class c pass
  
class e success
class f stickImp
{{< /mermaid >}}

```
%% 重要性的分类
classDef important stroke:red, stroke-width:2px
classDef pass stroke:grey, stroke-dasharray: 5,5
%% 流程的分类
classDef success stroke:green
%% 解释
classDef stick fill:yellow, stroke:yellow
classDef stickImp fill:pink, stroke:pink, color:black
  
a[重要]---b[一般]---c[可忽略]
b---d[重要]
d---e[成功]
  
f[实现类似便签的效果<br>对一个元素或者流程节点加以解释]
f-.-d
  
class a,d important
class c pass
  
class e success
class f stickImp
```


---
1. https://mermaid.js.org/syntax/flowchart.html

# mermaid 语法-时序图

<!--more-->
#mermaid 


## 消息

首先分成 `实线` 和 `虚线` ，然后每种线都有 `无箭头`、`有箭头`、`带x箭头`、`空心箭头（异步）` 四种箭头
|类型|渲染|
|---|---|
|->|![](images/posts/Pasted%20image%2020230510023143.png)|
|->>|![](images/posts/Pasted%20image%2020230510023259.png)|
|-x|![](images/posts/Pasted%20image%2020230510023332.png)|
|-)|![](images/posts/Pasted%20image%2020230510023423.png)|
|-->|![](images/posts/Pasted%20image%2020230510023214.png)|
|-->>|![](images/posts/Pasted%20image%2020230510023507.png)|
|--x|![](images/posts/Pasted%20image%2020230510023526.png)|
|--)|![](images/posts/Pasted%20image%2020230510023546.png)|

## 序号

`autonumber`
{{< mermaid >}}
sequenceDiagram
    autonumber
    rect rgb(191,233,255)
        a->>b: hello
        b->>c: hi
    rect rgb(255,106,106)
        b->>a: i hate you
    end
    end
{{< /mermaid >}}
```
sequenceDiagram
    autonumber
    rect rgb(191,233,255)
        a->>b: hello
        b->>c: hi
    rect rgb(205,38,38)
        b->>a: i hate you
    end
    end
```

## 成员 participant、actor

<font color=grey>成员可以有[超链接](https://mermaid.js.org/syntax/sequenceDiagram.html#actor-menus)</font>

```
sequenceDiagram 
	%% 定义成员出现的顺序
	participant Alice 
	participant Bob 
	
	Alice->>Bob: Hi Bob 
	Bob->>Alice: Hi Alice
```

### 两种类型
|类型|渲染|
|:---:|---|
|participant|![](images/posts/Pasted%20image%2020230510024125.png)|
|actor|![](images/posts/Pasted%20image%2020230510024136.png)|

### 别名

`participant/actor` 别名 as user01

```
participant A as Alice
```

### 分组

`box` ... `end`
{{< mermaid >}}
sequenceDiagram
    box Group 01
        actor a
        actor b
    end
    box Another Group
        actor c
        actor d
    end
    
    a->b: hi!
    b->c: hello!
    c->d: hi!
    d->a: so high!
{{< /mermaid >}}
```
sequenceDiagram
    box Group 01
        actor a
        actor b
    end
    box Another Group
        actor c
        actor d
    end

    a->b: hi!
    b->c: hello!
    c->d: hi!
    d->a: so high!
```

## 激活-结束

- `activate` ... `deactivate`
- `+` / `-`

{{< mermaid >}}
sequenceDiagram
	actor a
	actor b

	a->>b: cook
	
	activate b
	b->>a: done!
	deactivate b
{{< /mermaid >}}

实现1.
```
sequenceDiagram
	actor a
	actor b

	a->>b: cook
	
	activate b
	b->>a: done!
	deactivate b
```

实现2.
```
sequenceDiagram
    a->>+b: cook begin!
    b->>-a: is done!
```

重复激活：
```
sequenceDiagram
    a->>+b: cook 1!
    a->>+b: cook 2!

    b->>-a: 1 done!
    b->>-a: 2 done!
```

{{< mermaid >}}
sequenceDiagram
    a->>+b: cook 1!
    a->>+b: cook 2!

    b->>-a: 1 done!
    b->>-a: 2 done!
{{< /mermaid >}}

## 循环

`loop` `频率`  ... `end`

{{< mermaid >}}
sequenceDiagram
    actor a
    actor b
    a->>b: 你好吗?
    loop every secs
        b-->>a: 很好!
    end
{{< /mermaid >}}

```
sequenceDiagram
    actor a
    actor b
    a->>b: 你好吗?
    loop every secs
        b-->>a: 很好!
    end
```

## 分支

{{< mermaid >}}
sequenceDiagram
    actor a
    actor b

    a->>b: 你好吗?
    alt 生病了，很忙...
        b->>a: 不好
    end
    alt 很健康
        b->>a: 很好
    end
{{< /mermaid >}}

```
sequenceDiagram
    actor a
    actor b
  
    a->>b: 你好吗?
    alt 生病了，很忙...
        b->>a: 不好
    end
    alt 很健康
        b->>a: 很好
    end
```

## 并行消息

`par` ... `and` ... `end` 用来表示并行的消息

显然是可以嵌套的

{{< mermaid >}}
sequenceDiagram
    actor server
    actor client1
    actor client2

    par 响应用户1
        server->>client1: response
    and 响应用户2
        server->>client2: response
    end
    client1-->>server: request next
    client2-->>server: request next
{{< /mermaid >}}
```
sequenceDiagram
    actor server
    actor client1
    actor client2

    par 响应用户1
        server->>client1: response
    and 响应用户2
        server->>client2: response
    end
    client1-->>server: request next
    client2-->>server: request next
```

## 结果可预见的情况，列举所有情况

以一个服务跟数据库建立连接为例，结果无非：
- 连接成功
- 连接超时
- 连接被拒绝

`critical` ... `option` ... `option` ... `end`
{{< mermaid >}}
sequenceDiagram
    critical 良好的连接环境
        service-->DB: 连接成功
    option 网络超时
        service-->service: 登录失败
    option 密码错误
        service->>DB: 登录验证
        DB->>service: 验证失败
    end
{{< /mermaid >}}
```
sequenceDiagram
    critical 良好的连接环境
        service-->DB: 连接成功
    option 网络超时
        service-->service: 登录失败
    option 密码错误
        service->>DB: 登录验证
        DB->>service: 验证失败
    end
```

## 停止/休息

`break` ... `end`

{{< mermaid >}}
sequenceDiagram
    Consumer-->API: Book something
    API-->BookingService: Start booking process
    break when the booking process fails
        API-->Consumer: show failure
    end
    API-->BillingService: Start billing process
{{< /mermaid >}}

```
sequenceDiagram
    Consumer-->API: Book something
    API-->BookingService: Start booking process
    break when the booking process fails
        API-->Consumer: show failure
    end
    API-->BillingService: Start billing process
```


## 便签

- `Note left of`
- `Note right of`
- `Note over`

{{< mermaid >}}
sequenceDiagram
    actor a
    actor b
    actor c

    Note left of a: 1. Note left of a
    Note right of b: 2. Note right of b
    Note over c: 3. Note over c
    Note over a,b: 4. Note over a,b
    Note over a: 5. Note over a

    a->>+b: cook 1!
    b->>-a: done!
{{< /mermaid >}}

## 背景颜色

- `rect`

rgb(x,x,x) or rgba(x,x,x)

{{< mermaid >}}
sequenceDiagram
    rect rgb(191,233,255)
        a->>b: hello
        b->>c: hi
    rect rgb(255,106,106)
        b->>a: i hate you
    end
    end
{{< /mermaid >}}

```
sequenceDiagram
    rect rgb(191,233,255)
        a->>b: hello
        b->>c: hi
    rect rgb(255,106,106)
        b->>a: i hate you
    end
    end
```



---
1. https://mermaid.js.org/syntax/sequenceDiagram.html

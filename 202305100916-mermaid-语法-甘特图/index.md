# mermaid 语法-甘特图

<!--more-->
#mermaid 

## 先来看一个简单的例子

{{< mermaid >}}
gantt
title simple sample

section A 
task1 :one, 2023-05-10, 1d
task2 :two, 2023-05-10, 5h
{{< /mermaid >}}

代码大体由以下几部分组成：
![](images/posts/Pasted%20image%2020230510100550.png)
大致分成：
- gantt 定义区
- section 区
- 任务描述

主要的话还是关于`任务信息`的写法

## 任务信息

```
任务名称，描述  :[任务性质], [是否完成], [别名], [开始时间], [持续时间|结束时间]
```

这些描述字段大都是可选的

|属性|值|
|---|---|
|任务性质|`crit` - 重要任务<br>`milestone` - 里程碑任务|
|是否完成|`active` - 激活状态<br>`done` - 已完成|
|别名|最好不要有数字！|
|开始时间|格式由 gantt 定义区的 `dateFormat` 属性指定，例如：dateFormat YYYY-MM-DD|
|持续时间|数字 + m/h/d/w|


可以把一些属性放在任务区外面来写：


## gantt 定义区的内容

- `title` 标题
- `dateFormat` 定义输入的日期格式
[支持解析的占位符列表](https://dayjs.gitee.io/docs/zh-CN/parse/string-format)
- `axisFormat` x 轴显示格式
[https://github.com/d3/d3-time-format/tree/v4.0.0#locale_format](https://github.com/d3/d3-time-format/tree/v4.0.0#locale_format)
- `tickInterval` x 轴刻度
```
/^([1-9][0-9]*)(minute|hour|day|week|month)$/;
```
- `displayMode: compact`
可以让 gantt 图更紧凑
{{< mermaid >}}
--- 
displayMode: compact 
---
gantt 
title A Gantt Diagram 
dateFormat YYYY-MM-DD 
section Section A 
task :a1, 2014-01-01, 30d 
Another task :a2, 2014-01-20, 25d 
Another one :a3, 2014-02-10, 20d
{{< /mermaid >}}

```
--- 
displayMode: compact 
---
gantt
	...
```

## 例子

{{< mermaid >}}
gantt
    title 项目计划表

    section 设计阶段
        需求分析:done,a, 2022-01-01, 10d
        概要设计:done,b, 2022-01-11, 10d
        详细设计:c, 2022-01-21, 10d
        
    section 编码阶段
        编码:crit,d, 2022-02-01, 28d

    section 测试阶段
        单元测试:e, 2022-03-01, 10d
        集成测试:f, 2022-03-11, 10d
        系统测试:g, 2022-03-21, 10d
{{< /mermaid >}}

```
gantt
    title 项目计划表

    section 设计阶段
        需求分析:done,a, 2022-01-01, 10d
        概要设计:done,b, 2022-01-11, 10d
        详细设计:c, 2022-01-21, 10d
        
    section 编码阶段
        编码:crit,d, 2022-02-01, 28d

    section 测试阶段
        单元测试:e, 2022-03-01, 10d
        集成测试:f, 2022-03-11, 10d
        系统测试:g, 2022-03-21, 10d
```

---
1. https://mermaid.js.org/syntax/gantt.html

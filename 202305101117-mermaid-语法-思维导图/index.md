# mermaid 语法-思维导图

<!--more-->
#mermaid 

<font color=grey>（思维导图在 obsidian v1.2.7 中还没支持）</font>

## 基本语法

思维导图主要通过 `缩进` 来表示其结构

再配合记住一些关键字即可：
- `mindmap`
- `root`

{{< mermaid >}}
mindmap
root
    a
        aa
        ab
    b
{{< /mermaid >}}

```
mindmap
root
    a
        aa
        ab
    b
```

## 元素的形状

跟流程图表现形状的方法类似
{{< mermaid >}}
mindmap
root((mymind))
    id[1.square]
    id(2.rounded)
    id((3.circle))
    id))4.explode((
    id)5.cloud(
    id{{6.hexagon}}
    7.default
{{< /mermaid >}}
```
mindmap
root((mymind))
    id[1.square]
    id(2.rounded)
    id((3.circle))
    id))4.explode((
    id)5.cloud(
    id{{6.hexagon}}
    7.default
```

## 文字说明

"\`文字内容\`"

{{< mermaid >}}
mindmap
root((mymind))
    id["`1.square
    一些说明性的文字
    可能会有换行的需求
    这将使用到反单引号
    这里同样可以使用表情🥵`"]
  
    id(2.rounded)
    id((3.circle))
{{< /mermaid >}}
```
mindmap
root((mymind))
    id["`1.square
    一些说明性的文字
    可能会有换行的需求
    这将使用到反单引号
    这里同样可以使用表情🥵`"]
  
    id(2.rounded)
    id((3.circle))
```


## 图标

`::icon()`

{{< mermaid >}}
mindmap
root((mymind))
    id[1.square]
    ::icon(fas fa-yen-sign)
    id(2.rounded)
    id((3.circle))
    ::icon(fas fa-circle-notch)
    id))4.explode((
    id)5.cloud(
    ::icon(fas fa-cloud)
    id{{6.hexagon}}
    7.default
{{< /mermaid >}}
```
mindmap
root((mymind))
    id[1.square]
    ::icon(fas fa-yen-sign)
    id(2.rounded)
    id((3.circle))
    ::icon(fas fa-circle-notch)
    id))4.explode((
    id)5.cloud(
    ::icon(fas fa-cloud)
    id{{6.hexagon}}
    7.default
```

看效果感觉做的还不是很好

---
1. https://mermaid.js.org/syntax/mindmap.html

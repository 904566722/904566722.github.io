# 开始记录一些我的工具、便捷操作[持续记录...]

<!--more-->
#个人记录 

## 写作
### 我的写作工具

{{< mermaid >}}
flowchart LR

tp[typora]-->|1|vsc[vscode]
vsc-->tp
tp-->|2|nt[notion]
nt-->tp
tp-->|3|ta[the archive]
subgraph 支持卡片盒笔记法
ta-->|4|o["obsidian(正在使用)"]
end
{{< /mermaid >}}

#### Obsidian

之前换过一些工具，就先不记录了，因为前段时间看了卡片盒笔记法，找了一些方便使用这个方法的软件来用，正在使用 Obsidian，记录一下一些常用设置：

<font color=grey>（为什么这个框框得点两次）</font>
{{< admonition type=quote title="新建文件路径、图片存放位置" open=false >}}
![](images/posts/Pasted%20image%2020230510121203.png)
{{< /admonition >}}

{{< admonition type=quote title="适配卡片盒笔记法" open=false >}}
![](images/posts/Pasted%20image%2020230510121633.png)

![](images/posts/Pasted%20image%2020230510121753.png)

![](images/posts/Pasted%20image%2020230510121908.png)

{{< /admonition >}}

一个正常的笔记流程：
1. 新建时间戳笔记
2. 修改文件的相关描述
3. 开始写作

![](images/posts/Pasted%20image%2020230510122337.png)

### 图床

使用 github 保存图片

编辑的时候粘贴的时候都保存到本地 themes/DoIt/assets/images/posts 文件夹中，写作的时候无需做上传图片的操作

但是需要把 ~~·themes/DoIt/assets/~~ images/posts 这段内容删除，为的是让 hugo 生成静态页面之后能找到这张图片

这样就能够同时在 博客、obsidian 中看到这张图片

### 键盘

#### NIZ 宁芝 84EC(S) Ble

好！

[固件、编程软件下载](https://www.aliyundrive.com/s/WYfJeqzPCox)

正常写作、工作问题定位的时候可能会用到一些重复性的输入，复杂的输入，使用编程软件编写对应的宏，提高效率

- 宏
![](images/posts/Pasted%20image%2020230510123624.png)
首先 `1.读取配置` 放置直接写入覆盖掉了之前的配置，然后进行 `自定义的操作`，编辑完成之后把配置 `写入按键`，最后`保存一下配置`，做个备份。

看下效果：
![](images/posts/GIF%202023-5-10%2012-39-02.gif)

### 音乐嵌入流程

1. 把音乐放到对应的 music 文件夹
	![](images/posts/Pasted%20image%2020230510124805.png)
2. 编辑调用代码

```
music url="/music/lessang/recall.m4a" name="xxx" artist="xxx" cover="/music/lessang/xxx.png"
```

示例：
{{<  music url="/music/lessang/recall.m4a" name="회상 (Feat. 백지영) (回想)" artist="Leessang (리쌍)/白智英 (백지영)" cover="/music/lessang/recall.png" >}}

### 画图

- [processon](https://www.processon.com/)
- mermaid

## 下载

### 通常下载

[IDM](https://www.internetdownloadmanager.com/)

### youtube 视频音频

[https://youtube.iiilab.com/](https://youtube.iiilab.com/)

## 文档
[Kubernetes](https://kubernetes.io/zh-cn/docs/home/)

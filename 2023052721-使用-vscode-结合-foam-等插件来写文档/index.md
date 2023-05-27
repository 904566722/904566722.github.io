# 使用 vscode 结合 foam 等插件来写文档

<!--more-->
#vscode #foam #写作流

之前使用 **obsidian** 写作了有段时间了，整体体验下来其实还不错

- 支持卡片盒写作
- 不同的 workspace 之间可以有不同的设置
- 图片会全局查找（引用缺失地址前缀也是能够找到图片的）
- ...

优点挺多的，但是后来还是觉得使用 vscode 来写作吧，由于 vscode 插件库很丰富，如果有什么需求都能够用插件来实现，也就省去了之后可能更换写作工具的麻烦。经过一番捣鼓，vscode 也大致都满足了我想要的一些需求，在此做个记录。

## 一、主要插件列表

1. [Foam | A personal knowledge management and sharing system for VSCode](https://foambubble.github.io/foam/)

    通过这个插件实现 vscode 支持卡片盒写作方式

2. [Image preview - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview)
3. [Markdown Image - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=hancel.markdown-image)

    上面这两个插件用来解决图片的插入和预览

4. 其他插件不赘述，根据个人习惯

### 二、插件配置

#### foam

foam 的配置主要用 `.foam/templates/` 目录下的两个模板来实现：

1. `card.md`

    正常的记录文档通过这个模板来创建

```md {hl_lines=[2,5,"15-16"]}
---
title: "${TM_FILENAME_BASE/^[0-9]+ (.*)$/$1/}"
subtitle: ""
description: ""
date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}T${CURRENT_HOUR}:${CURRENT_MINUTE}:00+08:00
draft: false
authors: [索隆不喝酒]
tags: []
series: []
categories: [灵感、文献笔记（非永久笔记）]
series_weight: 1
seriesNavigation: true
featuredImage: ""
featuredImagePreview: ""
foam_template:
  filepath: 'content/posts/box/$FOAM_DATE_YEAR$FOAM_DATE_MONTH$FOAM_DATE_DATE$FOAM_DATE_HOUR $FOAM_TITLE.md'
---
<!--more-->
```

- `${TM_FILENAME_BASE/^[0-9]+ (.*)$/$1/}`: 将文件的名称分成三个部分
  
    第一部分 `^[0-9]+`，第二部分 ` `，第三部分`(.*)`，并且将第三部分捕获到第一个捕获组中，然后使用这个捕获组作为文件的名字（在博客中显示的名字）

    参考教程：[Snippets in Visual Studio Code](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_variable-transforms)

- date 使用的变量参考：[Snippets in Visual Studio Code](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_variables)
- filepath 的配置决定了文件创建在哪个文件夹以及文件名称，配置参考：[Note Templates | Foam](https://foambubble.github.io/foam/user/features/note-templates#example-of-relative-filepath)

2. `dialy-note.md`

```md
---
title: "${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}-daily-note"
subtitle: ""
description: ""
date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}T${CURRENT_HOUR}:${CURRENT_MINUTE}:00+08:00
draft: false
authors: [索隆不喝酒]

tags: [个人记录]
series: [日规划-记录]
categories: [生活记录]
series_weight: 1
seriesNavigation: true
featuredImage: ""
featuredImagePreview: ""
foam_template:
    filepath: 'content/posts/life/diary/$FOAM_DATE_YEAR/$FOAM_DATE_MONTH/$FOAM_DATE_YEAR-$FOAM_DATE_MONTH-$FOAM_DATE_DATE-daily-note.md'
---
<!--more-->
```

在项目中的位置：
![图 1](images/posts/20230527-222259604.png)  

#### markdown image

主要配置：
![图 2](images/posts/20230527-222647775.png)  

- `Path` 确定图片放在项目中的路径
- `Reference Path` 确定图片加入文档的时候的引用路径，比如下面这种形式

    ```text
    ![图 2](images/posts/20230527-222647775.png)  
    ```

    这个路径是博客需要定位的路径

到这已经实现了图片的插入，但是因为 Path 跟 Reference Path 的配置不一样，在 vscode 中查看的时候，是看不到图片的，因此需要用到下面的扩展

#### image preview

主要配置：
![图 3](images/posts/20230527-223105626.png)  

相当于再把前面确实的路径加上，达到本地可见的效果
![图 4](images/posts/20230527-223329360.png)  


## 三、快捷操作备忘

vscode 命令菜单：`ctrl` + `alt` + `p`

1. foam

    ![图 5](images/posts/20230527-223538586.png)  

    使用 foam 提供的命令实现从模板创建文档，创建日记的操作

## 四、好用的插件记录

1. [markdown-link-expander - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=skn0tt.markdown-link-expander)

    根据网址生成 md 链接格式


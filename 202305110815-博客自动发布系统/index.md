# 博客自动发布系统

<!--more-->
#个人记录 

## 手动发布流程

以`编写一篇文档为例`：

1.  使用 obsidian 编写文档
2.  执行命令行本地生成 hugo 页面，看看有没有报错、文档编排之类的问题

```sh
hugo server -e production --disableFastRender
```

3.  如果没有问题，需要把相应内容推送到两个仓库：保存md文档的[仓库A](https://github.com/904566722/study-blog)（本仓库）、保存hugo生成的静态页面的[仓库B](https://github.com/904566722/904566722.github.io)
    
    可以先推送到仓库A，保存文章 然后执行 hugo 生成静态网页，切到 public 目录，推送内容到仓库B
    
```sh
git add .
git commit -m "m/w. desc"
git push

hugo
cd public
git add .
git commit -m "m/w. desc"
git push
```


## 自动发布

需要使用到
- [GitHub Action](https://github.com/features/actions)

一段描述：

使用 GitHub Actions 直接在您的存储库中自动化、自定义和执行您的软件开发工作流程。您可以发现、创建和共享操作以执行您喜欢的任何工作，包括 CI/CD，并在完全自定义的工作流中组合操作

那么就可以用来省去手动到 public 目录 commit、push 的操作，实现博客的自动发布。
设定两个事件就差不多了：
- 当仓库 A 有代码更新（push），执行脚本
- 定时执行脚本



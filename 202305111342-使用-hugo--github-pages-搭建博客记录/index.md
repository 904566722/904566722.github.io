# 使用 Hugo + GitHub Pages 搭建博客记录

<!--more-->
#个人记录 

> windows 环境

## Hugo 安装

依赖/版本：
- Go 1.20.4（不同的 hugo 依赖的 go 版本可能不同，注意分辨）
- Hugo v0.91.2-1798BD3F+extended 
- Git

可以直接在 Hugo 已发布的[版本](https://github.com/gohugoio/hugo/releases) 中直接下载二进制文件来运行

可以在环境变量中添加一个专门放自己二进制文件的目录：
![](images/posts/Pasted%20image%2020230511134846.png)

将上面下载的 hugo 二进制文件放到上面定义的目录下，就能够直接运行这个命令了
![](images/posts/Pasted%20image%2020230511135242.png)
![](images/posts/Pasted%20image%2020230511135031.png)

## 生成项目

具体可以参考文档：[https://gohugo.io/getting-started/quick-start/](https://gohugo.io/getting-started/quick-start/)

```
hugo new site demo1         # 生成项目结构
cd demo1
git init                    # 将项目初始化成 git 项目
# 克隆一个主题
git submodule add git@github.com:theNewDynamic/gohugo-theme-ananke.git themes/ananke
echo "theme = 'ananke'" >> config.toml # 把主题选择写入配置文件，选择上面克隆的主题
  
hugo new posts/test_post.md # 写一个测试文档
hugo server --buildDrafts                 # 本地运行
```

运行之后本地访问 `localhost:1313`：
![](images/posts/Pasted%20image%2020230511140507.png)

项目结构：
```
$ tree -d -L 2
.
|-- archetypes
|-- content
|   `-- posts
|-- data
|-- gohugo-theme-ananke
|   |-- archetypes
|   |-- assets
|   |-- exampleSite
|   |-- i18n
|   |-- images
|   |-- layouts
|   |-- resources
|   `-- static
|-- layouts
|-- public
|-- resources
|   `-- _gen
|-- static
`-- themes
    `-- ananke
```

## 选择主题

1. 挑选喜欢的主题仓库，克隆到 themes 目录下
[https://themes.gohugo.io/](https://themes.gohugo.io/)

2. 编辑 config.toml 配置文件
```
...
theme = '主题'
```

或者比较成熟的主题一般都会有自己的完善的配置文档，直接参照即可，本博客使用 [Doit ](https://hugodoit.pages.dev/zh-cn/)主题

## 使用 GitHub Pages 部署站点

使用 `hugo` 命令在自己的博客根目录生成博客站点文件夹 `public`
```
hugo

cd public
```

![](images/posts/Pasted%20image%2020230511141545.png)

新建一个 `username.github.io` 的仓库，比如我的仓库名为 904566722.github.io ，然后将上面生成的 public 文件夹的内容推送到该仓库

然后就可以使用 username.github.io 来访问该网站了

## 注册域名

为了能够使用自己的域名来访问博客，可以注册一个域名，我这边使用腾讯云的域名，购买完成后配置解析：
![](images/posts/Pasted%20image%2020230511141845.png)

下一步是在 username.github.io 中配置自己的域名：
![](images/posts/Pasted%20image%2020230511142007.png)

配置完成后就可以使用自己的域名来访问网站啦

![](images/posts/Pasted%20image%2020230511142154.png)

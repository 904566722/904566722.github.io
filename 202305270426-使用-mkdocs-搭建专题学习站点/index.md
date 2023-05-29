# 使用 MkDocs 搭建专题学习站点

<!--more-->
#

{{< admonition warning "about card" false >}}
这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`
{{< /admonition>}}

之前使用 hugo （local [202305111342 使用 Hugo + GitHub Pages 搭建博客记录](content/posts/tools/202305111342%20使用%20Hugo%20+%20GitHub%20Pages%20搭建博客记录.md)  remote [202305111342 使用 Hugo + GitHub Pages 搭建博客记录](http://honghuiqiang.com/202305111342-%E4%BD%BF%E7%94%A8-hugo-%2B-github-pages-%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2%E8%AE%B0%E5%BD%95)）搭建了一个用来「记录各种事情」的博客，很多东西都会往这上面写，对自己来说是一个大而全的站点，主要靠「分类」和「系列」来对文章归档，已经足够满足我的需求了，但是我还想要有一个用来记录「专题」学习的地方，比如一个学习 golang 源码的专题，或者算法刷题的专题，类似这样的站点。

为什么使用 MkDocs，之前搭建本博客使用了 hugo，就不再使用，找了找，MkDocs 也很轻量方便，关键是导航做得很符合用来写专题的需求。在主题上选用了最热门的 [mkdocs-material](https://squidfunk.github.io/mkdocs-material/) 。

下面就搭建「算法刷题记录」站点为例来说明

1. 跟着 [mkdocs demo](https://www.mkdocs.org/getting-started/) 熟悉一下
2. [start mkdocs-material](https://squidfunk.github.io/mkdocs-material/getting-started/)
3. 根据自己的喜好、需求进行[配置](https://squidfunk.github.io/mkdocs-material/setup/)

	一个 `mkdocs.yaml` 例子
	```yaml
	site_name: HHQ算法笔记  
	theme:  
	name: material  
	# font:  
	# code: Roboto Mono  
	palette:  
	- scheme: default  
	toggle:  
	icon: material/brightness-7  
	name: Switch to dark mode  
	primary: green # 标题、侧边栏、文本链接的颜色  
	accent: red # 交互元素、悬停链接、按钮、滚动条  
	- scheme: slate  
	toggle:  
	icon: material/brightness-4  
	name: Switch to light mode  
	# primary: green # 标题、侧边栏、文本链接的颜色  
	accent: red # 交互元素、悬停链接、按钮、滚动条  
	  
	  
	# logo: assets/img/zoro.png  
	favicon: images/posts/zoro.png  
	features:  
	- content.code.copy  
	- content.code.annotate  
	- content.tabs.link  
	- navigation.instant  
	- navigation.tracking  
	- navigation.tabs  
	# - navigation.tabs.sticky  
	- navigation.sections  
	- navigation.expand  
	- navigation.path  
	- navigation.top  
	# - navigation.indexes  
	  
	#nav:  
	# - Blog:  
	# - blog/index.md  
	  
	repo_url: https://github.com/904566722/algo  
	repo_name: 904566722/algo  
	  
	plugins:  
	- search:  
	lang:  
	- en  
	# - blog:  
	# enabled: !ENV [CI, false]  
	# blog_dir: .  
	# blog_toc: true  
	  
	markdown_extensions:  
	- admonition  
	- pymdownx.details  
	- pymdownx.superfences  
	- pymdownx.tabbed:  
	alternate_style: true  
	slugify: !!python/object/apply:pymdownx.slugs.slugify  
	kwds:  
	case: lower  
	- pymdownx.highlight:  
	anchor_linenums: true  
	line_spans: __span  
	pygments_lang_class: true  
	- pymdownx.inlinehilite  
	- pymdownx.snippets  
	- footnotes  
	- pymdownx.critic  
	- pymdownx.caret  
	- pymdownx.keys  
	- pymdownx.mark  
	- pymdownx.tilde  
	- attr_list  
	- pymdownx.emoji:  
	emoji_index: !!python/name:materialx.emoji.twemoji  
	emoji_generator: !!python/name:materialx.emoji.to_svg  
	- attr_list  
	- md_in_html  
	- def_list  
	- pymdownx.tasklist:  
	custom_checkbox: true
	```

1. 学习一下对应的 markdown 一些[特色写法](https://squidfunk.github.io/mkdocs-material/reference/)
2. 关联到 github，使用 Github Action 来[发布站点](https://squidfunk.github.io/mkdocs-material/publishing-your-site/)

![](images/posts/Pasted%20image%2020230527044307.png)

> 因为之前我已经绑定了域名 honghuiqiang.com，因此这里发布站点的地址是 「`\<domain>/项目名称`」
> 
> 正常应该是 「`\<username>.github.io/项目名称`」

<font color=grey>tip：一个 github 用户能够发布一个用户站点、一个项目站点，多个`项目站点`，这边发布的是项目站点，因此是使用后面跟 `/项目名称` 的方式来访问的</font>


效果：
![](images/posts/Pasted%20image%2020230527045159.png)

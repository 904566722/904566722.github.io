# Hugo 博客站点添加评论、网站分析的功能

<!--more-->
#个人记录 

> 博客使用 [Doit](https://hugodoit.pages.dev/zh-cn/about/#back-to-top) 主题，对两个功能有很好的支持

## 评论功能

Doit 支持多种社交和评论系统，这边选用 giscus

1. 新建一个[hugo-giscus-common-system](https://github.com/904566722/hugo-giscus-common-system) 仓库，到 `settings` / `general` 设置中开启 discussions 设置：

![](images/posts/Pasted%20image%2020230512053138.png)

2. 使用 [giscus.app](https://giscus.app/zh-CN) 生成相关配置
- 安装 giscus app
- 填入仓库
![](images/posts/Pasted%20image%2020230512053351.png)

3. 选择分类
![](images/posts/Pasted%20image%2020230512053411.png)

4. 填入 hugo 的 config.toml 配置文件

上面的步骤都完成之后，在下面的 `启用 giscus` 一栏中会有相应的配置：
![](images/posts/Pasted%20image%2020230512053551.png)

对应配置 config.toml

![](images/posts/Pasted%20image%2020230512053656.png)

## 网站分析

直接参考 [https://hugodoit.pages.dev/zh-cn/about/#back-to-top](https://hugodoit.pages.dev/zh-cn/about/#back-to-top)

获得id的流程很简单：
- google
![](images/posts/Pasted%20image%2020230512054031.png)
- baidu
![](images/posts/Pasted%20image%2020230512054104.png)

然后在 config.toml 中开启分析功能，并配置 id 即可

查看分析数据：

https://analytics.google.com/analytics/web

https://tongji.baidu.com/


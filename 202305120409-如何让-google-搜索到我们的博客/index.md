# 如何让 Google 搜索到我们的博客

<!--more-->
#个人记录 

## 为什么搜索不到我的博客

突然想在 Google 搜索一下自己的博客，但是我发现啥子也搜索不到

（既然已经把写作的内容从本地迁移到了博客，也是因为有以下的原因：
- 自己的写作工具时常变迁，可能有以下麻烦：
	- 需要迁移文档，一些链接方式可能发生改变
	- 有时候写的文档被遗漏、丢失

如果每写一篇文章就发布到自己的博客，就算之后写作工具发生改变，也可以不进行文档迁移的操作

- all in one，把所有的内容放到一个地方，也方便查看
- 跟广大的网友交流，有时候自己的一些想法、学习内容可能是有差错、或者能够优化的，如果能够得到各路高人的指点，那必定是相当 nice 的，其次，如果自己的总结、方法对别人有些许帮助，分享出去也是一种收获


原因：

Google 只能搜索到已经收录的站点，我的博客没有知名度，Google 也不会自动收录

解决：

这种情况下可以自己主动请求让 Google 收录我们的博客

## 如何进行操作

1. 查看我们的站点是否被收录

在谷歌搜索栏输入：
```
site:https://honghuiqiang.com
```
![](images/posts/Pasted%20image%2020230512042226.png)

很明显是没有被收录的

2. 提交搜索资源

在 [google search console](https://search.google.com/search-console) 添加资源，选用 `网址前缀` 类型

![](images/posts/Pasted%20image%2020230512042908.png)

下载上面的 html 文件，更新到站点根目录

往 904566722.github.io 推送该修改：
![](images/posts/Pasted%20image%2020230512043023.png)

等待 gh pages 部署完成：
![](images/posts/Pasted%20image%2020230512043124.png)

验证就完成了：

![](images/posts/Pasted%20image%2020230512043151.png)


3. 生成站点地图（hugo 已自动生成，忽略该步骤）

进入 [XML-Sitemaps.com](https://www.xml-sitemaps.com/) ，输入博客的地址，点击 `start` ，等待进程结束

![](images/posts/Pasted%20image%2020230512043327.png)

点击 `view sitemap details` 下载 sitemap file

![](images/posts/Pasted%20image%2020230512043541.png)

同样上传到站点根目录

这个 sitemap.xml 文件保存的其实就是博客的博文、目录的路径：
![](images/posts/Pasted%20image%2020230512044448.png)

4. 到 Google Search Console 提交站点地图

![](images/posts/Pasted%20image%2020230512044709.png)

![](images/posts/Pasted%20image%2020230512045813.png)

5. 手动请求编入索引

可以测试其中一篇博文

![](images/posts/Pasted%20image%2020230512045931.png)

![](images/posts/Pasted%20image%2020230512050044.png)

这个就是手动请求编入索引的步骤


以上的步骤完全参照文档：[https://zoharandroid.github.io/2019-08-03-%E8%AE%A9%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%88%B0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8D%9A%E5%AE%A2/](https://zoharandroid.github.io/2019-08-03-%E8%AE%A9%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%88%B0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8D%9A%E5%AE%A2/)

写的很简洁清楚

## 通过 github action 自动发布的 hugo 类型博客需要做什么改动

关于 hugo 可以省去上面的关于 sitemap 的操作

只需要在 xxx.github.io 仓库根路径添加 `google search verification` 的那个 html 文件

可以有多种方式实现这个效果，可以用自己喜欢的方式，也可以参考以下方式：

1. 在源仓库（保存博客md文件的仓库，也是执行 gh action 的仓库）添加一个 `extend` 文件夹，把对应的 xxx.html（上面的认证文件） 放到这个目录下
2. 修改 gh action 的 yaml 配置脚本

![](images/posts/Pasted%20image%2020230512051907.png)

在使用 hugo 命令生成 public 目录之后，把 extend 目录下的内容拷贝到 public 目录

```yaml
name: deploy

on:
    push:
    workflow_dispatch:
    schedule:
        # Runs everyday at 8:00 AM
        - cron: '0 0 * * *'

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v2
              with:
                  submodules: true
                  fetch-depth: 0

            - name: Set up Python
              uses: actions/setup-python@v2
              with:
                  python-version: 3.8
            
            - name: Commit and push if changed
              run: |-
                  git diff
                  git config --global user.email "action@github.com"
                  git config --global user.name "GitHub Action"
                  git add -A
                  git commit -m "ci: update about page (automatically)" || exit 0
                  git push

            - name: Setup Hugo
              uses: peaceiris/actions-hugo@v2
              with:
                  hugo-version: 0.105.0
                  extended: true

            - name: Build Web
              run: hugo --gc --minify
              #run: hugo

            - name: CP Extend Files
              run: cp ./extend/* ./public

            - name: Create CNAME
              run: echo "honghuiqiang.com" > public/CNAME

            - name: Run Pagefind
              run: npm_config_yes=true npx pagefind --source "public"

            - name: Deploy Web
              uses: peaceiris/actions-gh-pages@v3
              with:
                  PERSONAL_TOKEN: ${{ secrets.PERSONAL_TOKEN }}
                  EXTERNAL_REPOSITORY: 904566722/904566722.github.io
                  PUBLISH_BRANCH: hugo
                  PUBLISH_DIR: ./public
                  commit_message: ${{ github.event.head_commit.message }}
```

至此就完成了所有操作

---
1. https://zoharandroid.github.io/2019-08-03-%E8%AE%A9%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%88%B0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8D%9A%E5%AE%A2/

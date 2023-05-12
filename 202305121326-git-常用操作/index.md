# Git 常用操作

<!--more-->
#Git

## 了解概念

![](images/posts/Pasted%20image%2020230512132711.png)

-   工作区：本地看到的目录
    
-   暂存区：stage 或者叫 index
    
-   版本库：
    
-   HEAD : 实际是指向 master 的一个游标，如图出现 HEAD 的命令也可以用 master 代替
    
-   执行 `git add` ，index 目录树更新，工作区的修改内容被写入到 objects 中的一个新对象，新对象 id 记录在 index 的文件索引中
    
-   `git commit` 时，master 分支做相应的更新

## 常用命令
### git help
```sh
$ git --help
usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           [--super-prefix=<path>] [--config-env=<name>=<envvar>]
           <command> [<args>]

这些是在不同情况下常用的Git命令:

开始一个工作区 (see also: git help tutorial)
   clone             克隆一个版本库到一个新的目录中
   init              创建一个空的Git仓库或重新初始化一个现有的仓库

围绕当前的变化开展工作 (see also: git help everyday)
   add               将文件内容添加到索引中
   mv                移动或重命名一个文件、一个目录或一个符号链接（symlink）
   restore           恢复工作树文件
   rm                从工作树和索引中删除文件
   sparse-checkout   初始化和修改 sparse-checkout

审查历史和统计 (see also: git help revisions)
   bisect            使用二进制搜索来查找引入错误的提交
   diff              Show changes between commits, commit and working tree, etc
   grep              打印与模式相匹配的行
   log               显示提交日志
   show              显示各种类型的对象
   status            显示工作树状态

增长、标记和调整你的共同历史
   branch            列出、创建或删除分支
   commit            记录对存储库的更改
   merge             将两个或更多的发展历史连接在一起
   rebase            在另一个基础提示之上重新提交
   reset             将当前的HEAD复位到指定的状态
   switch            切换分支
   tag               创建、列出、删除或验证一个用GPG签名的标签对象

协同合作 (see also: git help workflows)
   fetch             从另一个资源库下载 objects 和 refs 
   pull              从另一个版本库或本地分支获取并与之整合
   push              更新远程相关 objects 和 refs

'git help -a' and 'git help -g' list available subcommands and some
concept guides. See 'git help <command>' or 'git help <concept>'
to read about a specific subcommand or concept.
See 'git help git' for an overview of the system.
```

### diff

### log
```sh
git log --oneline

# -n 显示最近 n 条提交记录
git log --oneline -5 # 显示最近5条提交

# --after 指定时间之后的提交；--before 指定时间之前的ti'ji
git log --oneline --after=2022-06-01
```

### reflog
```sh
## 查看分支是从哪个分支创建出来的
git reflog show <分支名>
git reflog --date=local | grep <分支名>
```

### branch
```sh
git branch      # 查看本地分支情况
git branch -a   # 查看所有分支

git branch <分支名> // 创建分支，新的分支数据与当前分支的数据相同
git checkout <分支名>  // 切换分支

git branch -d                 # 删除本地分支
git push origin -d task-print # 删除远端分支
```

### cherry-pick
```sh
git cherry-pick 7fa7894
# (7fa7894, 9f0d518]
git cherry-pick 7fa7894..9f0d518
# [7fa7894, 9f0d518]
git cherry-pick 7fa7894^..9f0d518
# 打开编辑器，编辑提交信息
-e
# 在提交信息的末尾追加 cherry pick 来源 commit
-x
# 继续操作
--continue
# 放弃合并回到操作前的样子
--abort
# 退出，但是不回到操作前的样子
--quit
```

### checkout 
```sh
git checkout -b 分支名 remotes/origin/分支名       # 拉取远程的分支到本地
git checkout -b 分支名                             # 创建并切换到分支
```

### reset
```sh
git reset [--soft | --mixed | --hard] [HEAD]
```

### fetch
```sh
git fetch [alias]
git merge [alias]/[branch]
git checkout -b master origin/master         # 本地没有 master 分支，拉取远程的 master 分支
```

### pull
`git pull` 其实就是 `git fetch` 和 `git merge FETCH_HEAD` 的简写
```sh
git pull <远程主机名> <远程分支名>:<本地分支名> // 将远程主机 origin 的分支拉取到本地，并于本地的分支合并
git pull <远程主机名> <远程分支>               // 默认合并到当前分支
```

### push
```sh
git push <远程主机名> <本地分支名>:<远程分支名>
git push <远程主机名> <本地分支名>   // <本地分支名> = <远程分支名> 
```

### 添加远程仓库
```sh
git remote -v # 查看本仓库的远程仓库列表
git remote add B 
```

## 场景
### fetch
![](images/posts/Pasted%20image%2020230512133041.png)

### merge request
```
从 master 同时拉出来两个分支 task1、task2
							master
								/\
					       task1  task2
task1 与 task2 在同一个文件的同一个位置各加了一个方法，两个分支同时向 master 提了个 mr
先合入 task2 的 mr
这时 task1 的 mr 就会有冲突，如何解决？
```

step1. fetch 同步代码

step2. rebase，上游分支选择 master，开始 rebase，解决出现的冲突

![](images/posts/Pasted%20image%2020230512133117.png)

step3. 强制 push 到 task1 分支

命令行操作:
```sh
git fetch
git rebase origin/master
# 解决冲突 ...
git add 文件
git rebase --continue
git push origin task1:task1 --force
```

### rebase 理解

> [https://www.yiibai.com/git/git_rebase.html](https://www.yiibai.com/git/git_rebase.html)

```sh
# 当前处于 task4 分支，执行
git rebase origin/master
# **相当于把在 task4 分支的提交重新创建，放到 origin/master 的提交之后**
# 老的提交被丢弃
```
![](images/posts/Pasted%20image%2020230512133259.png)

### cherry-pick
```sh
git cherry-pick hash1..hash2
```

![](images/posts/Pasted%20image%2020230512133334.png)

### 合并 commit

```sh
git rebase -i

ie.
$ git log --oneline
3f9a1c2 (HEAD -> bugfix-1-temp) 2 & 3
b86fd5c 1
71df3ef (origin/bugfix-1-temp, origin/bugfix-1, bugfix-1) 1
3aa9ee7 Merge branch 'master' of code.cestc.cn:honghuiqiang/git-practice

# 如果需要合并前两个 commit， -i 指向第三个 commit
git rebase -i 71df3ef
$ git log --oneline
04beace (HEAD -> bugfix-1-temp) 1 & 2 & 3
71df3ef (origin/bugfix-1-temp, origin/bugfix-1, bugfix-1) 1
```

![](images/posts/Pasted%20image%2020230512133419.png)

### 基于已有工程创建新的 git 仓库
```sh
git init
git remote add origin http://xxxx.git
git add .
git commit -m "init project."
git push -u origin master
```

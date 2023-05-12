# ginkgo 简单使用

<!--more-->
#测试

## 安装、使用

安装
```sh
go get -u github.com/onsi/ginkgo/v2/ginkgo
go get -u github.com/onsi/gomega/...
```

## 写作规范

### 组织结构
Ginkgo 广泛使用闭包来构建描述性规范层次结构（**以代码组织形式的方式来描述代码行为**），这个结构层次是使用**三种类型的节点**来构建的：

-   **container node 容器节点**

	用来组织正在测试的代码的不同方面
	
	例如： `Describe`、`Context`、`When`
	
	通常使用 `Describe` 使用代码的不同功能，使用 `Context` 探索每种功能的行为

-   **setup node 设置节点**

	用来设置规范的状态
	
	例如：`BeforeEach`

-   **subject node 主题节点**

	用来编写一个规范


container、setup、subject node 形成一个规范树：
```go
var _ = Describe("Book", func() {
	var foxInSocks, lesMis *books.Book // 共享变量（设置节点和主题节点之间共享的变量）

	BeforeEach(func() { // 设置节点
		lesMis = &books.Book{
			Title:  "Les Miserables",
			Author: "Victor Hugo",
			Pages:  2783,
		}

		foxInSocks = &books.Book{
			Title:  "Fox In Socks",
			Author: "Dr. Seuss",
			Pages:  24,
		}
	})

	Describe("Categorizing books", func() {
		Context("with more than 300 pages", func() {
			It("should be a novel", func() { // 主题节点
				gomega.Expect(lesMis.Category(), books.CategoryNovel)
			})
		})

		Context("with fewer than 300 pages", func() {
			It("should be a short story", func() {
				gomega.Expect(foxInSocks.Category(), books.CategoryShortStory)
			})
		})
	})
})
```

### 注意点

-   一个规范可以设置多个节点，但是**只能有一个主题节点**

-   每个规范之间应该是完全独立的，这运行 Ginkgo 打乱顺序，并行运行规范
    
-   在容器节点中声明，在设置节点中初始化
    
-   断言应该在设置节点或者主题节点中，不应该出现在容器节点
    

-   `Describe` 是 Ginkgo DSL 的一部分，具有描述、闭包的功能；一个 Describe 可理解为一个容器

-   `BeforeEach`节点 是Setup 节点节点，其闭包在 It 节点闭包之前运行。当在嵌套的 Container 节点中定义了多个 BeforeEach 节点时，最外层的 BeforeEach 节点闭包首先运行，BeforeEach 会在每个 It 运行之前运行
    
-   `AfterEach` 、`DeferCleanup` 用于清理或者将环境恢复到之前的状态
    
-   `Context`是 Describe 的别名 - 它生成完全相同类型的 Container 节点
    
-   `It` 是一个规范主题，每个规范都只有一个主题节点
    

-   `BeforeSuite`
    
-   `AfterSuite`

## ginkgo cli

```sh
# 初始化套件（suite）
ginkgo bootstrap

# 运行
ginkgo

# 添加规格（spec）
ginkgo generate <规格名>
```

---
1.  github： [https://github.com/onsi/ginkgo](https://github.com/onsi/ginkgo)

2.  github：[https://github.com/onsi/gomega](https://github.com/onsi/gomega)

3.  ginkgo 文档：[https://onsi.github.io/ginkgo/](https://onsi.github.io/ginkgo/)

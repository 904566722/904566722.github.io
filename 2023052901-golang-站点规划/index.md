# Golang 站点规划

<!--more-->
#个人记录

{{< admonition warning "about card" false >}}
这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`
{{< /admonition>}}


## draft

初步构想：

![图 1](images/posts/20230529-011928360.png)  

主要用来记录 Golang 相关的**更深层次**的学习，目的是希望针对 Golang 这门语言，不只是停留在会用上，希望能够真正用好这门语言，感受一些设计哲学、编码规范，帮助自己写出更简洁高效的代码，提升对于隐晦bug定位的能力！

学习路线：

1. 语言基础：
   - 熟悉Golang的基本语法、数据类型、控制流程等基础知识。
   - 官方文档：https://golang.org/doc/
   - 《Go语言圣经》（The Go Programming Language）- Alan A. A. Donovan, Brian W. Kernighan

2. 并发编程：
   - Golang的并发模型是其主要特点之一，学习并发编程对于深入理解Golang至关重要。
   - 学习Goroutine、Channel、互斥锁、条件变量等相关概念和使用方法。
   - 《Go并发编程实战》（Concurrency in Go）- Katherine Cox-Buday
   - 官方博客：https://blog.golang.org/

3. 内存管理：
   - 了解Golang的内存分配和垃圾回收机制，包括堆、栈、指针、GC算法等。
   - 官方博客：https://blog.golang.org/

4. 标准库：
   - 深入了解Golang标准库中各种常用包的设计和实现，如io、net、sync等。
   - 官方文档：https://golang.org/pkg/

5. 编译器和运行时：
   - 学习Golang的编译器、链接器以及运行时（runtime）的实现原理。
   - 官方源码库：https://github.com/golang/go

6. 第三方库和框架：
   - 探索和使用Golang生态系统中的第三方库和框架，了解它们的设计和实现。
   - 了解常用的Web框架（如Gin、Echo）、数据库驱动（如GORM）、测试框架（如Go testing）等。
   - Github上的开源项目，如https://github.com/avelino/awesome-go

7. 源码阅读和贡献：
   - 阅读Golang源码，特别是标准库和常用库的源码，深入理解其设计和实现。
   - 参与Golang社区，向开源项目提交贡献，提出和解决问题。
   - 官方源码库：https://github.com/golang/go

8. other
   - golang tools：使用 golang 提供的工具分析程序
   - Golang 学习站点收集

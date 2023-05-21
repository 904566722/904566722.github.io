# golang 方法

<!--more-->
#

## 一些事实 & 概念

- Go 语言中，我们可以为 `T` 或者 `*T` 类型声明一个方法
- 方法的拥有者类型称作 [属主类型]^(receiver type)，可以是 `T` 也可以是 `*T`
	- 其中 `T` 称作[属主`基`类型]^(receiver basic type)


# new 和 make

<!--more-->
#

## 区别

|new|make|
|-|-|
|分配内存|分配内存并初始化|
|返回指向类型的指针|返回对象的引用|

## 使用场景

- new 用来创建值类型的对象，比如 int、float...
- make 用来创建指针持有者类型的对象，比如 slice、map、channel...


# 使用 dlv 命令来调试 golang 程序

<!--more-->
#dlv #Golang #调试


生成汇编文件（如果需要查看一些底层的函数调用，可以使用这个方式来查看）
```go
go build -gcflags "-N -l -S" main.go 2> main.s
```

开始调试
```go
dlv debug main.go
```

**使用 help 查看支持的命令：**
```sh
运行程序：
    call ------------------------ 恢复进程，注入一个函数调用（实验性的！！）。
    continue (别名: c) --------- 运行到断点或程序终止。
    next (alias: n) ------------- 跨越到下一个源代码行。
    rebuild --------------------- 重建目标可执行文件并重新启动它。如果该可执行文件不是由delve构建的，它就不起作用。
    restart (alias: r) ---------- 重新启动进程。
    step (别名: s) ------------- 在程序中进行单步操作。
    step-instruction (alias: si) 单步执行一条cpu指令。
    stepout (alias: so) --------- 走出当前函数。

操纵断点：
    break (alias: b) ------- 设置一个断点。
    breakpoints (alias: bp) 打印出活动断点的信息。
    clear ------------------ 删除断点。
    clearall --------------- 删除多个断点。
    condition (别名: cond) 设置断点条件。
    on --------------------- 当断点被击中时，执行一条命令。
    toggle ----------------- 开启或关闭一个断点。
    trace (alias: t) ------- 设置跟踪点。
    watch ------------------ 设置观察点。

查看程序变量和内存：
    args ----------------- 打印函数参数。
    display -------------- 每次程序停止时打印表达式的值。
    examinemem (alias: x) 检查指定地址的原始内存。
    locals --------------- 打印局部变量。
    print (alias: p) ----- 评估一个表达式。
    regs ----------------- 打印CPU寄存器的内容。
    set ------------------ 改变一个变量的值。
    vars ----------------- 打印软件包变量。
    whatis --------------- 打印一个表达式的类型。

列出并在线程和goroutine之间切换：
    goroutine (alias: gr) -- 显示或改变当前的goroutine
    goroutines (alias: grs) 列出程序的goroutine。
    thread (alias: tr) ----- 切换到指定的线程。
    threads ---------------- 打印出每个被追踪的线程的信息。

查看调用栈和选择帧：
    deferred --------- 在一个延迟调用的背景下执行命令。
    down ------------- 将当前帧向下移动。
    frame ------------ 设置当前帧，或在不同的帧上执行命令。
    stack (alias: bt) 打印堆栈跟踪。
    up --------------- 将当前帧向上移动。

其他命令：
    config --------------------- 更改配置参数。
    disassemble (alias: disass) 反汇编程序。
    dump ----------------------- 从当前进程状态创建一个核心转储。
    edit (alias: ed) ----------- 打开你在$DELVE_EDITOR或$EDITOR中的位置
    exit (alias: quit | q) ----- 退出调试器。
    funcs ---------------------- 打印函数的列表。
    help (alias: h) ------------ 打印帮助信息。
    libraries ------------------ 列出加载的动态库
    list (alias: ls | l) ------- 显示源代码。
    source --------------------- 执行一个包含delve命令列表的文件
    sources -------------------- 打印源文件的列表。
    transcript ----------------- 将命令输出附加到一个文件中。
    types ---------------------- 打印类型列表
```

熟悉一些常用的操作就行了：
- `break` main.main ---> 使用 break 给 main 函数打一个断点
- `c`  ---> continue，继续执行程序，「直到下一个断点」
- `s` ---> step，继续执行，「进入函数」
- `n` ---> next，继续执行，「不进入函数」
- `bp` ---> breakpoints 查看「断点列表」
- `vars` main ---> 查看包级变量
- `locals` ---> 查看局部变量
- `display` -a val ---> 每一步都显示变量 val 的值

## 场景实操记录

### `调试 for 循环的例子`

通常使用 `break` + `condition`

```go
func main() {  
   testFor()  
}  
  
func testFor()  {  
   cnt := 0  
   for i := 0; i < 10; i++ {  
      cnt ++  
   }  
   return  
}
```
调试过程：
```sh {hl_lines=[26,28,40]}
 dlv debug main.go
Type 'help' for list of commands.
(dlv) break main.main
Breakpoint 1 set at 0xf9ef46 for main.main() d:/code/hhq-notes/算法/leetcode/main.go:3
(dlv) c
> main.main() d:/code/hhq-notes/算法/leetcode/main.go:3 (hits goroutine(1):1 total:1) (PC: 0xf9ef46)
     1: package main
     2: 
=>   3: func main() {
     4:         testFor()
     5: }
     6: 
     7: func testFor()  {
     8:         cnt := 0
... 略 
(dlv) s
> main.testFor() d:/code/hhq-notes/算法/leetcode/main.go:8 (PC: 0xf9ef8e)
...
     7: func testFor()  {
=>   8:         cnt := 0
     9:         for i := 0; i < 10; i++ {
    10:                 cnt ++
    11:         }
    12:         return
    13: }
(dlv) break main.go:10
Breakpoint 2 set at 0xf9efab for main.testFor() d:/code/hhq-notes/算法/leetcode/main.go:10
(dlv) condition 2 i==2
(dlv) c
> main.testFor() d:/code/hhq-notes/算法/leetcode/main.go:10 (hits goroutine(1):1 total:1) (PC: 0xf9efab)
     5: }
     6: 
     7: func testFor()  {
     8:         cnt := 0
     9:         for i := 0; i < 10; i++ {
=>  10:                 cnt ++
    11:         }
    12:         return
    13: }
(dlv) locals
cnt = 2
i = 2
...
```

其中第 28 行表示设置第二个断点生效的条件是当 i = 2

<font color=grey>顺带看一下 stack、goroutines 的结果：</font>
```sh
(dlv) stack
0  0x0000000000f9efba in main.testFor
   at d:/code/hhq-notes/算法/leetcode/main.go:9
1  0x0000000000f9ef57 in main.main
   at d:/code/hhq-notes/算法/leetcode/main.go:4
2  0x0000000000f75088 in runtime.main
   at c:/go/go1.18/src/runtime/proc.go:250
3  0x0000000000f998c1 in runtime.goexit
   at c:/go/go1.18/src/runtime/asm_amd64.s:1571
(dlv) goroutines
* Goroutine 1 - User: d:/code/hhq-notes/算法/leetcode/main.go:9 main.testFor (0xf9efba) (thread 18412)
  Goroutine 2 - User: c:/go/go1.18/src/runtime/proc.go:362 runtime.gopark (0xf75472) [force gc (idle)]
  Goroutine 3 - User: c:/go/go1.18/src/runtime/proc.go:362 runtime.gopark (0xf75472) [GC sweep wait]
  Goroutine 4 - User: c:/go/go1.18/src/runtime/proc.go:362 runtime.gopark (0xf75472) [GC scavenge wait]
[4 goroutines]
```

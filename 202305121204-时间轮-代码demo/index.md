# 时间轮 代码demo

<!--more-->
#代码片段 

## 前置学习

go 定时器 ticker 的学习

```go
func UseTicker()  {
    ticker := time.NewTicker(1 * time.Second)
    done := make(chan bool) // 无缓冲通道

    go func() {
        for {
            select {
           case <-done:
               return
            case t := <-ticker.C:
                fmt.Println("Tick at", t)
           }
        }
    }()

    time.Sleep(5 * time.Second)
    ticker.Stop()
    done <- true
    fmt.Println("Ticker stopped")
}

### 运行结果：
Tick at 2022-02-16 18:46:43.4509023 +0800 CST m=+1.007881901
Tick at 2022-02-16 18:46:44.4605044 +0800 CST m=+2.017484001
Tick at 2022-02-16 18:46:45.453441 +0800 CST m=+3.010420601
Tick at 2022-02-16 18:46:46.4586463 +0800 CST m=+4.015625901
Tick at 2022-02-16 18:46:47.4515569 +0800 CST m=+5.008536501
Ticker stopped
```

## 代码

```go
package practice

import (
    "TimeWheel/pkg/models"
    "TimeWheel/pkg/utils"
    "fmt"
    "log"
    "math"
    "sync"
    "time"
)

type TimingHandler func(taskId string) error

type TimingWheel struct {
    slot int
    interval time.Duration
    size int    // 可存放任务的数量
    tasks []sync.Map
    stop chan struct{}
}

type TimingTask struct {
    round int
    createdAt time.Time // 任务创建时间
    callback TimingHandler  // 任务执行方法
}

// NewTimingWheel 新建一个时间轮
// interval 时间精度
// size tasks（map）容量大小
// 返回一个新建的时间轮，并且开始 scheduler 调度任务，每 interval 的时间间隔做以下操作：
//      slot+1（在 size 值内做循环）
//      run(slot)：获取 slot 下标的任务，执行该任务
func NewTimingWheel(interval time.Duration, size int) *TimingWheel {
    if interval < time.Second {
        interval = time.Second
        log.Println("最低精度： 1s")
    }
    tw := &TimingWheel{
        interval: interval,
        size: size,
        tasks: make([]sync.Map, size),
        stop: make(chan struct{}),
    }

    go tw.scheduler()
    return tw
}

func (tw *TimingWheel) AddTask(taskId string, callback TimingHandler, delay time.Duration)  {
    select {
    case <-tw.stop:
        fmt.Println("TimingWheel is stopped")
        return
    default:
    }
    if delay < tw.interval {
        log.Println("最小精度：1s")
        if delay <= 0 {
            if err := callback(taskId); err !=nil {
                log.Println(fmt.Sprintf("TimingWheel task [%s] run error: %+v", taskId, err))
                return
            }
            log.Println(fmt.Sprintf("TimingWheel task [%s] run success, delay: %d", taskId, delay))
            return
        }
    }

    task := &TimingTask{
        createdAt: time.Now(),
        callback: callback,
    }
    slot := tw.calcSlot(task, delay)    // 计算 slot
    tw.tasks[slot].Store(taskId, task)  // 存入任务
}

func (tw *TimingWheel) Stop()  {
    select {
    case <-tw.stop:
        log.Println("TimingWheel has stopped")
        return
    default:
        close(tw.stop)
    }
}

// calcSlot 计算 slot --> 任务在 tasks 中的下标，设置 task 的 round（轮数）
func (tw *TimingWheel) calcSlot(task *TimingTask, delay time.Duration) int {
    interval := int(tw.interval.Seconds())  // 秒数
    roundTime := interval * tw.size             // 秒 * size （遍历一轮 tasks 需要的时间）
    delayT := int(math.Ceil(delay.Seconds())) // 大于或等于 delay 秒数的最小整数

    // 如果延时时间 > 遍历一轮 tasks 的时间
    // 则需要设置该 task 的轮数
    // e.g. 延时时间 = 11，遍历一轮的时间 = 5
    // 则 轮数 = 11 / 5 = 2，delay = 1，slot = 1
    // 1 2 3 4 0 1 2 3 4 0 1 2 3 4
    //                     ↑
    if delayT > roundTime {
        task.round = delayT / roundTime
        delayT = delayT % roundTime
        if delayT == 0 {
            task.round --
        }
    }

    return (tw.slot + delayT/interval) % tw.size
}

func (tw *TimingWheel) scheduler()  {
    // 每指定间隔执行的定时器
    ticker := time.NewTicker(tw.interval)
    defer ticker.Stop()
    for {
        select {
        case <-tw.stop:
            log.Println(fmt.Sprintf("TimingWheel stopped. time: %s", time.Now().String()))
            return
        case <-ticker.C:
            tw.slot = (tw.slot + 1) % tw.size
            log.Println(fmt.Sprintf("go tw.run(%d)", tw.slot))
            go tw.run(tw.slot)
        }
    }
}

func (tw *TimingWheel) run(slot int)  {
    taskT := tw.tasks[slot]
    // 遍历
    taskT.Range(func(key, value interface{}) bool {
        taskId := key.(string)
        task := value.(*TimingTask)

        // 轮数倒计时
        if task.round > 0{
            task.round--
            return true
        }

        go func() {
            if err := task.callback(taskId); err != nil {
                log.Println(fmt.Sprintf("TimingWheel task [%s] run error: %+v", taskId, err))
                return
            }
            log.Println(fmt.Sprintf("TimingWheel task [%s] run success", taskId))
            //return
        }()

        taskT.Delete(key)
        return true
    })
}

func TestTimingWheel()  {
    utils.InitDB()
    utils.InitTable()
    var SecondTW *TimingWheel
    SecondTW = NewTimingWheel(time.Second, 10)
    taskId := utils.GenerateId("task", 10)
    mainTime := time.Now()
    fmt.Println("main: ", mainTime)
    delay := 30
    SecondTW.AddTask(taskId, func(taskId string) error {
        //defer SecondTW.Stop()   // 执行任务之后，关闭该时间轮
        task := &models.Task{
            TaskId: taskId,
            MainTime: mainTime,
            Delay: delay,
        }
        if err := utils.DB.Model(models.Task{}).Create(task).Error; err != nil {
            log.Println(fmt.Sprintf("create task error: %+v", err))
            return err
        }
        return  nil
    }, time.Duration(delay)*time.Second)
}
```


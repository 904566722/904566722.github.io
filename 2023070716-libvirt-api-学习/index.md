# libvirt api 学习

<!--more-->
#

{{< admonition warning "about card" false >}}

这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`

{{< /admonition>}}

- [](#)
  - [一、libvirt-example](#一libvirt-example)
    - [1.1 片段解释1](#11-片段解释1)
    - [1.2 `NewConnect` 方法注释](#12-newconnect-方法注释)
  - [二、一些对象了解](#二一些对象了解)
    - [2.1 StoragePool](#21-storagepool)
    - [2.2 NodeDevice](#22-nodedevice)
    - [2.3 Network](#23-network)
    - [2.4 DomainBlockJob](#24-domainblockjob)
    - [2.5 DomainJob](#25-domainjob)
    - [2.6 DomainSnapshot](#26-domainsnapshot)
  - [三、Connect 管理](#三connect-管理)
    - [3.1 Connect 对象](#31-connect-对象)
    - [3.2 Connect 的方法](#32-connect-的方法)
      - [1. func (c \*Connect) StoragePoolEventLifecycleRegister(pool \*StoragePool, callback StoragePoolEventLifecycleCallback) (int, error)](#1-func-c-connect-storagepooleventlifecycleregisterpool-storagepool-callback-storagepooleventlifecyclecallback-int-error)
      - [2. func (c \*Connect) StoragePoolEventRefreshRegister(pool \*StoragePool, callback StoragePoolEventGenericCallback) (int, error)](#2-func-c-connect-storagepooleventrefreshregisterpool-storagepool-callback-storagepooleventgenericcallback-int-error)
      - [3. func (c \*Connect) StoragePoolEventDeregister(callbackId int) error](#3-func-c-connect-storagepooleventderegistercallbackid-int-error)
      - [4. func (c \*Connect) SecretEventLifecycleRegister(secret \*Secret, callback SecretEventLifecycleCallback) (int, error)](#4-func-c-connect-secreteventlifecycleregistersecret-secret-callback-secreteventlifecyclecallback-int-error)
      - [5. func (c \*Connect) SecretEventValueChangedRegister(secret \*Secret, callback SecretEventGenericCallback) (int, error)](#5-func-c-connect-secreteventvaluechangedregistersecret-secret-callback-secreteventgenericcallback-int-error)
      - [6. func (c \*Connect) SecretEventDeregister(callbackId int) error](#6-func-c-connect-secreteventderegistercallbackid-int-error)
      - [7. func (c \*Connect) DomainQemuAttach(pid uint32, flags uint32) (\*Domain, error)](#7-func-c-connect-domainqemuattachpid-uint32-flags-uint32-domain-error)
      - [8. func (c \*Connect) DomainQemuMonitorEventRegister(dom \*Domain, event string, callback DomainQemuMonitorEventCallback, flags DomainQemuMonitorEventFlags) (int, error)](#8-func-c-connect-domainqemumonitoreventregisterdom-domain-event-string-callback-domainqemumonitoreventcallback-flags-domainqemumonitoreventflags-int-error)
      - [9. func (c \*Connect) DomainQemuEventDeregister(callbackId int) error](#9-func-c-connect-domainqemueventderegistercallbackid-int-error)
      - [10. func (c \*Connect) NodeDeviceEventLifecycleRegister(device \*NodeDevice, callback NodeDeviceEventLifecycleCallback) (int, error)](#10-func-c-connect-nodedeviceeventlifecycleregisterdevice-nodedevice-callback-nodedeviceeventlifecyclecallback-int-error)
      - [11. func (c \*Connect) NodeDeviceEventUpdateRegister(device \*NodeDevice, callback NodeDeviceEventGenericCallback) (int, error)](#11-func-c-connect-nodedeviceeventupdateregisterdevice-nodedevice-callback-nodedeviceeventgenericcallback-int-error)
      - [12. func (c \*Connect) NodeDeviceEventDeregister(callbackId int) error](#12-func-c-connect-nodedeviceeventderegistercallbackid-int-error)
      - [13. func (c \*Connect) NetworkEventLifecycleRegister(net \*Network, callback NetworkEventLifecycleCallback) (int, error)](#13-func-c-connect-networkeventlifecycleregisternet-network-callback-networkeventlifecyclecallback-int-error)
      - [14. func (c \*Connect) NetworkEventDeregister(callbackId int) error](#14-func-c-connect-networkeventderegistercallbackid-int-error)
      - [15. func (c \*Connect) DomainEventLifecycleRegister(dom \*Domain, callback DomainEventLifecycleCallback) (int, error)](#15-func-c-connect-domaineventlifecycleregisterdom-domain-callback-domaineventlifecyclecallback-int-error)
      - [16. func (c \*Connect) DomainEventRebootRegister(dom \*Domain, callback DomainEventGenericCallback) (int, error)](#16-func-c-connect-domaineventrebootregisterdom-domain-callback-domaineventgenericcallback-int-error)
      - [17. func (c \*Connect) DomainEventRTCChangeRegister(dom \*Domain, callback DomainEventRTCChangeCallback) (int, error)](#17-func-c-connect-domaineventrtcchangeregisterdom-domain-callback-domaineventrtcchangecallback-int-error)
      - [18. func (c \*Connect) DomainEventWatchdogRegister(dom \*Domain, callback DomainEventWatchdogCallback) (int, error)](#18-func-c-connect-domaineventwatchdogregisterdom-domain-callback-domaineventwatchdogcallback-int-error)
      - [19. func (c \*Connect) DomainEventIOErrorRegister(dom \*Domain, callback DomainEventIOErrorCallback) (int, error)](#19-func-c-connect-domaineventioerrorregisterdom-domain-callback-domaineventioerrorcallback-int-error)
      - [20. func (c \*Connect) DomainEventGraphicsRegister(dom \*Domain, callback DomainEventGraphicsCallback) (int, error)](#20-func-c-connect-domaineventgraphicsregisterdom-domain-callback-domaineventgraphicscallback-int-error)
      - [21. func (c \*Connect) DomainEventIOErrorReasonRegister(dom \*Domain, callback DomainEventIOErrorReasonCallback) (int, error)](#21-func-c-connect-domaineventioerrorreasonregisterdom-domain-callback-domaineventioerrorreasoncallback-int-error)
      - [22. func (c \*Connect) DomainEventControlErrorRegister(dom \*Domain, callback DomainEventGenericCallback) (int, error)](#22-func-c-connect-domaineventcontrolerrorregisterdom-domain-callback-domaineventgenericcallback-int-error)
      - [23. func (c \*Connect) DomainEventBlockJobRegister(dom \*Domain, callback DomainEventBlockJobCallback) (int, error)](#23-func-c-connect-domaineventblockjobregisterdom-domain-callback-domaineventblockjobcallback-int-error)
      - [24. func (c \*Connect) DomainEventDiskChangeRegister(dom \*Domain, callback DomainEventDiskChangeCallback) (int, error)](#24-func-c-connect-domaineventdiskchangeregisterdom-domain-callback-domaineventdiskchangecallback-int-error)
      - [25. func (c \*Connect) DomainEventTrayChangeRegister(dom \*Domain, callback DomainEventTrayChangeCallback) (int, error)](#25-func-c-connect-domaineventtraychangeregisterdom-domain-callback-domaineventtraychangecallback-int-error)
      - [26. func (c \*Connect) DomainEventPMWakeupRegister(dom \*Domain, callback DomainEventPMWakeupCallback) (int, error)](#26-func-c-connect-domaineventpmwakeupregisterdom-domain-callback-domaineventpmwakeupcallback-int-error)
      - [27. func (c \*Connect) DomainEventPMSuspendRegister(dom \*Domain, callback DomainEventPMSuspendCallback) (int, error)](#27-func-c-connect-domaineventpmsuspendregisterdom-domain-callback-domaineventpmsuspendcallback-int-error)
      - [28. func (c \*Connect) DomainEventBalloonChangeRegister(dom \*Domain, callback DomainEventBalloonChangeCallback) (int, error)](#28-func-c-connect-domaineventballoonchangeregisterdom-domain-callback-domaineventballoonchangecallback-int-error)
      - [29. func (c \*Connect) DomainEventPMSuspendDiskRegister(dom \*Domain, callback DomainEventPMSuspendDiskCallback) (int, error)](#29-func-c-connect-domaineventpmsuspenddiskregisterdom-domain-callback-domaineventpmsuspenddiskcallback-int-error)
      - [30. func (c \*Connect) DomainEventDeviceRemovedRegister(dom \*Domain, callback DomainEventDeviceRemovedCallback) (int, error)](#30-func-c-connect-domaineventdeviceremovedregisterdom-domain-callback-domaineventdeviceremovedcallback-int-error)
      - [31. func (c \*Connect) DomainEventBlockJobRegister(dom \*Domain, callback DomainEventBlockJobCallback) (int, error)](#31-func-c-connect-domaineventblockjobregisterdom-domain-callback-domaineventblockjobcallback-int-error)
      - [32. func (c \*Connect) DomainEventDiskChangeRegister(dom \*Domain, callback DomainEventDiskChangeCallback) (int, error)](#32-func-c-connect-domaineventdiskchangeregisterdom-domain-callback-domaineventdiskchangecallback-int-error)
      - [...](#-1)
  - [四、domain 管理](#四domain-管理)
    - [4.1 domain 对象](#41-domain-对象)
    - [4.2 domain 方法](#42-domain-方法)
  - [五、一些常量](#五一些常量)
    - [5.1 虚机状态](#51-虚机状态)
    - [5.2 DomainModificationImpact](#52-domainmodificationimpact)
    - [5.3 DomainRunningReason](#53-domainrunningreason)
    - [5.4 DomainControlState](#54-domaincontrolstate)
    - [5.5 DomainCoreDumpFormat](#55-domaincoredumpformat)
    - [5.6 DomainCoreDumpFlags](#56-domaincoredumpflags)
    - [5.7 DomainMigrateFlags](#57-domainmigrateflags)
  - [六、问题记录](#六问题记录)
    - [6.1 虚拟机快照是如何实现的？](#61-虚拟机快照是如何实现的)
  - [参考文档](#参考文档)


> libvirt version: libvirt.org/libvirt-go v7.4.0+incompatible

## 一、libvirt-example 

[libvirt package - github.com/libvirt/libvirt-go - Go Packages](https://pkg.go.dev/github.com/libvirt/libvirt-go#hdr-Example_usage)

### 1.1 片段解释1

```go
conn, err := libvirt.NewConnect("qemu:///system")
```

这条命令使用 libvirt Go API 创建一个与本地系统上的 QEMU 守护进程建立连接的连接对象。

解释如下：
- `libvirt`：这是 libvirt Go API 的包名。
- `NewConnect`：这是 libvirt Go API 中的一个函数，用于创建与 libvirt 守护进程的连接对象。
- `"qemu:///system"`：这是连接 URI，指定了连接的类型和目标。在这里，URI `qemu:///system` 表示连接到本地系统上的 QEMU 守护进程。`qemu` 表示使用 QEMU 驱动程序，`/system` 表示连接到系统级别的 libvirt 守护进程。

这条命令的作用是创建一个连接对象 `conn`，该连接对象可用于执行与虚拟化环境相关的操作，如创建和管理虚拟机、存储池、网络等。连接对象的创建过程中，如果发生错误，将会返回一个非空的 `err` 错误对象，否则 `err` 的值为 `nil`，表示连接成功建立。

在创建连接对象后，你可以使用返回的连接对象 `conn` 来执行其他操作，例如打开虚拟机、获取主机信息、创建虚拟网络等。

### 1.2 `NewConnect` 方法注释

这个函数应该首先被调用，以获得与Hypervisor和xen存储的连接

如果name为NULL，如果LIBVIRT_DEFAULT_URI环境变量被设置，那么它将被使用。否则，如果客户端配置文件中设置了 "uri_default "参数，那么它将被使用。最后将进行探测，以确定一个合适的默认驱动程序来激活。这包括依次尝试每个管理程序，直到有一个成功打开。

如果连接到一个非特权的hypervisor驱动，需要libvirtd守护程序处于激活状态，如果尚未运行，它将自动启动。这可以通过设置环境变量LIBVIRT_AUTOSTART=0来防止。

URIs的文档在https://libvirt.org/uri.html

virConnectClose应该被用来在不再需要连接后释放资源。

名称
(可选)管理程序的URI
返回
指向管理程序连接的指针，如果出错则为NULL。

## 二、一些对象了解

### 2.1 StoragePool

在 libvirt 中，`StoragePool` 是用于管理和操作存储资源的对象。`StoragePool` 表示一个存储池，它可以是物理存储设备（如硬盘、SSD）或网络存储（如 NFS、iSCSI）等。

存储池是一种逻辑概念，它提供了存储资源的抽象和管理。通过存储池，你可以创建、管理和操作存储卷（`StorageVolume`）。存储卷是存储池中的一块具体的存储空间，可以用于存储虚拟机的磁盘镜像、快照、配置文件等。

存储池可以包含一个或多个存储卷，并提供一套接口和方法来管理这些卷。它可以提供数据保护、数据共享、快照管理、性能优化等功能，以满足虚拟化环境中的存储需求。

在 libvirt 中，你可以使用存储池相关的 API 来执行各种操作，如创建存储池、删除存储池、添加存储卷、删除存储卷、获取存储池信息等。通过 `StoragePool` 对象，你可以访问和管理存储资源，以满足虚拟化环境中虚拟机的存储需求。

![图 0](images/posts/20230710-100736071.png)  

### 2.2 NodeDevice

在 libvirt 中，`NodeDevice` 表示一个节点设备，它代表主机上的物理设备或资源。节点设备是主机级别的设备，与特定的域（虚拟机）无关。

节点设备可以是主机上的物理设备（如网络接口卡、磁盘驱动器、USB 设备等），也可以是主机上的虚拟设备（如虚拟网桥、虚拟网络设备等）。节点设备提供了对主机上设备的管理和控制的接口。

通过 `NodeDevice` 对象，你可以执行以下操作：
- 获取设备信息：你可以获取节点设备的名称、类型、驱动程序、能力等信息。
- 启用或禁用设备：你可以启用或禁用特定的节点设备。
- 重置设备：你可以重置设备的状态，使其返回到默认状态。
- 重新扫描设备：你可以触发重新扫描节点设备，以便检测新添加或移除的设备。
- 删除设备：在某些情况下，你可以删除节点设备，使其不再可用。

使用 libvirt 中的相关 API，你可以通过 `Connect` 对象获取节点设备，对其进行管理和操作。你可以获取节点设备列表、查找特定的节点设备，然后使用 `NodeDevice` 对象执行相关的操作。

需要注意的是，对节点设备的操作通常需要足够的权限，因此在执行节点设备相关操作时，确保你具有适当的权限。

### 2.3 Network

在 libvirt 中，`Network` 表示一个网络对象，它用于管理和控制虚拟化环境中的网络资源。`Network` 对象提供了对网络的配置、管理和操作的接口。

通过 `Network` 对象，你可以执行以下操作：
- 创建和定义网络：你可以使用 `virNetworkDefineXML` 方法通过 XML 描述创建并定义一个网络。
- 启动和停止网络：你可以使用 `virNetworkCreate` 方法启动网络，使其可用于虚拟机的通信。同样，你可以使用 `virNetworkDestroy` 方法停止网络。
- 管理网络的生命周期：你可以使用 `virNetworkFree` 方法释放网络资源，同时也可以使用 `virNetworkIsActive` 方法检查网络是否处于活动状态。
- 获取和修改网络的属性：你可以使用 `virNetworkGetXMLDesc` 方法获取网络的 XML 描述，以了解网络的配置信息。同时，你也可以使用 `virNetworkUpdate` 方法修改网络的属性，如名称、桥接接口、DHCP 设置等。
- 查找和列举网络：你可以使用 `virNetworkLookupByName`、`virNetworkLookupByUUID` 等方法根据名称或 UUID 查找特定的网络对象。还可以使用 `virConnectListNetworks`、`virConnectListAllNetworks` 等方法列举所有可用的网络。

通过使用 libvirt 中的相关 API，你可以创建、管理和操作网络对象，以满足虚拟化环境中的网络需求。你可以配置网络属性、启动和停止网络、获取网络的状态和信息等。网络对象提供了对虚拟化环境中网络资源的抽象和管理能力，使得你可以灵活地管理和控制网络。

### 2.4 DomainBlockJob

`DomainBlockJob`是用于表示域（虚拟机）上的块设备任务的结构体。它用于描述正在进行或已完成的块设备操作，例如拷贝、快照、复制等。

`DomainBlockJob`结构体包含以下字段：

- `Type`：块设备任务的类型，如拷贝、快照、复制等。
- `Bandwidth`：块设备任务的带宽限制，表示任务在执行时的数据传输速度。
- `Cur`：当前任务的进度，表示已完成的任务量。
- `End`：任务的总量，表示任务的总大小或总数量。
- `ElapsedTime`：任务已经运行的时间，表示任务执行的时间长度。
- `RemainingTime`：任务估计的剩余时间，表示任务预计还需要多长时间才能完成。
- `DataTransferred`：已传输的数据量，表示任务已经传输的数据大小。
- `DataTotal`：数据的总量，表示任务的总数据大小。

通过使用`DomainBlockJob`结构体，可以获取有关正在进行的块设备任务的信息，如任务类型、进度、剩余时间等。这对于监控和管理虚拟机中的块设备操作非常有用。

### 2.5 DomainJob

在libvirt中，DomainJob表示虚拟机（domain）上正在执行的任务（job）。任务可以是虚拟机的各种操作，例如创建、启动、暂停、恢复、迁移等。

DomainJob是一个数据结构，用于描述虚拟机任务的状态和属性。它包含了任务的ID、类型、状态、进度等信息。通过查询DomainJob，可以获取有关虚拟机任务的实时信息，以便进行监视、控制和管理。

下面是一些DomainJob相关的常用属性：

- Job ID（id）：任务的唯一标识符，用于区分不同的任务。
- 类型（type）：任务的类型，指示正在执行的操作，例如创建、启动、迁移等。
- 状态（status）：任务的当前状态，可以是运行中、暂停、完成、失败等。
- 进度（progress）：任务的执行进度，表示任务完成的百分比。
- 错误（error）：如果任务失败，可以提供与错误相关的详细信息。

使用DomainJob，可以实现对虚拟机任务的监控和管理。管理员可以查询任务状态，了解任务的执行情况，例如是否正在进行、已完成或失败。还可以跟踪任务的进度，以便根据需要进行相应的操作或采取适当的措施。

总而言之，DomainJob提供了一种管理和监视虚拟机任务的机制，使管理员能够更好地了解和控制虚拟机操作的执行过程。

### 2.6 DomainSnapshot

`libvirt.DomainSnapshot`是libvirt库中用于表示虚拟机快照的数据结构。它包含了与快照相关的信息和操作。

`libvirt.DomainSnapshot`结构体的主要成员变量包括：

- `name`：快照的名称。
- `domain`：所属的虚拟机对象。
- `xmlDesc`：快照的XML描述，包括快照的配置信息。
- `creationTime`：快照的创建时间。
- `state`：快照的状态，如活动状态、磁盘状态等。
- `parent`：父快照对象，表示该快照的上一级快照。
- `children`：子快照对象列表，表示该快照的下一级快照。

`libvirt.DomainSnapshot`结构体提供了一系列方法来管理和操作虚拟机快照，包括：

- `CreateXML`：根据XML描述创建一个新的快照。
- `RevertTo`：恢复虚拟机到指定的快照状态。
- `Delete`：删除当前快照。
- `GetXMLDesc`：获取当前快照的XML描述信息。
- `GetName`：获取当前快照的名称。
- `GetParent`：获取当前快照的父快照对象。
- `GetChildren`：获取当前快照的子快照对象列表。
- `GetDomain`：获取当前快照所属的虚拟机对象。

通过使用`libvirt.DomainSnapshot`结构体和相关方法，开发者可以方便地管理和操作虚拟机的快照，实现快照的创建、恢复、删除以及查询等功能。

## 三、[Connect](https://pkg.go.dev/github.com/libvirt/libvirt-go#Connect) 管理

### 3.1 Connect 对象

### 3.2 Connect 的方法

#### 1. func (c *Connect) StoragePoolEventLifecycleRegister(pool *StoragePool, callback StoragePoolEventLifecycleCallback) (int, error)

在 libvirt 中，`StoragePoolEventLifecycleRegister` 方法用于注册存储池生命周期事件的回调函数。通过该方法，你可以指定一个回调函数，以便在存储池的生命周期事件发生时得到通知和处理相关操作。

具体而言，`StoragePoolEventLifecycleRegister` 方法允许你注册一个回调函数，该函数将在以下事件发生时被触发：

- 存储池被创建（Created）。
- 存储池被删除（Deleted）。
- 存储池被启动（Started）。
- 存储池被停止（Stopped）。
- 存储池被重置（Reset）。

你可以提供一个回调函数来处理这些事件。回调函数的签名应该符合 `virConnectStoragePoolEventLifecycleCallback` 类型的定义，该定义通常是一个带有 `virConnect`、`virStoragePool` 和 `event` 参数的函数。当存储池的生命周期事件匹配注册的事件时，libvirt 会调用注册的回调函数并传递相应的参数。

通过使用 `StoragePoolEventLifecycleRegister` 方法，你可以编写逻辑来监听和处理存储池的生命周期事件，例如在存储池被创建时执行特定操作，或者在存储池被删除时进行清理操作。这使得你可以根据需要动态地响应存储池的变化，并在适当的时候执行相应的处理逻辑。

请注意，注册存储池生命周期事件的回调函数时，确保在适当的时候使用 `StoragePoolEventLifecycleDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 2. func (c *Connect) StoragePoolEventRefreshRegister(pool *StoragePool, callback StoragePoolEventGenericCallback) (int, error)

在 libvirt 中，`StoragePoolEventRefreshRegister` 方法用于注册存储池刷新事件的回调函数。通过该方法，你可以指定一个回调函数，以便在存储池刷新事件发生时得到通知并处理相关操作。

具体而言，`StoragePoolEventRefreshRegister` 方法允许你注册一个回调函数，该函数将在存储池刷新事件发生时被触发。存储池刷新事件表示存储池的配置或状态发生了变化，例如存储池的容量、属性或其他相关信息发生了更新。

你可以提供一个回调函数来处理存储池刷新事件。回调函数的签名应该符合 `virConnectStoragePoolEventGenericCallback` 类型的定义，通常是一个带有 `virConnect`、`virStoragePool` 和 `opaque` 参数的函数。当存储池刷新事件匹配注册的事件时，libvirt 将调用注册的回调函数并传递相应的参数。

通过使用 `StoragePoolEventRefreshRegister` 方法，你可以编写逻辑来监听和处理存储池刷新事件，例如在存储池的配置或状态发生变化时更新相关信息、重新加载存储池等。这使得你可以根据需要动态地响应存储池的变化，并在适当的时候执行相应的处理逻辑。

需要注意的是，在注册存储池刷新事件的回调函数时，确保在适当的时候使用 `StoragePoolEventRefreshDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 3. func (c *Connect) StoragePoolEventDeregister(callbackId int) error

在 libvirt 中，`StoragePoolEventDeregister` 方法用于取消注册存储池事件的回调函数。通过该方法，你可以取消之前注册的存储池事件的回调函数，以停止接收相关事件的通知。

具体而言，`StoragePoolEventDeregister` 方法用于取消之前使用 `StoragePoolEventLifecycleRegister` 或 `StoragePoolEventRefreshRegister` 方法注册的回调函数。你需要提供之前注册的回调函数作为参数来进行取消注册。

取消注册存储池事件的回调函数可以帮助你管理资源和避免不必要的回调触发。当你不再需要接收存储池事件通知时，通过调用 `StoragePoolEventDeregister` 方法，可以确保相关的回调函数不再被调用，并释放相关的资源。

使用 `StoragePoolEventDeregister` 方法时，需要确保提供与之前注册的回调函数完全匹配的函数指针或闭包。这样 libvirt 才能准确地找到要取消注册的回调函数，并将其从事件通知列表中删除。

总结起来，`StoragePoolEventDeregister` 方法的作用是取消注册之前注册的存储池事件的回调函数，以停止接收相关事件的通知，并释放相关资源。

#### 4. func (c *Connect) SecretEventLifecycleRegister(secret *Secret, callback SecretEventLifecycleCallback) (int, error)

在 libvirt 中，`SecretEventLifecycleRegister` 方法用于注册密钥（Secret）生命周期事件的回调函数。通过该方法，你可以指定一个回调函数，以便在密钥的生命周期事件发生时得到通知并处理相关操作。

具体而言，`SecretEventLifecycleRegister` 方法允许你注册一个回调函数，该函数将在以下事件发生时被触发：

- 密钥被创建（Created）。
- 密钥被删除（Deleted）。

你可以提供一个回调函数来处理这些事件。回调函数的签名应该符合 `virConnectSecretEventLifecycleCallback` 类型的定义，该定义通常是一个带有 `virConnect`、`virSecret` 和 `event` 参数的函数。当密钥的生命周期事件匹配注册的事件时，libvirt 会调用注册的回调函数并传递相应的参数。

通过使用 `SecretEventLifecycleRegister` 方法，你可以编写逻辑来监听和处理密钥的生命周期事件，例如在密钥被创建时执行特定操作，或者在密钥被删除时进行清理操作。这使得你可以根据需要动态地响应密钥的变化，并在适当的时候执行相应的处理逻辑。

请注意，在注册密钥生命周期事件的回调函数时，确保在适当的时候使用 `SecretEventLifecycleDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。


>  libvirt 的密钥（secret）是指什么？
> 
> 在 libvirt 中，密钥（Secret）是一种用于存储敏感数据的对象。它可以用于存储虚拟机或虚拟化环境中其他组件所需的敏感信息，如密码、证书、密钥等。
>
> 密钥在 libvirt 中是以二进制数据的形式存储的，它们与域（虚拟机）、存储池等资源是分开管理的。密钥的存在使得 libvirt 可以将敏感数据与其他资源进行分离，从而更好地管理和保护这些数据。
> 
> 使用密钥对象，你可以执行以下操作：
>
> - 创建密钥：你可以创建一个密钥对象，并将其与敏感数据关联起来。
> - 设置密钥：你可以设置或更新密钥的值，以便存储新的敏感数据。
> - 删除密钥：当你不再需要某个密钥时，可以删除该密钥对象。
> 
> 密钥通常用于存储虚拟机或虚拟化环境中的敏感信息，例如加密密钥、API 密钥、存储认证信息等。它们提供了一种安全的方式来管理和保护这些敏感数据，以避免直接将其暴露在配置文件或代码中。
> 
> 需要注意的是，密钥的具体使用方式和实现可能因不同的虚拟化平台和配置而异。在 libvirt 中，你可以使用相关的 API 来管理密钥对象，如创建、设置值、删除等操作。

#### 5. func (c *Connect) SecretEventValueChangedRegister(secret *Secret, callback SecretEventGenericCallback) (int, error)

libvirt API 中并没有直接提供密钥值（Secret Value）变更事件的特定注册方法。密钥（Secret）对象的值一旦设置，通常不会通过事件的方式进行变更通知。相反，你可以通过调用 `virSecretSetValue` 方法来直接更新密钥的值，并使用 `virSecretGet*` 方法来获取最新的值。

如果你希望在密钥值发生变化时进行相应的处理操作，你可以在你的应用程序中手动进行监控和检测。例如，你可以定期轮询检查密钥的值，比较当前值与之前的值是否有变化，并根据需要执行相关的操作。这样你可以自定义逻辑来处理密钥值的变化。

需要注意的是，密钥的值是敏感信息，因此在存储和处理密钥值时应该采取适当的安全措施，如加密传输和存储、访问权限控制等，以确保敏感信息的保密性和完整性。

#### 6. func (c *Connect) SecretEventDeregister(callbackId int) error

#### 7. func (c *Connect) DomainQemuAttach(pid uint32, flags uint32) (*Domain, error)

根据 libvirt Go API 中的 `DomainQemuAttach` 方法的定义，它是 `Connect` 结构体的一个方法。以下是该方法的作用和方法说明：

作用：
`DomainQemuAttach` 方法用于在与 libvirt 守护进程建立的连接中，通过指定 QEMU 进程的 PID（进程ID），将运行中的域（虚拟机）与该 QEMU 进程进行关联。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `pid uint32`：要关联的 QEMU 进程的 PID（进程ID）。
  - `flags uint32`：可选的附加标志，用于控制附加操作的行为。

- 返回值：
  - `*Domain`：关联成功的域（虚拟机）对象。
  - `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法的使用场景是，在某些情况下，你可能需要将正在运行的域与其对应的 QEMU 进程进行关联。例如，当你使用外部工具（例如 `qemu-monitor-command`）与 QEMU 进程进行交互时，可以通过 `DomainQemuAttach` 方法获取域对象，并与特定的 QEMU 进程进行通信和操作。

需要注意的是，使用该方法需要确保你具有适当的权限来执行关联操作，并且传递的 PID 参数必须是一个有效的 QEMU 进程的 PID。否则，方法可能会返回错误或不会关联任何域对象。

example:

将运行中的域（虚拟机）与特定的 QEMU 进程进行关联的作用是建立一个连接，使你可以通过该 QEMU 进程与虚拟机进行交互和操作。这样，你可以使用 QEMU 的监视器命令或其他与 QEMU 通信的方式来控制虚拟机的行为、获取虚拟机的状态信息、执行特定的操作等。

举个简单的例子，假设你有一个运行中的虚拟机，你想要通过 QEMU 的监视器命令与虚拟机进行交互，例如发送一个命令给虚拟机，获取虚拟机的信息或执行某些特定的操作。在这种情况下，你可以使用 `DomainQemuAttach` 方法将运行中的域与对应的 QEMU 进程进行关联，然后使用相关的工具或方法与 QEMU 进程进行通信。

以下是一个简单的示例，展示如何使用 `DomainQemuAttach` 方法关联域和 QEMU 进程，并发送一个命令给虚拟机：

```go
import (
    "github.com/libvirt/libvirt-go"
)

func main() {
    // 连接到 libvirt 守护进程
    conn, err := libvirt.NewConnect("qemu:///system")
    if err != nil {
        // 处理连接错误
        return
    }

    // 获取运行中的域对象
    domain, err := conn.LookupDomainByName("mydomain")
    if err != nil {
        // 处理域查找错误
        return
    }

    // 获取 QEMU 进程的 PID
    pid, err := domain.GetQEMUPID()
    if err != nil {
        // 处理获取 PID 错误
        return
    }

    // 关联域和 QEMU 进程
    _, err = conn.DomainQemuAttach(pid, 0)
    if err != nil {
        // 处理关联错误
        return
    }

    // 使用 QEMU 监视器命令与虚拟机交互
    // 发送命令给虚拟机
    result, err := conn.DomainQemuMonitorCommand("mydomain", "info name")
    if err != nil {
        // 处理命令执行错误
        return
    }

    // 处理命令结果
    println(result)

    // 关闭连接
    conn.Close()
}
```

通过以上示例，我们使用 `DomainQemuAttach` 方法将运行中的域与其对应的 QEMU 进程关联起来。然后，我们使用 `DomainQemuMonitorCommand` 方法发送一个命令给虚拟机，获取虚拟机的名称信息，并将结果打印出来。这样，我们就能够通过 QEMU 进程与虚拟机进行交互和执行操作。

#### 8. func (c *Connect) DomainQemuMonitorEventRegister(dom *Domain, event string, callback DomainQemuMonitorEventCallback, flags DomainQemuMonitorEventFlags) (int, error)

根据 libvirt Go API 中的 `DomainQemuMonitorEventRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`DomainQemuMonitorEventRegister` 方法用于注册在 QEMU 监视器事件发生时触发的回调函数。通过该方法，你可以指定一个回调函数，在特定的 QEMU 监视器事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域（虚拟机）对象。
  - `event string`：要注册的 QEMU 监视器事件的名称。
  - `callback DomainQemuMonitorEventCallback`：回调函数，用于处理事件发生时的操作。
  - `flags DomainQemuMonitorEventFlags`：可选的附加标志，用于控制事件注册的行为。

- 返回值：
  - `int`：事件句柄（event handle），用于标识已注册的事件。
  - `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理特定的 QEMU 监视器事件。你需要提供要注册事件的域对象、要注册的事件名称以及相应的回调函数。回调函数的签名应符合 `DomainQemuMonitorEventCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain` 和 `event *DomainEvent` 等参数。当指定的 QEMU 监视器事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainQemuMonitorEventRegister` 方法，你可以编写逻辑来监听和处理特定的 QEMU 监视器事件，例如虚拟机启动、关闭、暂停、继续等事件。你可以根据需要在回调函数中执行自定义的操作，如记录日志、发送通知、触发其他操作等。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainQemuMonitorEventDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 9. func (c *Connect) DomainQemuEventDeregister(callbackId int) error

#### 10. func (c *Connect) NodeDeviceEventLifecycleRegister(device *NodeDevice, callback NodeDeviceEventLifecycleCallback) (int, error)

根据 libvirt Go API 中的 `NodeDeviceEventLifecycleRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`NodeDeviceEventLifecycleRegister` 方法用于注册节点设备（Node Device）生命周期事件的回调函数。通过该方法，你可以指定一个回调函数，在节点设备的生命周期事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `device *NodeDevice`：要注册事件的节点设备对象。
  - `callback NodeDeviceEventLifecycleCallback`：回调函数，用于处理事件发生时的操作。

- 返回值：
  - `int`：事件句柄（event handle），用于标识已注册的事件。
  - `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理节点设备的生命周期事件。你需要提供要注册事件的节点设备对象以及相应的回调函数。回调函数的签名应符合 `NodeDeviceEventLifecycleCallback` 类型的定义，通常包括 `conn *Connect`、`device *NodeDevice` 和 `event *NodeDeviceEvent` 等参数。当指定的节点设备的生命周期事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `NodeDeviceEventLifecycleRegister` 方法，你可以编写逻辑来监听和处理节点设备的生命周期事件，例如节点设备的添加、移除等事件。你可以根据需要在回调函数中执行自定义的操作，如记录日志、发送通知、触发其他操作等。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `NodeDeviceEventLifecycleDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 11. func (c *Connect) NodeDeviceEventUpdateRegister(device *NodeDevice, callback NodeDeviceEventGenericCallback) (int, error)

#### 12. func (c *Connect) NodeDeviceEventDeregister(callbackId int) error

#### 13. func (c *Connect) NetworkEventLifecycleRegister(net *Network, callback NetworkEventLifecycleCallback) (int, error)

#### 14. func (c *Connect) NetworkEventDeregister(callbackId int) error

#### 15. func (c *Connect) DomainEventLifecycleRegister(dom *Domain, callback DomainEventLifecycleCallback) (int, error)

根据 libvirt Go API 中的 `DomainEventLifecycleRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`DomainEventLifecycleRegister` 方法用于注册域（虚拟机）生命周期事件的回调函数。通过该方法，你可以指定一个回调函数，在域的生命周期事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventLifecycleCallback`：回调函数，用于处理事件发生时的操作。

- 返回值：
  - `int`：事件句柄（event handle），用于标识已注册的事件。
  - `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的生命周期事件。你需要提供要注册事件的域对象以及相应的回调函数。回调函数的签名应符合 `DomainEventLifecycleCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain` 和 `event *DomainEvent` 等参数。当指定的域的生命周期事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventLifecycleRegister` 方法，你可以编写逻辑来监听和处理域的生命周期事件，例如域的创建、销毁、暂停、继续等事件。你可以根据需要在回调函数中执行自定义的操作，如记录日志、发送通知、触发其他操作等。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventLifecycleDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 16. func (c *Connect) DomainEventRebootRegister(dom *Domain, callback DomainEventGenericCallback) (int, error)

#### 17. func (c *Connect) DomainEventRTCChangeRegister(dom *Domain, callback DomainEventRTCChangeCallback) (int, error)

根据 libvirt Go API 中的 `DomainEventRTCChangeRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`DomainEventRTCChangeRegister` 方法用于注册域（虚拟机）RTC（Real-Time Clock）变更事件的回调函数。通过该方法，你可以指定一个回调函数，在域的RTC时间发生变更时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventRTCChangeCallback`：回调函数，用于处理事件发生时的操作。

- 返回值：
  - `int`：事件句柄（event handle），用于标识已注册的事件。
  - `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的RTC变更事件。RTC是虚拟机中的实时时钟，当虚拟机的RTC时间发生变更时（如时钟调整、时钟漂移等），libvirt将调用注册的回调函数，并传递相应的参数。

回调函数的签名应符合 `DomainEventRTCChangeCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain` 和 `event *DomainEventRTCChange` 等参数。当指定的域的RTC时间发生变更时，libvirt将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventRTCChangeRegister` 方法，你可以编写逻辑来监听和处理域的RTC变更事件。例如，你可以在RTC时间发生变更时，更新相应的计时器、同步其他相关操作等。你可以根据需要在回调函数中执行自定义的操作，如记录日志、发送通知、触发其他操作等。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventRTCChangeDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。


> 虚拟机的 RTC（Real-Time Clock）是什么？
> 1. 有什么作用？
> 2. 什么时候虚拟机的 RTC 会发生变化？一般是怎么导致的？
> 3. 虚机暂停、虚机挂起会导致虚机RTC跟主机的时钟不同步吗？
> 
> 虚拟机的 RTC（Real-Time Clock）是虚拟化环境中的实时时钟。它是虚拟机内部的一个时钟设备，用于提供当前时间和日期信息，类似于物理计算机中的实时时钟。
> 
> 以下是关于虚拟机的 RTC 的一些解释：
> 
> 1. 作用：
>    - 提供时间和日期信息：虚拟机的 RTC 用于记录当前的时间和日期，为虚拟机内部的操作系统和应用程序提供正确的时间信息。
>    - 系统计时和时间同步：虚拟机的 RTC 在操作系统中用于执行定时任务、记录时间戳等功能。此外，它还参与虚拟机与宿主机之间的时间同步，帮助虚拟机与宿主机保持时间的一致性。
> 
> 2. RTC 变化时机和原因：
>    - 启动和关机：虚拟机的 RTC 在虚拟机启动时被初始化为宿主机的当前时间。当虚拟机启动时，RTC 的时间会从宿主机传递给虚拟机。
>    - 时钟调整：RTC 的时间可能会在虚拟机运行期间发生调整。例如，当虚拟机的时钟发生偏差时，虚拟化平台可能会进行时钟调整，使虚拟机的时间与宿主机的时间保持同步。
>    - 时钟漂移：由于虚拟化环境的特性，虚拟机的 RTC 时间可能会与宿主机的时间发生微小的偏差，即时钟漂移。这可能是由于虚拟机的工作负载、宿主机的负载情况、虚拟化平台的调整策略等因素导致的。
> 
> 需要注意的是，RTC 的变化可能会对虚拟机内部的操作系统和应用程序产生影响。虚拟机中的操作系统和应用程序通常会依赖正确的时间信息进行计时、日志记录、调度等任务。因此，保持虚拟机的 RTC 时间准确和同步是很重要的，以确保虚拟机内部的时间相关操作能够正确执行。
> 
> 在一些虚拟化平台中，当虚拟机被暂停（suspended）或挂起（hibernated）时，虚拟机的 RTC 时间会被冻结，不会随着时间的流逝而更新。这意味着虚拟机的 RTC 时间将保持在挂起或暂停时的时间点，而不会与主机的时钟同步。
> 
> 当虚拟机恢复运行（resume）时，虚拟机的 RTC 时间将会继续更新，与当前的主机时钟同步。虚拟机的 RTC 时间会从恢复点开始，按照实际时间的流逝进行更新，以与主机保持一致。
> 
> 因此，暂停或挂起虚拟机可能导致虚拟机的 RTC 时间与主机的时钟不同步，特别是在暂停或挂起期间有较长的时间间隔的情况下。这可能会对虚拟机内部的时间相关操作产生一定影响，例如日志记录、计时器的行为等。
> 
> 在恢复虚拟机后，虚拟化平台通常会尝试调整虚拟机的时间，使其与主机的时钟尽可能保持同步。然而，由于虚拟机恢复的时间可能会有一定的延迟，因此在恢复后一段时间内，虚拟机的 RTC 时间可能与主机的时钟存在微小的偏差，即时钟漂移。这是虚拟化环境中常见的现象，可以通过合适的时钟同步机制来处理。
> 
> 综上所述，虚拟机的暂停和挂起可能会导致虚拟机的 RTC 时间与主机的时钟不同步，但虚拟化平台通常会在恢复后尝试进行时间调整，以使其与主机的时钟保持一致。

#### 18. func (c *Connect) DomainEventWatchdogRegister(dom *Domain, callback DomainEventWatchdogCallback) (int, error)

根据 libvirt Go API 中的 `DomainEventWatchdogRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`DomainEventWatchdogRegister` 方法用于注册域（虚拟机）看门狗事件的回调函数。通过该方法，你可以指定一个回调函数，在域的看门狗事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventWatchdogCallback`：回调函数，用于处理事件发生时的操作。

- 返回值：
  - `int`：事件句柄（event handle），用于标识已注册的事件。
  - `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的看门狗事件。看门狗（Watchdog）是一种用于监控和控制系统操作的硬件或软件机制。在虚拟化环境中，域的看门狗通常用于监视虚拟机的运行状态，以确保虚拟机正常运行并在必要时采取适当的措施。

回调函数的签名应符合 `DomainEventWatchdogCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain` 和 `event *DomainEventWatchdog` 等参数。当指定的域的看门狗事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventWatchdogRegister` 方法，你可以编写逻辑来监听和处理域的看门狗事件。例如，你可以在看门狗触发时执行特定的操作，如发送通知、重启虚拟机、记录日志等。你可以根据需要在回调函数中执行自定义的操作，以响应域的看门狗事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventWatchdogDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 19. func (c *Connect) DomainEventIOErrorRegister(dom *Domain, callback DomainEventIOErrorCallback) (int, error)

根据 libvirt Go API 中的 `DomainEventIOErrorRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`DomainEventIOErrorRegister` 方法用于注册域（虚拟机）I/O 错误事件的回调函数。通过该方法，你可以指定一个回调函数，在域的 I/O 错误事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventIOErrorCallback`：回调函数，用于处理事件发生时的操作。

- 返回值：
  - `int`：事件句柄（event handle），用于标识已注册的事件。
  - `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的 I/O 错误事件。I/O 错误事件指的是与域的输入输出操作相关的错误，例如磁盘读写错误、网络通信错误等。

回调函数的签名应符合 `DomainEventIOErrorCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain` 和 `event *DomainEventIOError` 等参数。当指定的域的 I/O 错误事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventIOErrorRegister` 方法，你可以编写逻辑来监听和处理域的 I/O 错误事件。例如，你可以在检测到磁盘读写错误时执行特定的操作，如记录日志、发送通知、尝试恢复等。你可以根据需要在回调函数中执行自定义的操作，以响应域的 I/O 错误事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventIOErrorDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

> 什么时候会发生 io 错误事件？
> 
> I/O 错误事件可能发生在域（虚拟机）的输入/输出操作中遇到问题或错误的情况下。以下是一些可能导致 I/O 错误事件发生的情况：
> 
> 1. 磁盘读写错误：当域的磁盘设备（虚拟磁盘镜像）发生读取或写入错误时，会触发 I/O 错误事件。例如，读取文件失败、写入数据时发生错误、磁盘损坏等。
> 
> 2. 网络通信错误：当域的网络设备（虚拟网络接口）在进行网络通信时遇到问题，可能会导致 I/O 错误事件。例如，网络连接中断、网络传输错误、通信超时等。
> 
> 3. 输入/输出设备错误：如果域使用了其他的输入/输出设备（如串口、USB 设备等），当这些设备发生故障或出现问题时，也可能会触发 I/O 错误事件。
> 
> 4. 存储设备错误：虚拟机的存储设备（如磁盘驱动器）在读取或写入数据时出现错误，可能会导致 I/O 错误事件。这可能是由于存储设备故障、数据传输问题、存储介质损坏等原因引起的。
> 
> 总的来说，I/O 错误事件可能在虚拟机进行输入/输出操作时遇到问题时发生。这些问题可能涉及磁盘、网络、输入/输出设备以及存储设备等方面。当发生 I/O 错误事件时，libvirt 可以通过相应的事件回调通知你，以便你可以采取适当的措施来处理错误，如记录日志、发送通知、尝试修复或恢复等。
>

#### 20. func (c *Connect) DomainEventGraphicsRegister(dom *Domain, callback DomainEventGraphicsCallback) (int, error)

根据 libvirt Go API 中的 `DomainEventGraphicsRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`DomainEventGraphicsRegister` 方法用于注册域（虚拟机）图形事件的回调函数。通过该方法，你可以指定一个回调函数，在域的图形事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventGraphicsCallback`：回调函数，用于处理事件发生时的操作。

- 返回值：
  - `int`：事件句柄（event handle），用于标识已注册的事件。
  - `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的图形事件。图形事件指的是与域的图形显示和交互相关的事件，例如图形窗口的创建、销毁、调整大小、输入事件等。

回调函数的签名应符合 `DomainEventGraphicsCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain` 和 `event *DomainEventGraphics` 等参数。当指定的域的图形事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventGraphicsRegister` 方法，你可以编写逻辑来监听和处理域的图形事件。例如，你可以在图形窗口的创建或销毁时执行特定的操作，如记录日志、发送通知、控制图形显示等。你可以根据需要在回调函数中执行自定义的操作，以响应域的图形事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventGraphicsDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 21. func (c *Connect) DomainEventIOErrorReasonRegister(dom *Domain, callback DomainEventIOErrorReasonCallback) (int, error)

根据 libvirt Go API 中的 `DomainEventIOErrorReasonRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`DomainEventIOErrorReasonRegister` 方法用于注册域（虚拟机）I/O 错误原因事件的回调函数。通过该方法，你可以指定一个回调函数，在域的 I/O 错误原因事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventIOErrorReasonCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的 I/O 错误原因事件。I/O 错误原因事件指的是与域的输入输出操作相关的错误的具体原因，例如磁盘读写错误、网络通信错误等。

回调函数的签名应符合 `DomainEventIOErrorReasonCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventIOErrorReason` 等参数。当指定的域的 I/O 错误原因事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventIOErrorReasonRegister` 方法，你可以编写逻辑来监听和处理域的 I/O 错误原因事件。例如，你可以在检测到磁盘读写错误的具体原因时执行特定的操作，如记录日志、发送通知、尝试恢复等。你可以根据需要在回调函数中执行自定义的操作，以响应域的 I/O 错误原因事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventIOErrorReasonDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 22. func (c *Connect) DomainEventControlErrorRegister(dom *Domain, callback DomainEventGenericCallback) (int, error)

根据 libvirt Go API 中的 `DomainEventControlErrorRegister` 方法的定义，以下是该方法的作用和方法说明：

作用：
`DomainEventControlErrorRegister` 方法用于注册域（虚拟机）控制错误事件的回调函数。通过该方法，你可以指定一个回调函数，在域的控制错误事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventGenericCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的控制错误事件。控制错误事件指的是与域的控制操作相关的错误，例如无法发送控制命令、控制命令超时等。

回调函数的签名应符合 `DomainEventGenericCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain` 和 `event *DomainEventControlError` 等参数。当指定的域的控制错误事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventControlErrorRegister` 方法，你可以编写逻辑来监听和处理域的控制错误事件。例如，你可以在控制命令发送失败或超时时执行特定的操作，如记录日志、发送通知、尝试重新发送命令等。你可以根据需要在回调函数中执行自定义的操作，以响应域的控制错误事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventControlErrorDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 23. func (c *Connect) DomainEventBlockJobRegister(dom *Domain, callback DomainEventBlockJobCallback) (int, error)

作用：
`DomainEventBlockJobRegister` 方法用于注册域（虚拟机）块设备作业事件的回调函数。通过该方法，你可以指定一个回调函数，在域的块设备作业事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventBlockJobCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的块设备作业事件。块设备作业事件指的是与域的块设备操作相关的事件，例如磁盘镜像创建、磁盘快照创建、磁盘备份等。

回调函数的签名应符合 `DomainEventBlockJobCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventBlockJob` 等参数。当指定的域的块设备作业事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventBlockJobRegister` 方法，你可以编写逻辑来监听和处理域的块设备作业事件。例如，你可以在磁盘镜像创建完成时执行特定的操作，如记录日志、发送通知、处理后续任务等。你可以根据需要在回调函数中执行自定义的操作，以响应域的块设备作业事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventBlockJobDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 24. func (c *Connect) DomainEventDiskChangeRegister(dom *Domain, callback DomainEventDiskChangeCallback) (int, error)

作用：
`DomainEventDiskChangeRegister` 方法用于注册域（虚拟机）磁盘变更事件的回调函数。通过该方法，你可以指定一个回调函数，在域的磁盘变更事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventDiskChangeCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的磁盘变更事件。磁盘变更事件指的是与域的磁盘设备变更相关的事件，例如磁盘插拔、磁盘状态变更等。

回调函数的签名应符合 `DomainEventDiskChangeCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventDiskChange` 等参数。当指定的域的磁盘变更事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventDiskChangeRegister` 方法，你可以编写逻辑来监听和处理域的磁盘变更事件。例如，你可以在磁盘插拔时执行特定的操作，如记录日志、发送通知、自动调整磁盘映像等。你可以根据需要在回调函数中执行自定义的操作，以响应域的磁盘变更事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventDiskChangeDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 25. func (c *Connect) DomainEventTrayChangeRegister(dom *Domain, callback DomainEventTrayChangeCallback) (int, error)

作用：
`DomainEventTrayChangeRegister` 方法用于注册域（虚拟机）光驱托盘状态变更事件的回调函数。通过该方法，你可以指定一个回调函数，在域的光驱托盘状态变更事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventTrayChangeCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的光驱托盘状态变更事件。光驱托盘状态变更事件指的是与域的光驱设备的打开、关闭、插入、弹出等操作相关的事件。

回调函数的签名应符合 `DomainEventTrayChangeCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventTrayChange` 等参数。当指定的域的光驱托盘状态变更事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventTrayChangeRegister` 方法，你可以编写逻辑来监听和处理域的光驱托盘状态变更事件。例如，你可以在光驱插入或弹出时执行特定的操作，如记录日志、发送通知、自动加载镜像等。你可以根据需要在回调函数中执行自定义的操作，以响应域的光驱托盘状态变更事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventTrayChangeDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 26. func (c *Connect) DomainEventPMWakeupRegister(dom *Domain, callback DomainEventPMWakeupCallback) (int, error)

作用：
`DomainEventPMWakeupRegister` 方法用于注册域（虚拟机）电源管理唤醒事件的回调函数。通过该方法，你可以指定一个回调函数，在域的电源管理唤醒事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventPMWakeupCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的电源管理唤醒事件。电源管理唤醒事件指的是与域的电源管理唤醒操作相关的事件，例如从暂停状态唤醒、从挂起状态唤醒等。

回调函数的签名应符合 `DomainEventPMWakeupCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventPMWakeup` 等参数。当指定的域的电源管理唤醒事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventPMWakeupRegister` 方法，你可以编写逻辑来监听和处理域的电源管理唤醒事件。例如，你可以在域从挂起状态唤醒时执行特定的操作，如记录日志、发送通知、恢复应用程序状态等。你可以根据需要在回调函数中执行自定义的操作，以响应域的电源管理唤醒事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventPMWakeupDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 27. func (c *Connect) DomainEventPMSuspendRegister(dom *Domain, callback DomainEventPMSuspendCallback) (int, error)

作用：
`DomainEventPMSuspendRegister` 方法用于注册域（虚拟机）电源管理挂起事件的回调函数。通过该方法，你可以指定一个回调函数，在域的电源管理挂起事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventPMSuspendCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的电源管理挂起事件。电源管理挂起事件指的是与域的电源管理挂起操作相关的事件，例如将域挂起至磁盘、将域挂起至内存等。

回调函数的签名应符合 `DomainEventPMSuspendCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventPMSuspend` 等参数。当指定的域的电源管理挂起事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventPMSuspendRegister` 方法，你可以编写逻辑来监听和处理域的电源管理挂起事件。例如，你可以在将域挂起至磁盘时执行特定的操作，如记录日志、发送通知、保存应用程序状态等。你可以根据需要在回调函数中执行自定义的操作，以响应域的电源管理挂起事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventPMSuspendDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 28. func (c *Connect) DomainEventBalloonChangeRegister(dom *Domain, callback DomainEventBalloonChangeCallback) (int, error)

作用：
`DomainEventBalloonChangeRegister` 方法用于注册域（虚拟机）内存气球（Balloon）状态变更事件的回调函数。通过该方法，你可以指定一个回调函数，在域的内存气球状态变更事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventBalloonChangeCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的内存气球状态变更事件。内存气球状态变更事件指的是与域的内存气球设备的状态变更相关的事件，例如内存气球大小的调整。

回调函数的签名应符合 `DomainEventBalloonChangeCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventBalloonChange` 等参数。当指定的域的内存气球状态变更事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventBalloonChangeRegister` 方法，你可以编写逻辑来监听和处理域的内存气球状态变更事件。例如，你可以在内存气球大小调整时执行特定的操作，如记录日志、发送通知、动态调整域的资源分配等。你可以根据需要在回调函数中执行自定义的操作，以响应域的内存气球状态变更事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventBalloonChangeDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 29. func (c *Connect) DomainEventPMSuspendDiskRegister(dom *Domain, callback DomainEventPMSuspendDiskCallback) (int, error)

作用：
`DomainEventPMSuspendDiskRegister` 方法用于注册域（虚拟机）电源管理挂起到磁盘事件的回调函数。通过该方法，你可以指定一个回调函数，在域的电源管理挂起到磁盘事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventPMSuspendDiskCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的电源管理挂起到磁盘事件。电源管理挂起到磁盘事件指的是将域挂起至磁盘时发生的事件。

回调函数的签名应符合 `DomainEventPMSuspendDiskCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventPMSuspendDisk` 等参数。当指定的域的电源管理挂起到磁盘事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventPMSuspendDiskRegister` 方法，你可以编写逻辑来监听和处理域的电源管理挂起到磁盘事件。例如，你可以在将域挂起至磁盘时执行特定的操作，如记录日志、发送通知、保存应用程序状态等。你可以根据需要在回调函数中执行自定义的操作，以响应域的电源管理挂起到磁盘事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventPMSuspendDiskDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 30. func (c *Connect) DomainEventDeviceRemovedRegister(dom *Domain, callback DomainEventDeviceRemovedCallback) (int, error)

作用：
`DomainEventDeviceRemovedRegister` 方法用于注册域（虚拟机）设备移除事件的回调函数。通过该方法，你可以指定一个回调函数，在域的设备移除事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventDeviceRemovedCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的设备移除事件。设备移除事件指的是与域的设备移除操作相关的事件，例如将设备从域中移除。

回调函数的签名应符合 `DomainEventDeviceRemovedCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventDeviceRemoved` 等参数。当指定的域的设备移除事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventDeviceRemovedRegister` 方法，你可以编写逻辑来监听和处理域的设备移除事件。例如，你可以在设备被移除时执行特定的操作，如记录日志、发送通知、更新设备配置等。你可以根据需要在回调函数中执行自定义的操作，以响应域的设备移除事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventDeviceRemovedDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 31. func (c *Connect) DomainEventBlockJobRegister(dom *Domain, callback DomainEventBlockJobCallback) (int, error)

作用：
`DomainEventBlockJobRegister` 方法用于注册域（虚拟机）块设备作业事件的回调函数。通过该方法，你可以指定一个回调函数，在域的块设备作业事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventBlockJobCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的块设备作业事件。块设备作业事件指的是与域的块设备作业操作相关的事件，例如块设备的复制、迁移、快照等操作。

回调函数的签名应符合 `DomainEventBlockJobCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventBlockJob` 等参数。当指定的域的块设备作业事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventBlockJobRegister` 方法，你可以编写逻辑来监听和处理域的块设备作业事件。例如，你可以在块设备作业完成时执行特定的操作，如记录日志、发送通知、更新作业状态等。你可以根据需要在回调函数中执行自定义的操作，以响应域的块设备作业事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventBlockJobDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### 32. func (c *Connect) DomainEventDiskChangeRegister(dom *Domain, callback DomainEventDiskChangeCallback) (int, error)

作用：
`DomainEventDiskChangeRegister` 方法用于注册域（虚拟机）磁盘变更事件的回调函数。通过该方法，你可以指定一个回调函数，在域的磁盘变更事件发生时得到通知并处理相关操作。

方法说明：
- 接收者（Receiver）：`c *Connect`，表示 libvirt 连接对象。
- 参数：
  - `dom *Domain`：要注册事件的域对象。
  - `callback DomainEventDiskChangeCallback`：回调函数，用于处理事件发生时的操作。

返回值：
- `int`：事件句柄（event handle），用于标识已注册的事件。
- `error`：如果发生错误，返回相应的错误信息；否则返回 `nil`。

该方法允许你注册回调函数来处理域的磁盘变更事件。磁盘变更事件指的是与域的磁盘设备变更操作相关的事件，例如添加、删除、更改磁盘等操作。

回调函数的签名应符合 `DomainEventDiskChangeCallback` 类型的定义，通常包括 `conn *Connect`、`dom *Domain`、`event *DomainEventDiskChange` 等参数。当指定的域的磁盘变更事件发生时，libvirt 将调用注册的回调函数，并传递相应的参数。

通过使用 `DomainEventDiskChangeRegister` 方法，你可以编写逻辑来监听和处理域的磁盘变更事件。例如，你可以在磁盘设备被添加或删除时执行特定的操作，如记录日志、发送通知、更新设备配置等。你可以根据需要在回调函数中执行自定义的操作，以响应域的磁盘变更事件。

需要注意的是，在注册事件的回调函数时，确保在适当的时候使用 `DomainEventDiskChangeDeregister` 方法取消注册，以避免资源泄漏和不必要的回调触发。

#### ...

```txt
func (c *Connect) DomainEventPMWakeupRegister(dom *Domain, callback DomainEventPMWakeupCallback) (int, error)
func (c *Connect) DomainEventPMSuspendRegister(dom *Domain, callback DomainEventPMSuspendCallback) (int, error)
func (c *Connect) DomainEventBalloonChangeRegister(dom *Domain, callback DomainEventBalloonChangeCallback) (int, error)
func (c *Connect) DomainEventPMSuspendDiskRegister(dom *Domain, callback DomainEventPMSuspendDiskCallback) (int, error)
func (c *Connect) DomainEventDeviceRemovedRegister(dom *Domain, callback DomainEventDeviceRemovedCallback) (int, error)
func (c *Connect) DomainEventBlockJob2Register(dom *Domain, callback DomainEventBlockJobCallback) (int, error)
func (c *Connect) DomainEventTunableRegister(dom *Domain, callback DomainEventTunableCallback) (int, error)
func (c *Connect) DomainEventAgentLifecycleRegister(dom *Domain, callback DomainEventAgentLifecycleCallback) (int, error)
func (c *Connect) DomainEventDeviceAddedRegister(dom *Domain, callback DomainEventDeviceAddedCallback) (int, error)
func (c *Connect) DomainEventMigrationIterationRegister(dom *Domain, callback DomainEventMigrationIterationCallback) (int, error)
func (c *Connect) DomainEventJobCompletedRegister(dom *Domain, callback DomainEventJobCompletedCallback) (int, error)
func (c *Connect) DomainEventDeviceRemovalFailedRegister(dom *Domain, callback DomainEventDeviceRemovalFailedCallback) (int, error)
func (c *Connect) DomainEventMetadataChangeRegister(dom *Domain, callback DomainEventMetadataChangeCallback) (int, error)
func (c *Connect) DomainEventBlockThresholdRegister(dom *Domain, callback DomainEventBlockThresholdCallback) (int, error)
func (c *Connect) DomainEventMemoryFailureRegister(dom *Domain, callback DomainEventMemoryFailureCallback) (int, error)
func (c *Connect) DomainEventDeregister(callbackId int) error
func (c *Connect) RegisterCloseCallback(callback CloseCallback) error
func (c *Connect) UnregisterCloseCallback() error
func (c *Connect) SetIdentity(ident *ConnectIdentity, flags uint32) error
func (c *Connect) GetCapabilities() (string, error)
func (c *Connect) GetNodeInfo() (*NodeInfo, error)
func (c *Connect) GetHostname() (string, error)
func (c *Connect) GetLibVersion() (uint32, error)
func (c *Connect) GetType() (string, error)
func (c *Connect) IsAlive() (bool, error)
func (c *Connect) IsEncrypted() (bool, error)
func (c *Connect) IsSecure() (bool, error)
func (c *Connect) ListDefinedDomains() ([]string, error)
func (c *Connect) ListDomains() ([]uint32, error)
func (c *Connect) ListInterfaces() ([]string, error)
func (c *Connect) ListNetworks() ([]string, error)
func (c *Connect) ListNWFilters() ([]string, error)
func (c *Connect) ListStoragePools() ([]string, error)
func (c *Connect) ListSecrets() ([]string, error)
func (c *Connect) ListDevices(cap string, flags uint32) ([]string, error)
func (c *Connect) LookupDomainById(id uint32) (*Domain, error)
func (c *Connect) LookupDomainByName(id string) (*Domain, error)
func (c *Connect) LookupDomainByUUIDString(uuid string) (*Domain, error)
func (c *Connect) LookupDomainByUUID(uuid []byte) (*Domain, error)
func (c *Connect) DomainCreateXML(xmlConfig string, flags DomainCreateFlags) (*Domain, error)
func (c *Connect) DomainCreateXMLWithFiles(xmlConfig string, files []os.File, flags DomainCreateFlags) (*Domain, error)
func (c *Connect) DomainDefineXML(xmlConfig string) (*Domain, error)
func (c *Connect) DomainDefineXMLFlags(xmlConfig string, flags DomainDefineFlags) (*Domain, error)
func (c *Connect) ListDefinedInterfaces() ([]string, error)
func (c *Connect) ListDefinedNetworks() ([]string, error)
func (c *Connect) ListDefinedStoragePools() ([]string, error)
func (c *Connect) NumOfDefinedDomains() (int, error)
func (c *Connect) NumOfDefinedInterfaces() (int, error)
func (c *Connect) NumOfDefinedNetworks() (int, error)
func (c *Connect) NumOfDefinedStoragePools() (int, error)
func (c *Connect) NumOfDomains() (int, error)
func (c *Connect) NumOfStoragePools() (int, error)
func (c *Connect) NumOfInterfaces() (int, error)
func (c *Connect) NumOfNetworks() (int, error)
func (c *Connect) NumOfNWFilters() (int, error)
func (c *Connect) NumOfSecrets() (int, error)
func (c *Connect) NumOfDevices(cap string, flags uint32) (int, error)
func (c *Connect) NetworkDefineXML(xmlConfig string) (*Network, error)
func (c *Connect) NetworkCreateXML(xmlConfig string) (*Network, error)
func (c *Connect) LookupNetworkByName(name string) (*Network, error)
func (c *Connect) LookupNetworkByUUIDString(uuid string) (*Network, error)
func (c *Connect) LookupNetworkByUUID(uuid []byte) (*Network, error)
func (c *Connect) SetKeepAlive(interval int, count uint) error
func (c *Connect) GetSysinfo(flags uint32) (string, error)
func (c *Connect) GetURI() (string, error)
func (c *Connect) GetMaxVcpus(typeAttr string) (int, error)
func (c *Connect) InterfaceDefineXML(xmlConfig string, flags uint32) (*Interface, error)
func (c *Connect) LookupInterfaceByName(name string) (*Interface, error)
func (c *Connect) LookupInterfaceByMACString(mac string) (*Interface, error)
func (c *Connect) StoragePoolDefineXML(xmlConfig string, flags uint32) (*StoragePool, error)
func (c *Connect) StoragePoolCreateXML(xmlConfig string, flags StoragePoolCreateFlags) (*StoragePool, error)
func (c *Connect) LookupStoragePoolByName(name string) (*StoragePool, error)
func (c *Connect) LookupStoragePoolByUUIDString(uuid string) (*StoragePool, error)
func (c *Connect) LookupStoragePoolByUUID(uuid []byte) (*StoragePool, error)
func (c *Connect) LookupStoragePoolByTargetPath(path string) (*StoragePool, error)
func (c *Connect) NWFilterDefineXML(xmlConfig string) (*NWFilter, error)
func (c *Connect) LookupNWFilterByName(name string) (*NWFilter, error)
func (c *Connect) LookupNWFilterByUUIDString(uuid string) (*NWFilter, error)
func (c *Connect) LookupNWFilterByUUID(uuid []byte) (*NWFilter, error)
func (c *Connect) LookupNWFilterBindingByPortDev(name string) (*NWFilterBinding, error)
func (c *Connect) LookupStorageVolByKey(key string) (*StorageVol, error)
func (c *Connect) LookupStorageVolByPath(path string) (*StorageVol, error)
func (c *Connect) SecretDefineXML(xmlConfig string, flags uint32) (*Secret, error)
func (c *Connect) LookupSecretByUUID(uuid []byte) (*Secret, error)
func (c *Connect) LookupSecretByUUIDString(uuid string) (*Secret, error)
func (c *Connect) LookupSecretByUsage(usageType SecretUsageType, usageID string) (*Secret, error)
func (c *Connect) LookupDeviceByName(id string) (*NodeDevice, error)
func (c *Connect) LookupDeviceSCSIHostByWWN(wwnn, wwpn string, flags uint32) (*NodeDevice, error)
func (c *Connect) DeviceCreateXML(xmlConfig string, flags uint32) (*NodeDevice, error)
func (c *Connect) DeviceDefineXML(xmlConfig string, flags uint32) (*NodeDevice, error)
func (c *Connect) ListAllInterfaces(flags ConnectListAllInterfacesFlags) ([]Interface, error)
func (c *Connect) ListAllNetworks(flags ConnectListAllNetworksFlags) ([]Network, error)
func (c *Connect) ListAllDomains(flags ConnectListAllDomainsFlags) ([]Domain, error)
func (c *Connect) ListAllNWFilters(flags uint32) ([]NWFilter, error)
func (c *Connect) ListAllNWFilterBindings(flags uint32) ([]NWFilterBinding, error)
func (c *Connect) ListAllStoragePools(flags ConnectListAllStoragePoolsFlags) ([]StoragePool, error)
func (c *Connect) ListAllSecrets(flags ConnectListAllSecretsFlags) ([]Secret, error)
func (c *Connect) ListAllNodeDevices(flags ConnectListAllNodeDeviceFlags) ([]NodeDevice, error)
func (c *Connect) InterfaceChangeBegin(flags uint32) error
func (c *Connect) InterfaceChangeCommit(flags uint32) error
func (c *Connect) InterfaceChangeRollback(flags uint32) error 
func (c *Connect) AllocPages(pageSizes map[int]int64, startCell int, cellCount uint, flags NodeAllocPagesFlags) (int, error)
func (c *Connect) GetCPUMap(flags uint32) (map[int]bool, uint, error)
func (c *Connect) GetCPUStats(cpuNum int, flags uint32) (*NodeCPUStats, error)
func (c *Connect) GetCellsFreeMemory(startCell int, maxCells int) ([]uint64, error)
func (c *Connect) GetFreeMemory() (uint64, error)
func (c *Connect) GetFreePages(pageSizes []uint64, startCell int, maxCells uint, flags uint32) ([]uint64, error)
func (c *Connect) GetMemoryParameters(flags uint32) (*NodeMemoryParameters, error)
func (c *Connect) GetMemoryStats(cellNum int, flags uint32) (*NodeMemoryStats, error)
func (c *Connect) GetSecurityModel() (*NodeSecurityModel, error)
func (c *Connect) SetMemoryParameters(params *NodeMemoryParameters, flags uint32) error
func (c *Connect) SuspendForDuration(target NodeSuspendTarget, duration uint64, flags uint32) error
func (c *Connect) DomainSaveImageDefineXML(file string, xml string, flags DomainSaveRestoreFlags) error
func (c *Connect) DomainSaveImageGetXMLDesc(file string, flags DomainSaveImageXMLFlags) (string, error)
func (c *Connect) BaselineCPU(xmlCPUs []string, flags ConnectBaselineCPUFlags) (string, error)
func (c *Connect) BaselineHypervisorCPU(emulator string, arch string, machine string, virttype string, xmlCPUs []string, flags ConnectBaselineCPUFlags) (string, error)
func (c *Connect) CompareCPU(xmlDesc string, flags ConnectCompareCPUFlags) (CPUCompareResult, error)
func (c *Connect) CompareHypervisorCPU(emulator string, arch string, machine string, virttype string, xmlDesc string, flags ConnectCompareCPUFlags) (CPUCompareResult, error)
func (c *Connect) DomainXMLFromNative(nativeFormat string, nativeConfig string, flags uint32) (string, error)
func (c *Connect) DomainXMLToNative(nativeFormat string, domainXml string, flags uint32) (string, error)
func (c *Connect) GetCPUModelNames(arch string, flags uint32) ([]string, error)
func (c *Connect) GetDomainCapabilities(emulatorbin string, arch string, machine string, virttype string, flags uint32) (string, error)
func (c *Connect) GetVersion() (uint32, error)
func (c *Connect) FindStoragePoolSources(pooltype string, srcSpec string, flags uint32) (string, error)
func (c *Connect) DomainRestore(srcFile string) error
func (c *Connect) DomainRestoreFlags(srcFile, xmlConf string, flags DomainSaveRestoreFlags) error
func (c *Connect) NewStream(flags StreamFlags) (*Stream, error)
func (c *Connect) GetAllDomainStats(doms []*Domain, statsTypes DomainStatsTypes, flags ConnectGetAllDomainStatsFlags) ([]DomainStats, error)
func (c *Connect) GetSEVInfo(flags uint32) (*NodeSEVParameters, error)
func (c *Connect) NWFilterBindingCreateXML(xmlConfig string, flags uint32) (*NWFilterBinding, error)
func (c *Connect) GetStoragePoolCapabilities(flags uint32) (string, error)
```

## 四、domain 管理

### 4.1 domain 对象

### 4.2 domain 方法

| 方法                          | 作用                                                                         |
|-------------------------------|------------------------------------------------------------------------------|
| AbortJob                      | 中止正在运行的作业（job）                                                      |
| AddIOThread                   | 向域（虚拟机）添加 I/O 线程                                                    |
| AgentSetResponseTimeout       | 设置 QEMU 代理（agent）的响应超时时间                                           |
| AttachDevice                  | 将设备附加到域（虚拟机）                                                      |
| AttachDeviceFlags             | 将设备附加到域（虚拟机），支持额外选项                                          |
| AuthorizedSSHKeysGet          | 获取授权的 SSH 密钥列表                                                         |
| AuthorizedSSHKeysSet          | 设置授权的 SSH 密钥列表                                                         |
| BackupBegin                   | 开始备份域（虚拟机）                                                            |
| BackupGetXMLDesc              | 获取备份的 XML 描述                                                             |
| BlockCommit                   | 提交块设备更改                                                                 |
| BlockCopy                     | 复制块设备                                                                     |
| BlockJobAbort                 | 中止块作业                                                                     |
| BlockJobSetSpeed              | 设置块作业速度                                                                 |
| BlockPeek                     | 从块设备中读取数据，不移动读取位置                                               |
| BlockPull                     | 将块设备的数据拉取到目标位置                                                     |
| BlockRebase                   | 重新定位块设备                                                                 |
| BlockResize                   | 调整块设备大小                                                                 |
| BlockStats                    | 获取块设备的统计信息                                                           |
| BlockStatsFlags               | 获取块设备的统计信息，支持额外选项                                              |
| CheckpointLookupByName        | 根据名称查找检查点                                                               |
| CoreDump                      | 生成域（虚拟机）的内核转储                                                      |
| CoreDumpWithFormat            | 以指定格式生成域（虚拟机）的内核转储                                             |
| Create                        | 创建域（虚拟机）                                                                |
| CreateCheckpointXML           | 创建检查点的 XML 描述                                                           |
| CreateSnapshotXML             | 创建快照的 XML 描述                                                             |
| CreateWithFiles               | 创建域（虚拟机）并指定关联的文件                                                 |
| CreateWithFlags               | 创建域（虚拟机），支持额外选项                                                   |
| DelIOThread                   | 删除域（虚拟机）的 I/O 线程                                                     |
| Destroy                       | 销毁域（虚拟机）                                                                |
| DestroyFlags                  | 销毁域（虚拟机），支持额外选项                                                   |
| DetachDevice                  | 从域（虚拟机）中分离设备                                                        |
| DetachDeviceAlias             | 从域（虚拟机）中分离指定别名的设备                                               |
| DetachDeviceFlags             | 从域（虚拟机）中分离设备，支持额外选项                                           |
| DomainGetConnect              | 获取域（虚拟机）所属的连接对象                                                   |
| DomainLxcEnterCGroup          | 进入域（虚拟机）的 LXC 控制组                                                     |
| FSFreeze                      | 冻结文件系统                                                                   |
| FSThaw                        | 解冻文件系统                                                                   |
| FSTrim                        | 对文件系统进行修剪                                                               |
| Free                          | 释放域（虚拟机）                                                                |
| GetAutostart                  | 获取域（虚拟机）的自动启动配置                                                   |
| GetBlkioParameters            | 获取块 I/O 参数                                                                 |
| GetBlockInfo                  | 获取块设备的信息                                                               |
| GetBlockIoTune                | 获取块 I/O 调优信息                                                             |
| GetBlockJobInfo               | 获取块作业的信息                                                               |
| GetCPUStats                   | 获取 CPU 统计信息                                                              |
| GetControlInfo                | 获取域（虚拟机）的控制信息                                                       |
| GetDiskErrors                 | 获取域（虚拟机）的磁盘错误信息                                                     |
| GetEmulatorPinInfo            | 获取模拟器（emulator）的针脚信息                                                  |
| GetFSInfo                     | 获取文件系统信息                                                               |
| GetGuestInfo                  | 获取域（虚拟机）的客户机（guest）信息                                             |
| GetGuestVcpus                 | 获取域（虚拟机）的客户机 VCPU 信息                                               |
| GetHostname                   | 获取连接的主机名                                                                |
| GetID                         | 获取域（虚拟机）的 ID                                                            |
| GetIOThreadInfo               | 获取域（虚拟机）的 I/O 线程信息                                                   |
| GetInfo                       | 获取域（虚拟机）的信息                                                           |
| GetInterfaceParameters        | 获取网络接口参数                                                               |
| GetJobInfo                    | 获取作业（job）的信息                                                            |
| GetJobStats                   | 获取作业（job）的统计信息                                                         |
| GetLaunchSecurityInfo         | 获取启动时的安全信息                                                             |
| GetMaxMemory                  | 获取域（虚拟机）的最大内存                                                       |
| GetMaxVcpus                   | 获取指定类型的最大 VCPU 数                                                        |
| GetMemoryParameters           | 获取内存参数                                                                   |
| GetMessages                   | 获取连接中的消息                                                               |
| GetMetadata                   | 获取域（虚拟机）的元数据                                                         |
| GetName                       | 获取域（虚拟机）的名称                                                           |
| GetNumaParameters             | 获取 NUMA 参数                                                                 |
| GetOSType                     | 获取域（虚拟机）的操作系统类型                                                   |
| GetPerfEvents                 | 获取性能事件                                                                   |
| GetSchedulerParameters        | 获取调度器参数                                                                 |
| GetSchedulerParametersFlags   | 获取调度器参数，支持额外选项                                                      |
| GetSecurityLabel              | 获取安全标签                                                                   |
| GetSecurityLabelList          | 获取安全标签列表                                                               |
| GetState                      | 获取域（虚拟机）的状态                                                           |
| GetTime                       | 获取域（虚拟机）的当前时间                                                       |
| GetUUID                       | 获取域（虚拟机）的 UUID                                                          |
| GetUUIDString                 | 获取域（虚拟机）的 UUID 字符串                                                   |
| GetVcpuPinInfo                | 获取 VCPU 针脚信息 |
| GetVcpus                      | 获取域（虚拟机）的 VCPU 信息                                                     |
| GetVcpusFlags                 | 获取域（虚拟机）的 VCPU 信息，支持额外选项                                        |
| GetXMLDesc                    | 获取域（虚拟机）的 XML 描述                                                      |
| HasCurrentSnapshot            | 检查域（虚拟机）是否有当前快照                                                   |
| HasManagedSaveImage           | 检查域（虚拟机）是否有托管保存的镜像                                             |
| InjectNMI                     | 向域（虚拟机）注入非屏蔽中断                                                     |
| InterfaceStats                | 获取网络接口的统计信息                                                           |
| IsActive                      | 检查域（虚拟机）是否处于活动状态                                                 |
| IsPersistent                  | 检查域（虚拟机）是否是持久化的                                                   |
| IsUpdated                     | 检查域（虚拟机）是否有未保存的更改                                               |
| ListAllCheckpoints            | 列出域（虚拟机）的所有检查点                                                      |
| ListAllInterfaceAddresses     | 列出所有网络接口的地址                                                           |
| ListAllSnapshots              | 列出域（虚拟机）的所有快照                                                        |
| LxcEnterNamespace             | 进入域（虚拟机）的 LXC 命名空间                                                   |
| LxcOpenNamespace              | 打开域（虚拟机）的 LXC 命名空间                                                   |
| ManagedSave                   | 托管保存域（虚拟机）                                                             |
| ManagedSaveDefineXML          | 定义托管保存的 XML 描述                                                          |
| ManagedSaveGetXMLDesc         | 获取托管保存的 XML 描述                                                          |
| ManagedSaveRemove             | 移除托管保存的镜像                                                               |
| MemoryPeek                    | 从内存中读取数据，不移动读取位置                                                   |
| MemoryStats                   | 获取域（虚拟机）的内存统计信息                                                    |
| Migrate                       | 迁移域（虚拟机）到另一个连接                                                       |
| Migrate2                      | 迁移域（虚拟机）到另一个连接，支持额外选项                                         |
| Migrate3                      | 迁移域（虚拟机）到另一个连接，支持额外选项和进度通知                                |
| MigrateGetCompressionCache    | 获取迁移过程中的压缩缓存大小                                                      |
| MigrateGetMaxDowntime         | 获取迁移过程中允许的最大停机时间                                                   |
| MigrateGetMaxSpeed            | 获取迁移过程中的最大传输速度                                                      |
| MigrateSetCompressionCache    | 设置迁移过程中的压缩缓存大小                                                      |
| MigrateSetMaxDowntime         | 设置迁移过程中允许的最大停机时间                                                   |
| MigrateSetMaxSpeed            | 设置迁移过程中的最大传输速度                                                      |
| MigrateStartPostCopy          | 启动迁移的后拷贝阶段                                                             |
| MigrateToURI                  | 迁移到指定 URI 的连接                                                             |
| MigrateToURI2                 | 迁移到指定 URI 的连接，支持额外选项                                                |
| MigrateToURI3                 | 迁移到指定 URI 的连接，支持额外选项和进度通知                                       |
| OpenChannel                   | 打开域（虚拟机）的通道                                                           |
| OpenConsole                   | 打开域（虚拟机）的控制台                                                         |
| OpenGraphics                  | 打开域（虚拟机）的图形界面                                                       |
| OpenGraphicsFD                | 以文件描述符的方式打开域（虚拟机）的图形界面                                      |
| PMSuspendForDuration          | 挂起域（虚拟机）一段时间                                                         |
| PMWakeup                      | 唤醒挂起的域（虚拟机）                                                           |
| PinEmulator                   | 将模拟器（emulator）针脚绑定到特定 CPU                                            |
| PinIOThread                   | 将 I/O 线程针脚绑定到特定 CPU                                                     |
| PinVcpu                       | 将 VCPU 针脚绑定到特定 CPU                                                        |
| PinVcpuFlags                  | 将 VCPU 针脚 |
| QemuAgentCommand              | 发送 QEMU 代理（agent）命令                                                      |
| QemuMonitorCommand            | 发送 QEMU 监控命令                                                               |
| Reboot                        | 重启域（虚拟机）                                                                |
| Ref                           | 引用域（虚拟机）                                                                 |
| Rename                        | 重命名域（虚拟机）                                                                |
| Reset                         | 重置域（虚拟机）                                                                |
| Resume                        | 恢复域（虚拟机）运行                                                            |
| Save                          | 保存域（虚拟机）的状态                                                           |
| SaveFlags                     | 保存域（虚拟机）的状态，支持额外选项                                              |
| Screenshot                    | 获取域（虚拟机）的屏幕截图                                                         |
| SendKey                       | 向域（虚拟机）发送按键事件                                                       |
| SendProcessSignal             | 向域（虚拟机）中的进程发送信号                                                   |
| SetAutostart                  | 设置域（虚拟机）的自动启动配置                                                   |
| SetBlkioParameters            | 设置块 I/O 参数                                                                 |
| SetBlockIoTune                | 设置块 I/O 调优信息                                                             |
| SetBlockThreshold             | 设置块设备阈值                                                                   |
| SetGuestVcpus                 | 设置域（虚拟机）的客户机 VCPU 数量                                               |
| SetIOThreadParams             | 设置域（虚拟机）的 I/O 线程参数                                                   |
| SetInterfaceParameters        | 设置网络接口参数                                                               |
| SetLifecycleAction            | 设置生命周期操作                                                               |
| SetMaxMemory                  | 设置域（虚拟机）的最大内存                                                       |
| SetMemory                     | 设置域（虚拟机）的内存大小                                                       |
| SetMemoryFlags                | 设置域（虚拟机）的内存大小，支持额外选项                                          |
| SetMemoryParameters           | 设置内存参数                                                                   |
| SetMemoryStatsPeriod          | 设置内存统计周期                                                               |
| SetMetadata                   | 设置域（虚拟机）的元数据                                                         |
| SetNumaParameters             | 设置 NUMA 参数                                                                 |
| SetPerfEvents                 | 设置性能事件                                                                   |
| SetSchedulerParameters        | 设置调度器参数                                                                 |
| SetSchedulerParametersFlags   | 设置调度器参数，支持额外选项                                                      |
| SetTime                       | 设置域（虚拟机）的当前时间                                                       |
| SetUserPassword               | 设置用户密码                                                                   |
| SetVcpu                       | 设置域（虚拟机）的 VCPU 数量                                                     |
| SetVcpus                      | 设置域（虚拟机）的 VCPU 数量                                                     |
| SetVcpusFlags                 | 设置域（虚拟机）的 VCPU 数量，支持额外选项                                        |
| Shutdown                      | 关闭域（虚拟机）                                                                |
| ShutdownFlags                 | 关闭域（虚拟机），支持额外选项                                                   |
| SnapshotCurrent               | 创建当前状态的快照                                                               |
| SnapshotListNames             | 获取快照的名称列表                                                             |
| SnapshotLookupByName          | 根据名称查找快照                                                               |
| SnapshotNum                   | 获取快照的数量                                                                 |
| StartDirtyRateCalc            | 开始计算脏页速率                                                                 |
| Suspend                       | 挂起域（虚拟机）                                                                |
| Undefine                      | 取消定义域（虚拟机）                                                            |
| UndefineFlags                 | 取消定义域（虚拟机），支持额外选项                                               |
| UpdateDeviceFlags             | 更新设备的信息，支持额外选项                                                     |

## 五、一些常量

### 5.1 虚机状态

[libvirt: Module libvirt-domain from libvirt](https://libvirt.org/html/libvirt-libvirt-domain.html#virDomainState)

```c
enum virDomainState {
VIR_DOMAIN_NOSTATE	=	0 (0x0)	// no state
VIR_DOMAIN_RUNNING	=	1 (0x1)	 // the domain is running
VIR_DOMAIN_BLOCKED	=	2 (0x2)	 // the domain is blocked on resource
VIR_DOMAIN_PAUSED	=	3 (0x3)	// the domain is paused by user
VIR_DOMAIN_SHUTDOWN	=	4 (0x4)	// the domain is being shut down
VIR_DOMAIN_SHUTOFF	=	5 (0x5)	// the domain is shut off
VIR_DOMAIN_CRASHED	=	6 (0x6)	// the domain is crashed
VIR_DOMAIN_PMSUSPENDED	=	7 (0x7)	// the domain is suspended by guest power management
VIR_DOMAIN_LAST	=	8 (0x8)	// NB: this enum value will increase over time as new states are added to the libvirt API. It reflects the last state supported by this version of the libvirt API.
}
```

### 5.2 DomainModificationImpact

一些修改API采取标志来确定对域的改变是只影响运行的实例，只影响持久化定义，还是同时影响两者。对应的查询API也采取相同的标志，以确定是否查询运行实例或持久化定义，尽管两者不能同时查询。使用VIR_DOMAIN_AFFECT_CURRENT将根据当前域的状态解析为VIR_DOMAIN_AFFECT_LIVE或VIR_DOMAIN_AFFECT_CONFIG。VIR_DOMAIN_AFFECT_LIVE需要一个正在运行的域，而VIR_DOMAIN_AFFECT_CONFIG需要一个持久的域（无论它是否正在运行）。这些枚举不应该与virTypedParameterFlags的枚举冲突。

```c
enum virDomainModificationImpact {
VIR_DOMAIN_AFFECT_CURRENT	=	0 (0x0)	 // Affect current domain state.
VIR_DOMAIN_AFFECT_LIVE	=	1 (0x1; 1 << 0)	 // Affect running domain state.
VIR_DOMAIN_AFFECT_CONFIG	=	2 (0x2; 1 << 1)	// Affect persistent domain state. 1 << 2 is reserved for virTypedParameterFlags
}
```

这是一个名为`virDomainModificationImpact`的枚举，用于指定对域（虚拟机）进行修改时的影响范围。下面是对枚举值的解释：

- VIR_DOMAIN_AFFECT_CURRENT（0）：表示影响当前域的状态。当对域进行修改时，此选项指定只影响当前运行中的域状态，不涉及持久化配置或未运行的域。例如，修改当前域的内存或 CPU 配置。

- VIR_DOMAIN_AFFECT_LIVE（1）：表示影响运行中的域的状态。当对域进行修改时，此选项指定影响正在运行的域的状态，包括实时的内存、CPU、设备等配置。例如，修改运行中域的网络连接或磁盘设备。

- VIR_DOMAIN_AFFECT_CONFIG（2）：表示影响持久化的域状态。当对域进行修改时，此选项指定影响持久化的域配置，包括持久化的存储池、网络、设备等。修改持久化配置后，域在下次启动时将使用新的配置。例如，修改域的存储池配置或添加持久化的设备。

枚举中还提到了`virTypedParameterFlags`，该标志位保留用于`virTypedParameter`类型的标志，用于特定参数的进一步控制和扩展。

通过指定适当的`virDomainModificationImpact`值，可以在修改域时明确指定希望影响的范围，以满足特定需求并确保修改操作只应用于所需的域状态。

### 5.3 DomainRunningReason

上面的枚举`virDomainRunningReason`用于表示虚拟机正在运行的原因。每个枚举值对应一种虚拟机运行状态的原因，具体解释如下：

- `VIR_DOMAIN_RUNNING_UNKNOWN`：未知原因，表示无法确定虚拟机的运行原因。
- `VIR_DOMAIN_RUNNING_BOOTED`：正常启动，表示虚拟机是从正常的启动过程中运行的。
- `VIR_DOMAIN_RUNNING_MIGRATED`：迁移启动，表示虚拟机是从另一个主机迁移过来后运行的。
- `VIR_DOMAIN_RUNNING_RESTORED`：恢复启动，表示虚拟机是从状态文件中恢复后运行的。
- `VIR_DOMAIN_RUNNING_FROM_SNAPSHOT`：从快照启动，表示虚拟机是从快照中恢复后运行的。
- `VIR_DOMAIN_RUNNING_UNPAUSED`：解除暂停启动，表示虚拟机是从暂停状态恢复后运行的。
- `VIR_DOMAIN_RUNNING_MIGRATION_CANCELED`：迁移取消启动，表示虚拟机是从迁移过程中恢复后运行的。
- `VIR_DOMAIN_RUNNING_SAVE_CANCELED`：保存取消启动，表示虚拟机是从保存失败的过程中恢复后运行的。
- `VIR_DOMAIN_RUNNING_WAKEUP`：唤醒启动，表示虚拟机是从电源管理挂起状态中被唤醒后运行的。
- `VIR_DOMAIN_RUNNING_CRASHED`：崩溃恢复启动，表示虚拟机是从崩溃状态中恢复后运行的。
- `VIR_DOMAIN_RUNNING_POSTCOPY`：后复制启动，表示虚拟机是在后复制迁移模式下运行的。
- `VIR_DOMAIN_RUNNING_POSTCOPY_FAILED`：后复制失败启动，表示虚拟机是在后复制迁移失败的情况下运行的。
- `VIR_DOMAIN_RUNNING_LAST`：枚举的最后一个值，用于表示枚举的结束。

这些枚举值提供了对虚拟机运行原因的描述，可以帮助识别虚拟机当前的运行状态和启动方式。

### 5.4 DomainControlState

- `VIR_DOMAIN_CONTROL_OK`：表示虚拟机处于正常操作状态，可以接受命令。
- `VIR_DOMAIN_CONTROL_JOB`：表示虚拟机正在运行后台作业，可以通过`virDomainGetJobInfo`监视作业的进展；只有一部分受限的命令可以被执行。
- `VIR_DOMAIN_CONTROL_OCCUPIED`：表示虚拟机正忙于执行某个命令。
- `VIR_DOMAIN_CONTROL_ERROR`：表示虚拟机处于无法完全操作的状态，可能存在某些问题，具体原因可以在详情字段中提供。
- `VIR_DOMAIN_CONTROL_LAST`：标记枚举的结束。

这些常量描述了虚拟机的控制状态，用于指示虚拟机是否处于正常运行状态、执行后台作业、正在忙于执行命令或者存在错误。根据虚拟机的控制状态，您可以相应地采取操作，例如监视后台作业的进展或处理出现的错误。

### 5.5 DomainCoreDumpFormat

上述枚举`virDomainCoreDumpFormat`定义了虚拟机核心转储的格式常量值，并解释了每个常量的含义：

- `VIR_DOMAIN_CORE_DUMP_FORMAT_RAW`：以原始格式转储客户机内存。
- `VIR_DOMAIN_CORE_DUMP_FORMAT_KDUMP_ZLIB`：以kdump压缩格式转储客户机内存，并使用zlib压缩。
- `VIR_DOMAIN_CORE_DUMP_FORMAT_KDUMP_LZO`：以kdump压缩格式转储客户机内存，并使用lzo压缩。
- `VIR_DOMAIN_CORE_DUMP_FORMAT_KDUMP_SNAPPY`：以kdump压缩格式转储客户机内存，并使用snappy压缩。
- `VIR_DOMAIN_CORE_DUMP_FORMAT_WIN_DMP`：以Windows完整崩溃转储格式转储客户机内存。
- `VIR_DOMAIN_CORE_DUMP_FORMAT_LAST`：标记枚举的结束。注意，随着时间的推移，该枚举值可能会增加，以反映libvirt API支持的最新格式。

这些常量定义了虚拟机核心转储的不同格式选项。在进行虚拟机核心转储时，您可以选择适合您需求的格式，例如原始格式、压缩格式或特定的操作系统格式（如Windows完整崩溃转储格式）。根据所选的格式，转储的文件可能具有不同的压缩方式和结构。


> 什么是“虚拟机核心转储”？
> 
> 虚拟机核心转储（Virtual Machine Core Dump）是指将虚拟机在发生关键错误或崩溃时的内部状态、内存和处理器状态等信息以文件形式保存下来的过程。它类似于物理计算机的核心转储（Core Dump），但针对的是虚拟机环境。
> 
> 当虚拟机发生关键错误或崩溃时，核心转储可以捕获虚拟机的当前状态，包括内存内容、寄存器状态、程序计数器等信息。这对于调试和分析虚拟机故障非常有用，因为它提供了关于虚拟机在崩溃前的运行情况的详细信息。
> 
> 通过虚拟机核心转储，可以在虚拟化平台或管理工具上进行后续分析。例如，管理员可以使用核心转储文件来了解虚拟机崩溃的原因，识别软件错误或配置问题，并采取适当的措施来解决问题。核心转储还可以用于故障排除、性能分析和虚拟机状态的恢复。
> 
> 需要注意的是，虚拟机核心转储可能会占用较大的存储空间，因为它保存了整个虚拟机的内存内容。因此，在使用核心转储时，应确保有足够的存储空间来保存转储文件，并根据需要进行清理和管理。

### 5.6 DomainCoreDumpFlags

- `VIR_DUMP_CRASH`：表示在转储完成后立即崩溃虚拟机。在进行核心转储时，虚拟机将被暂停并转储其内存，然后会立即触发崩溃，以避免继续运行可能损坏的虚拟机。
- `VIR_DUMP_LIVE`：表示进行实时转储。这意味着在虚拟机仍在运行时进行转储操作，而不需要暂停虚拟机。这种转储方式通常用于获取虚拟机在运行时的状态和内存快照。
- `VIR_DUMP_BYPASS_CACHE`：表示避免文件系统缓存污染。在进行核心转储时，操作系统通常会使用文件系统缓存来提高性能。但是，如果需要获取准确的虚拟机内存镜像，可能需要避免使用缓存，以确保转储的数据是最新的。
- `VIR_DUMP_RESET`：表示在转储完成后重置虚拟机。当转储操作完成后，虚拟机将被重置（相当于重新启动），以便将其恢复到转储之前的状态。这对于进行故障排除或重新创建虚拟机的一致状态很有用。
- `VIR_DUMP_MEMORY_ONLY`：表示只使用"dump-guest-memory"功能进行转储。这将仅转储虚拟机的内存内容，而不包括其他资源（例如设备状态）。这种转储方式通常用于获取虚拟机内存的快照，以进行分析或诊断。

这些标志位用于控制虚拟机核心转储操作的行为和选项。根据需要，可以组合使用这些标志位来满足特定的转储需求，例如进行实时转储、重置虚拟机或获取准确的内存快照等。

### 5.7 DomainMigrateFlags

上述枚举是用于控制虚拟机迁移操作的标志位，下面对每个标志位进行解释：

- `VIR_MIGRATE_LIVE`：表示在迁移过程中不暂停虚拟机。虚拟机的内存将在虚拟机运行时传输到目标主机。如果虚拟机的内存变化速度超过传输速度，迁移过程可能永远无法完成。可以使用`virDomainSuspend`在迁移过程中手动暂停虚拟机。

- `VIR_MIGRATE_PEER2PEER`：告诉源`libvirtd`直接连接到目标主机。如果没有设置此标志位，客户端（如`virsh`）将连接到两个主机并控制迁移过程。在对等模式下，源`libvirtd`通过直接调用目标守护进程来控制迁移过程。

- `VIR_MIGRATE_TUNNELLED`：在`libvirtd`连接上隧道传输迁移数据。如果没有设置此标志位，源虚拟化管理程序将直接将迁移数据发送到目标虚拟化管理程序。该标志位只能在设置了`VIR_MIGRATE_PEER2PEER`时使用。需要注意的是，这里使用了不常见的拼写方式：`VIR_MIGRATE_TUNNELLED`应该是`VIR_MIGRATE_TUNNELED`。

- `VIR_MIGRATE_PERSIST_DEST`：成功迁移后，在目标主机上将虚拟机定义为持久化。如果源主机上的虚拟机是持久化的，并且没有使用`VIR_MIGRATE_UNDEFINE_SOURCE`，则虚拟机将在两个主机上都保持持久化状态。

- `VIR_MIGRATE_UNDEFINE_SOURCE`：成功迁移后，在源主机上取消定义虚拟机。

- `VIR_MIGRATE_PAUSED`：在目标主机上保持虚拟机暂停状态。需要显式调用`virDomainResume`（使用迁移API返回的`virDomainPtr`）来恢复虚拟机的虚拟CPU。

- `VIR_MIGRATE_NON_SHARED_DISK`：迁移除虚拟机内存外的完整磁盘映像。默认情况下，只会传输非共享非只读的磁盘映像。可以使用`VIR_MIGRATE_PARAM_MIGRATE_DISKS`参数指定要迁移的磁盘。该标志位与`VIR_MIGRATE_NON_SHARED_INC`互斥。

- `VIR_MIGRATE_NON_SHARED_INC`：除虚拟机内存外，迁移磁盘映像。与`VIR_MIGRATE_NON_SHARED_DISK`类似，但只会复制每个磁盘的顶层链，其余的链在目标上需要存在且与源主机上的完全相同。该标志位与`VIR_MIGRATE_NON_SHARED_DISK`互斥。

- `VIR_MIGRATE_CHANGE_PROTECTION`：在迁移过程中防止虚拟机配置更改。当两端都支持时，此标志位会自动使用。如果显式设置此标志位，当源或目标不支持时，迁移将失败。

- `VIR_MIGRATE_UNSAFE`：强制进行不安全的迁移。在某些情况下，libvirt可能会拒绝迁移虚拟机，因为这样做可能导致潜在问题，如数据损坏，因此迁移被视为不安全。对于QEMU虚拟机，如果虚拟机使用未显式将缓存模式设置为"none"的磁盘，可能会发生这种情况。除非磁盘映像存储在一致的集群文件系统（如GFS2或GPFS）上，否则迁移这样的虚拟机是不安全的。

- `VIR_MIGRATE_OFFLINE`：在目标上启动虚拟机之前迁移虚拟机定义，并且在源主机上不停止虚拟机。离线迁移需要设置`VIR_MIGRATE_PERSIST_DEST`。离线迁移可能不会复制磁盘存储或任何其他基于文件的存储（例如UEFI变量）。

- `VIR_MIGRATE_COMPRESSED`：对迁移数据进行压缩。可以使用`VIR_MIGRATE_PARAM_COMPRESSION`指定压缩方法。如果省略此参数，将使用虚拟化管理程序的默认压缩方法。可以通过特定的`VIR_MIGRATE_PARAM_COMPRESSION_*`参数来调整各个压缩方法。

- `VIR_MIGRATE_ABORT_ON_ERROR`：如果在迁移过程中发生软错误（如I/O错误），则取消迁移。

- `VIR_MIGRATE_AUTO_CONVERGE`：启用确保实时迁移最终收敛的算法。通常情况下，虚拟机的运行速度会降低，以确保其内存变化速度不会超过虚拟化管理程序将更改的内存传输到目标主机的速度。可以使用`VIR_MIGRATE_PARAM_AUTO_CONVERGE_*`参数来调整算法。

- `VIR_MIGRATE_RDMA_PIN_ALL`：此标志位可与RDMA迁移一起使用（即`VIR_MIGRATE_PARAM_URI`以"rdma://"开头）。它告诉虚拟化管理程序在迁移开始之前一次性固定所有虚拟机的内存，而不是按需固定内存页。这意味着属于虚拟机的所有内存页都将锁定在主机的内存

## 六、问题记录

### 6.1 虚拟机快照是如何实现的？

- 一个快照保存了什么？
- 保存在哪里？
- 如何恢复？

虚拟机快照是通过保存虚拟机的状态和内存内容来实现的。当创建一个快照时，虚拟机的当前状态会被冻结，并将内存中的内容保存到磁盘上的一个文件中。这个文件通常被称为快照文件或快照磁盘。

一个快照保存了以下内容：
1. 虚拟机的配置信息：包括虚拟机的硬件配置、网络设置、存储配置等。
2. 虚拟机的内存内容：快照会保存虚拟机内存中的所有数据，包括运行中的进程、操作系统状态和应用程序状态。
3. 虚拟机的磁盘状态：快照会保存虚拟机的磁盘状态，包括磁盘的当前数据和状态，以及虚拟机与磁盘的关联关系。

快照文件通常保存为特定格式的文件，如QEMU使用的qcow2格式、VMware使用的VMDK格式等。这些格式可以对虚拟机的状态和磁盘内容进行有效的压缩和管理。

快照文件可以保存在不同的位置，具体取决于虚拟化平台和配置。通常，快照文件可以保存在本地存储、网络存储或专用的快照存储中。

要从一个快照恢复虚拟机，可以按照以下步骤进行：
1. 确保快照文件可用：在恢复之前，需要确保快照文件仍然存在且可用。
2. 关闭虚拟机：如果虚拟机当前正在运行，需要先将其关闭。
3. 恢复快照：使用虚拟化管理工具或API，选择要恢复的快照，并指定恢复操作。
4. 启动虚拟机：一旦快照恢复完成，可以启动虚拟机，并将其恢复到快照创建时的状态。

需要注意的是，恢复快照将会覆盖当前虚拟机的状态和内存内容。因此，在进行恢复操作之前，请确保已经保存了任何重要的数据，并且理解恢复操作的影响。

## 参考文档

1. [libvirt package - github.com/libvirt/libvirt-go - Go Packages](https://pkg.go.dev/github.com/libvirt/libvirt-go)

2. [libvirt: Reference Manual for libvirt](https://libvirt.org/html/)

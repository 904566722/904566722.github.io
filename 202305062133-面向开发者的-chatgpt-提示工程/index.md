# 面向开发者的 ChatGPT 提示工程

<!--more-->

#ChatGPT

> 该篇笔记源于课程：[https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)

## 一、包含什么内容？

两个产出：
1. 使用大型语言模型（Large Language Model，LLM）快速构建功能强大的应用程序
2. 构建两项能力：
	- 学习创新
	- 创造价值

了解 LLM 的工作原理
提示工程的最佳实践
如何编写有效的提示（两个原则）
如何设计好的提示
如何构建自己的聊天机器人

## 二、提示词准则
### 2.1 指令要清晰
> 1. 输入清晰
> 2. 输出清晰
> 3. 过程清晰

1. 输入要清晰

清楚表明我想要的是什么？以此引导模型产出更符合我们期待的结果，避免跑题。注意清晰 != 简短，如果较长的描述更能准确表达我们的意图，那么这是必要的。

一些帮助符号：

- “”
- \`\`\`
- \-\-\-
- <>
- ...

有时候为了能够更清晰的表明意图，我们可以使用一些符号来辅佐说明。


例子：
```txt
你现在作为一名学生，需要对我的提问做出回答，ChatGPT Prompt Engineering for Developers 这门课讲述了什么

“您应该清晰且尽可能具体地表达您希望模型执行的操作，这将引导模型达到所预期的输出，并减少不相关的输出，或者不正确的输出。不要把写一个清晰的提示和写一个简短的提示混为一谈，许多情况下，较长的提示为模型提供了更清晰的背景，这可能会导致更加详细和相关的产出”

将由双引号限定的文字概括成一句话
```

![](images/posts/Pasted%20image%2020230507084900.png)

上面的例子中，我们使用到了双引号来界定应该要总结的内容，引导模型产生我们想要的输出，当然这只是一个简单的例子，实际中可以更灵活地来使用


2. 输出要清晰

上面的提到了如何更清晰地告诉模型应该输入的内容，下面我们应该告诉模型我们想要什么样的结果，我们可以结构化我们的输出，有时候我们可以将输出格式化为 html、json、markdown 等格式


看这样的一个例子

![](images/posts/Pasted%20image%2020230507085703.png)

当然，更多时候 json 的 key 应该是英文，我们可以接着告诉 gpt：

![](images/posts/Pasted%20image%2020230507085756.png)

有时候我们可能没有办法一次就描述清楚我们想要的，那么我们就可以继续补充，这是一个迭代的过程


3. 过程要清晰

在处理的过程中，我们可以指定模型一些判断条件

看下面的例子
```txt
“泡一杯茶很简单！ 首先，你需要让水沸腾。 发生这种情况时，
拿一个杯子，在里面放一个茶包。 一旦水足够热，只需将其倒在茶包上即可。
让它静置一会儿。 再过几分钟，取出茶包。 如果你喜欢，可以加点糖或者牛奶调味。
就是这样！ 你有了自己的美味的一杯茶来享受。”

将上面由双引号限定的文本以下面的格式来重写：

第一步 - ...
第二步 - ...
第三步 - ...
第N步 - ...

如果文本不包含顺序指示，那么只需要写上“没有提供步骤”
```
![](images/posts/Pasted%20image%2020230507091632.png)


上面的文本识别到了顺序指示，因此将文本以分步的形式重新组织了，同样的处理方式，我们来看另外一段文本：
```txt
今天阳光明媚，鸟儿们在唱歌。这是一个美丽的日子，可以去公园里散步。树木在微风中轻轻摇曳。 一些人正在野餐，而另一些人正在玩游戏或只是在草地上放松。这是一个 这是一个完美的日子，可以花时间在户外，欣赏自然之美。 

将上面由双引号限定的文本以下面的格式来重写：

第一步 - ...
第二步 - ...
第三步 - ...
第N步 - ...

如果文本不包含指令序列，那么只需要写上“没有提供步骤”
```

![](images/posts/Pasted%20image%2020230507091708.png)

可以看到通过判断，达到了我们想要的结果


### 2.2 给模型思考的时间

1. 指定步骤来完成任务


看这样一个例子：
```txt
“在一个迷人的村庄里，兄妹杰克和吉尔出发去山顶的井里取水。他们一边唱着欢快的歌，一边爬山，但不幸的是，杰克绊倒在石头上，从山上滚了下来，吉尔也跟着摔倒。虽然有些受伤，但他们还是回家受到安慰的拥抱。尽管遭遇了不幸，但他们的冒险精神仍然没有消失，他们继续愉快地探索。”

执行下面的动作：
1 - 用一句话总结上面引号括起来的文本
2 - 将第一步得到的总结翻译成韩语
3 - 在韩语总结中列出每个名字

用换行把每一步的答案分开
```

![](images/posts/Pasted%20image%2020230507092942.png)

在这个例子中，我们想要完成的并不只是一种操作，我们对于一段文本可能想做好几件事，那么就可以分成几个步骤，告诉模型分别要做什么


### \* 模型的限制

在模型训练的过程中，并不会完美的记住自己接触的每个信息，因此它对自己的知识边界并不是十分了解，这意味着它可能会尝试回答一些晦涩难懂的问题，并且可以编造一些听起来很有道理，但实际上并不真实的事情，如下面的例子

![](images/posts/Pasted%20image%2020230507094055.png)

这并不是真实的，但看起来非常真实，这是非常危险的，也是模型已知的一个问题


## 三、提示词的迭代

由于某些原因，我们第一次获得的结果可能对于我们来说并不是有效、有用的，但是我们可以通过获得的结果，反复完善我们的提示词，一步步走向我们的想要的结果。

因此迭代的过程可以分为以下几步：
- 先试试
- 分析结果，是否符合我们预期
- 给出清楚的说明（指示），给模型更多时间思考
- 完善提示语


## 四、总结摘要


例子1：
```txt
把以下产品评论进行总结，总结的字数不超过30个字。

产品评论："我为女儿的生日买了这只熊猫毛绒玩具，她非常喜欢，并且随身携带。它摸起来很软，非常可爱，脸上还有友好的表情。但是，相对于价格来说，它有点小了。我认为可能会有其他同样价位但更大的选择。它比预期提前一天到达，所以在把它送给女儿之前，我自己先玩了一下。"
```

![](images/posts/Pasted%20image%2020230507095726.png)


如果把上面的任务稍微修改一下，
```txt
你的任务是对一个电子商务网站的产品评论生成一个简短的摘要，以反馈给航运部门。
把以下产品评论进行总结，总结的字数不超过30个字, 重点放在提到产品运输和交付的任何方面。

产品评论："我为女儿的生日买了这只熊猫毛绒玩具，她非常喜欢，并且随身携带。它摸起来很软，非常可爱，脸上还有友好的表情。但是，相对于价格来说，它有点小了。我认为可能会有其他同样价位但更大的选择。它比预期提前一天到达，所以在把它送给女儿之前，我自己先玩了一下。"
```

![](images/posts/Pasted%20image%2020230507100059.png)

我们可以根据想要总结的方式，要求它提取不同的信息


再来看一个可能实际中更能碰倒的例子：
```txt
# review for a standing lamp
review_1 = """
Needed a nice lamp for my bedroom, and this one \
had additional storage and not too high of a price \
point. Got it fast - arrived in 2 days. The string \
to the lamp broke during the transit and the company \
happily sent over a new one. Came within a few days \
as well. It was easy to put together. Then I had a \
missing part, so I contacted their support and they \
very quickly got me the missing piece! Seems to me \
to be a great company that cares about their customers \
and products. 
"""

# review for an electric toothbrush
review_2 = """
My dental hygienist recommended an electric toothbrush, \
which is why I got this. The battery life seems to be \
pretty impressive so far. After initial charging and \
leaving the charger plugged in for the first week to \
condition the battery, I've unplugged the charger and \
been using it for twice daily brushing for the last \
3 weeks all on the same charge. But the toothbrush head \
is too small. I’ve seen baby toothbrushes bigger than \
this one. I wish the head was bigger with different \
length bristles to get between teeth better because \
this one doesn’t.  Overall if you can get this one \
around the $50 mark, it's a good deal. The manufactuer's \
replacements heads are pretty expensive, but you can \
get generic ones that're more reasonably priced. This \
toothbrush makes me feel like I've been to the dentist \
every day. My teeth feel sparkly clean! 
"""

# review for a blender
review_3 = """
So, they still had the 17 piece system on seasonal \
sale for around $49 in the month of November, about \
half off, but for some reason (call it price gouging) \
around the second week of December the prices all went \
up to about anywhere from between $70-$89 for the same \
system. And the 11 piece system went up around $10 or \
so in price also from the earlier sale price of $29. \
So it looks okay, but if you look at the base, the part \
where the blade locks into place doesn’t look as good \
as in previous editions from a few years ago, but I \
plan to be very gentle with it (example, I crush \
very hard items like beans, ice, rice, etc. in the \ 
blender first then pulverize them in the serving size \
I want in the blender then switch to the whipping \
blade for a finer flour, and use the cross cutting blade \
first when making smoothies, then use the flat blade \
if I need them finer/less pulpy). Special tip when making \
smoothies, finely cut and freeze the fruits and \
vegetables (if using spinach-lightly stew soften the \ 
spinach then freeze until ready for use-and if making \
sorbet, use a small to medium sized food processor) \ 
that you plan to use that way you can avoid adding so \
much ice if at all-when making your smoothie. \
After about a year, the motor was making a funny noise. \
I called customer service but the warranty expired \
already, so I had to buy another one. FYI: The overall \
quality has gone done in these types of products, so \
they are kind of counting on brand recognition and \
consumer loyalty to maintain sales. Got it in about \
two days.
"""

reviews = [review_1, review_2, review_3, review_4]

你的任务是将上面的每个review分别做总结，总结以下面的格式输出：

1.
2.

将总结翻译成中文
```

![](images/posts/Pasted%20image%2020230507100813.png)

## 五、AI 推理

提取情绪信息

## 六、AI 转译

- 翻译
- 语法纠正、校对
- 格式转换（json、html、markdown...）
- 语气转换

（语气转换）不同的邮件对象可能需要不同的语气或者书面语，看下面的例子
```
将下面的内容从俚语转换成一封商务信函：
“伙计，我是乔，看看这个立灯的规格。”
```

![](images/posts/Pasted%20image%2020230507102600.png)


## 七、扩写（文案生成）

扩写是指将一篇较短的文本进行扩写的工作，比如一套指示或者一个主题列表，生成一个较长的文本，如电子邮件或者文章。


例子：通过一名客户对于产品的评论生成一封回复邮件
```
你是一个客户服务的AI助理，你的任务是给一个有价值的客户发送电子邮件回复。
邮件的内容需要基于用户的评价，如果用户的情绪是积极的或者中性的，感谢他们的评论，如果情绪是负面的，则表示歉意，并建议他们可以联系客服。
确保使用用户评论中的具体细节。
用简明和专业的语气来写。
在邮件中署名：“AI 客户代理”


客户的评论："他们在11月份仍在季节性销售中以约49美元的价格销售17件套装，折扣约为一半，但出于某些原因（称其为价格抬高），到了12月的第二周，同样的系统的价格都涨到了约70-89美元左右。 11件套装的价格也比之前的29美元涨了大约10美元左右。 看起来还不错，但如果您看底座，锁定刀片的部分看起来与几年前的先前版本不太一样，但我打算非常小心（例如，我将像豆子，冰，米饭等非常硬的物品先放入搅拌机中压碎，然后把它们粉碎成我想要的食用量，然后切换到搅拌餐的鞭打刀，以获得更细的面粉，并在制作冰沙时先使用交叉切割刀，然后如果需要更细/较少纤维的话，再使用平刀）。制作冰沙的特殊提示：将要使用的水果和蔬菜切碎并冷冻（如果使用菠菜-轻轻煮软菠菜然后冷冻直到使用-如果制作雪泥，请使用小到中型食品处理器），以此来避免添加掉太多冰块。大约一年后，马达发出奇怪的噪音。我打电话给客服，但保修已经过期了，所以我不得不再买一个。 FYI：这些产品的整体质量已经下降，所以他们在品牌认知和消费者忠诚度上进行营销。大约两天后收到了产品。"
```

![](images/posts/Pasted%20image%2020230507104526.png)


### temperature
temperature 作为模型的一个参数，将影响模型输出的随机性

![](images/posts/Pasted%20image%2020230507104808.png)

显然：越低 temperature 意味着越高可靠性，越高 temperature 意味着越高创意性


## 八、聊天机器人

待补充...


---

1. 《ChatGPT Prompt Engineering for Developers》. 见于 2023年5月7日. [https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/).
2. 二次元的Datawhale. 《【专业翻译，配套代码笔记】01.课程介绍_哔哩哔哩_bilibili》. 见于 2023年5月7日. [https://www.bilibili.com/video/BV1Bo4y1A7FU/](https://www.bilibili.com/video/BV1Bo4y1A7FU/).

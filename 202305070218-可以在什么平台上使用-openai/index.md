# 可以在什么平台上使用 openai

<!--more-->

#ChatGPT 

## 一、使用 jupyter notebook
前置：
- 安装 python
- 安装 jupyter notebook


加载环境、定义方法：
```python
import openai
import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

openai.api_key  = 'sk-xxxxx'

def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]
```

使用时传入 prompt 参数：
```python
prompt = f"""
She no went to the market

上面这句英文存在什么样的语法错误
"""

response = get_completion(prompt)
print(response)
```

> 效果：
![](images/posts/Pasted%20image%2020230507022253.png)

在线演示：[https://learn.deeplearning.ai/chatgpt-prompt-eng/lesson/2/guidelines](https://learn.deeplearning.ai/chatgpt-prompt-eng/lesson/2/guidelines)




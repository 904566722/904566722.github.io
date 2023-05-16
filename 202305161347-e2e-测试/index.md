# E2E 测试

<!--more-->
#测试 

## 一、什么是 E2E 测试？

[E2E]^(End to End) ：端到端测试，模拟一个从开始到结束的流程，验证是否符合预期

比如，在一套运行的 openshift 环境上面运行测试，一系列定义好的操作链

## 二、如何进行 E2E 测试

假设在 openshift 的环境上执行 e2e 测试

### 2.1 编译 e2e 执行文件

> https://github.com/openshift/origin 
> 
> 可以参考该文档来查看如何进行 openshift e2e 的操作：https://github.com/openshift/origin/blob/master/test/extended/README.md 

在编写完成自己的 e2e 测试用例之后，执行编译操作，生成测试文件

```sh
# 执行编译操作，生成测试文件
make WHAT=cmd/openshift-tests
```

## 2.2 在环境上运行

1. 准备一个用于测试的 OpenShift 环境（这个环境应该与生产环境尽可能相似，确保测试结果的准确性）
2. 在 OpenShift 环境上安装应用（需要的话，比如一些 Application Operator，可能是测试用例需要依赖的）
3. 执行二进制文件

e.g.
```sh
# 执行所有并行用例
./openshift-tests run openshift/conformance/parallel --from-repository "image.cestc.cn/ccos-test/community-e2e-images"  --provider '{"type":"local"}' -o e2e$(date "+%Y%m%d%H%M%S")-cluster-paraller.log --junit-dir junit

# 执行所有串行用例
./openshift-tests run openshift/conformance/serial --from-repository "image.cestc.cn/ccos-test/community-e2e-images"  --provider '{"type":"local"}' -o e2e$(date "+%Y%m%d%H%M%S")-cluster-serial.log --junit-dir junit

# 指定文件执行用例
./openshift-tests run -f minimal-serial.txt --from-repository "image.cestc.cn/ccos-test/community-e2e-images" --provider  '{"type":"local"}' --output-file=./single-e2e-test-serial-\${date}.log --junit-dir=./
```

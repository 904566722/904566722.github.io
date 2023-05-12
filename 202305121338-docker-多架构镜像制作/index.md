# Docker 多架构镜像制作

<!--more-->
#docker

```
docker pull alpine:latest --platform=linux/arm64 # 指定镜像架构
docker inspect 镜像
```

```sh
# arm64
docker pull alpine:latest --platform=linux/arm64
docker tag alpine:latest  image.cestc.cn/ceake/alpine:latest-arm64
docker push image.cestc.cn/ceake/alpine:latest-arm64
# amd64
docker pull alpine:latest --platform=linux/amd64
docker tag alpine:latest  image.cestc.cn/ceake/alpine:latest-amd64
docker push image.cestc.cn/ceake/alpine:latest-amd64
# manifest create
docker manifest create --insecure  image.cestc.cn/ceake/alpine:latest-multiArch image.cestc.cn/ceake/alpine-arm64:latest  image.cestc.cn/ceake/alpine-amd64:latest
# mark arm & amd
docker  manifest annotate --arch "arm64" image.cestc.cn/ceake/alpine:latest-multiArch image.cestc.cn/ceake/alpine-arm64:latest
docker manifest annotate --arch "amd64" image.cestc.cn/ceake/alpine:latest-multiArch image.cestc.cn/ceake/alpine-amd64:latest
# manifest push multi-arch image
docker manifest push image.cestc.cn/ceake/alpine:latest-multiArch
```




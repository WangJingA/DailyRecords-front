# 基础镜像使用Nginx
FROM nginx
# 作者
MAINTAINER hzx
# 添加时区环境变量，亚洲，上海
ENV TimeZone=Asia/Shanghai
# 将前端dist文件中的内容复制到nginx目录
COPY dist  /usr/share/nginx/html/
# 用本地的nginx配置文件覆盖镜像的Nginx配置
COPY default.conf /etc/nginx/conf.d
# 暴露端口
EXPOSE 80
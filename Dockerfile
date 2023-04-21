# 使用官方 Node.js 镜像作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码到工作目录
COPY app.js ./app.js

# 暴露端口
EXPOSE ${PORT}

# 挂载关键词文件
VOLUME ["/app/keywords.txt"]

# 运行应用
CMD [ "node", "app.js" ]
# 使用 Node 官方镜像
FROM node:latest

# 创建并设置工作目录
WORKDIR /app

# 拷贝 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝所有项目文件
COPY . .

# 构建 Strapi Admin UI（生产环境时必须）
RUN npm run dev

# 暴露端口
EXPOSE 1337

# 启动服务
CMD ["npm", "start"]

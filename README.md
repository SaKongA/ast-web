# 亚洲科学技术研究院官网

这是亚洲科学技术研究院(ASTI)的官方网站前端项目，采用HTML、CSS和JavaScript构建，使用Node.js托管，并通过API连接到Strapi后端。

## 特点

- 响应式设计，适配各种设备
- 暗色主题，展现高级感
- 与Strapi后端无缝集成
- 模块化组件结构

## 页面

- 首页 - 展示研究院概况和最新动态
- 学术会议 - 展示研究院举办和参与的学术会议
- 科研成果 - 展示研究院的科研进展和成果
- 国际合作 - 展示研究院与国际机构的合作项目
- 关于亚科院 - 展示研究院的详细介绍、领导团队等信息
- 联系我们 - 提供联系方式和联系表单

## 安装

1. 克隆项目:

```bash
git clone <repository-url>
cd asti-website
```

2. 安装依赖:

```bash
npm install
```

## 使用

### 开发模式

```bash
npm run dev
```

### 生产模式

```bash
npm start
```

服务器将在 http://localhost:3000 启动。

## 后端配置

项目假设Strapi后端运行在 http://localhost:1337。如需修改后端地址，请编辑`server.js`文件中的代理配置：

```javascript
const apiProxy = createProxyMiddleware('/api', {
  target: 'http://your-backend-url', // 修改为你的后端地址
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
  },
});
```

## 项目结构

```
/
├── components/          # 公共组件
│   ├── Api.js           # API请求工具
│   ├── Footer.js        # 页脚组件
│   └── Navbar.js        # 导航栏组件
├── pages/               # 页面
│   ├── index.html       # 首页
│   ├── conferences.html # 学术会议
│   ├── research.html    # 科研成果
│   ├── collaboration.html # 国际合作
│   ├── about.html       # 关于亚科院
│   └── contact.html     # 联系我们
├── public/              # 静态资源
│   └── images/          # 图片资源
├── styles/              # 样式文件
│   └── global.css       # 全局样式
├── server.js            # 服务器文件
└── package.json         # 项目配置
```

## API路径

项目使用以下API端点：

- `/api/abouts` - 获取关于研究院的信息
- `/api/conferences` - 获取会议信息
- `/api/contacts` - 获取联系方式
- `/api/researchs` - 获取科研成果

## 依赖项

- Express.js - Web服务器框架
- http-proxy-middleware - API代理中间件
- Nodemon (开发依赖) - 自动重启服务器 
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// 使用静态文件中间件
app.use(express.static(path.join(__dirname, '/')));

// 提供静态文件
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'components')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'public')));

// 提供node_modules中的marked库
app.use('/marked', express.static(path.join(__dirname, 'node_modules', 'marked', 'lib')));

// API代理中间件，转发所有/api请求到Strapi后端
const apiProxy = createProxyMiddleware('/api', {
  target: 'http://localhost:1337', // Strapi默认端口，根据实际部署环境修改
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // 不需要重写路径
  },
});

app.use('/api', apiProxy);

// 为所有路由提供index.html，支持客户端路由
app.get('*', (req, res) => {
  // 检查请求是否是HTML页面
  const requestPath = req.path === '/' ? '/index.html' : req.path;
  const filePath = path.join(__dirname, 'pages', requestPath);
  
  // 首先尝试提供对应的HTML文件
  res.sendFile(filePath, (err) => {
    if (err) {
      // 如果找不到对应文件，则提供首页
      res.sendFile(path.join(__dirname, 'pages', 'index.html'));
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器已启动，运行在 http://localhost:${PORT}`);
}); 
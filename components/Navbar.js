// Navbar.js - 导航组件
document.addEventListener('DOMContentLoaded', function() {
  // 获取导航栏元素
  const navbar = document.querySelector('.navbar');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  // 滚动时导航栏样式变化
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
  
  // 设置当前页面导航项高亮
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-menu a');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || 
        (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });
});

// 渲染导航栏的函数
function renderNavbar() {
  return `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-logo">
          <img src="/images/logo.png" alt="亚洲科学技术研究院" style="width: 40px; height: 40px; border-radius: 4px;">
          <h1 style="color: var(--text-primary);">亚洲科学技术研究院</h1>
        </div>
        <ul class="navbar-menu">
          <li><a href="/" class="${isActive('index')}" style="color: var(--text-primary);">首页</a></li>
          <li><a href="/conferences.html" class="${isActive('conferences')}" style="color: var(--text-primary);">学术会议</a></li>
          <li><a href="/research.html" class="${isActive('research')}" style="color: var(--text-primary);">科研成果</a></li>
          <li><a href="/collaboration.html" class="${isActive('collaboration')}" style="color: var(--text-primary);">国际合作</a></li>
          <li><a href="/about.html" class="${isActive('about')}" style="color: var(--text-primary);">关于亚科院</a></li>
          <li><a href="/contact.html" class="${isActive('contact')}" style="color: var(--text-primary);">联系我们</a></li>
        </ul>
      </div>
    </nav>
  `;
}

// 判断当前页面是否活动
function isActive(page) {
  const path = window.location.pathname;
  if (page === 'index' && (path === '/' || path === '/index.html')) {
    return 'active';
  }
  return path.includes(page) ? 'active' : '';
}

// 导出函数用于其他页面引用
window.renderNavbar = renderNavbar; 
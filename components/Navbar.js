// Navbar.js - 导航组件
document.addEventListener('DOMContentLoaded', function() {
  // 初始化导航栏
  initializeNavbar();
});

// 初始化导航栏
function initializeNavbar() {
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
  
  // 汉堡菜单点击事件
  const hamburger = document.querySelector('.hamburger-menu');
  if (hamburger && navbarMenu) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navbarMenu.classList.toggle('active');
      
      // 当菜单打开时，禁止页面滚动
      if (navbarMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }
  
  // 点击导航链接后，如果在移动设备上，关闭菜单
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('active');
        navbarMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

// 渲染导航栏的函数
function renderNavbar() {
  return `
    <nav class="navbar">
      <div class="navbar-container">
        <a href="/" class="navbar-logo" style="text-decoration: none;">
          <img src="/images/logo.png" alt="亚洲科学技术研究院" style="width: 35px; height: 35px; border-radius: 4px;">
          <h1 style="color: var(--text-primary); font-size: 1.2rem;">亚洲科学技术研究院</h1>
        </a>
        
        <!-- 汉堡菜单 -->
        <div class="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <ul class="navbar-menu">
          <li><a href="/" class="${isActive('index')}">首页</a></li>
          <li><a href="/conferences.html" class="${isActive('conferences')}">学术会议</a></li>
          <li><a href="/research.html" class="${isActive('research')}">科研成果</a></li>
          <li><a href="/collaboration.html" class="${isActive('collaboration')}">国际合作</a></li>
          <li><a href="/about.html" class="${isActive('about')}">关于亚科院</a></li>
          <li><a href="/contact.html" class="${isActive('contact')}">联系我们</a></li>
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

// DOM装载完成后初始化导航栏事件
document.addEventListener('DOMContentLoaded', function() {
  // 装载导航栏
  if (document.getElementById('navbar-container')) {
    document.getElementById('navbar-container').innerHTML = renderNavbar();
    // 初始化导航栏事件
    setTimeout(initializeNavbar, 0);
  }
}); 
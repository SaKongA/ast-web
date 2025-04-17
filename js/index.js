/**
 * 首页脚本
 * 包含首页所有交互功能
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
  // 初始化导航栏和页脚
  document.getElementById('navbar-container').innerHTML = renderNavbar();
  document.getElementById('footer-container').innerHTML = renderFooter();
  
  // 预加载背景
  preloadBackgroundMedia();
  
  // 加载数据
  await Promise.all([loadAboutData(), loadNewsData()]);
  
  // 添加导航栏滚动效果
  initNavbarScroll();
});

/**
 * 加载背景媒体（图片和视频）
 */
function preloadBackgroundMedia() {
  // 预加载背景图片
  const bgImage = new Image();
  bgImage.src = '/images/index-bg.jpg';
  bgImage.onload = function() {
    const bgElement = document.querySelector('.banner-bg');
    if (bgElement) {
      bgElement.classList.add('loaded');
    }
  };
  
  // 加载视频背景
  loadVideoBackground();
}

/**
 * 加载视频背景
 */
function loadVideoBackground() {
  const video = document.querySelector('.banner-video');
  const fallbackBg = document.querySelector('.fallback-bg');
  
  if (!video) return;
  
  // 检查设备是否可能是移动设备或平板设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 检查网络状态
  const isSlowConnection = navigator.connection && 
    (navigator.connection.saveData || 
    (navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g')));
  
  // 在移动设备或慢网络情况下直接显示背景图片
  if (isMobile && window.innerWidth < 768 || isSlowConnection) {
    video.style.display = 'none';
    if (fallbackBg) {
      fallbackBg.classList.add('visible');
    }
    return;
  }
  
  // 设置加载超时时间
  const videoTimeout = setTimeout(function() {
    // 如果视频还没有加载完成，显示背景图片
    if (!video.classList.contains('loaded')) {
      console.log('视频加载超时，显示备用背景');
      video.style.display = 'none';
      if (fallbackBg) {
        fallbackBg.classList.add('visible');
      }
    }
  }, 8000); // 增加到8秒的超时
  
  // 视频加载事件
  video.addEventListener('loadeddata', function() {
    clearTimeout(videoTimeout);
    video.classList.add('loaded');
    console.log('视频背景已成功加载');
  });
  
  // 视频加载错误处理
  video.addEventListener('error', function(e) {
    console.error('视频加载失败', e);
    clearTimeout(videoTimeout);
    video.style.display = 'none';
    if (fallbackBg) {
      fallbackBg.classList.add('visible');
    }
  });
  
  // 强制触发视频加载 - 解决某些浏览器不自动加载问题
  video.load();
}

/**
 * 导航栏滚动效果
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
}

/**
 * 获取和显示研究院介绍
 */
async function loadAboutData() {
  try {
    const aboutData = await API.fetchAbout();
    if (aboutData && aboutData.data && aboutData.data.length > 0) {
      const introduction = aboutData.data[0].introduction;
      // 只显示前两句话作为简介
      const sentences = introduction.split('。').filter(s => s.trim());
      const shortIntro = sentences.slice(0, 2).join('。') + '。';
      document.getElementById('institute-intro').textContent = shortIntro;
    }
  } catch (error) {
    console.error('获取研究院介绍数据失败:', error);
  }
}

/**
 * 获取并显示最新会议和科研成果
 */
async function loadNewsData() {
  try {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;
    
    newsContainer.innerHTML = ''; // 清空容器
    
    // 获取会议数据和科研成果数据
    const [conferencesData, researchData] = await Promise.all([
      API.fetchConferences(),
      API.fetchResearch()
    ]);
    
    // 合并并按日期排序
    let allNews = [];
    
    if (conferencesData && conferencesData.data) {
      allNews = [...allNews, ...conferencesData.data.map(item => ({
        ...item,
        type: 'conference',
        url: `/pages/conference-detail.html?id=${item.id}`
      }))];
    }
    
    if (researchData && researchData.data) {
      allNews = [...allNews, ...researchData.data.map(item => ({
        ...item,
        type: 'research',
        url: `/pages/research-detail.html?id=${item.id}`
      }))];
    }
    
    // 按日期排序，取最近的3条
    allNews.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    allNews = allNews.slice(0, 3);
    
    if (allNews.length === 0) {
      newsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">暂无数据</p>';
      return;
    }
    
    // 创建新闻卡片
    allNews.forEach(item => {
      const dateDisplay = API.formatDate(item.date || item.createdAt);
      const typeName = item.type === 'conference' ? '学术会议' : '科研成果';
      const tagClass = item.type === 'conference' ? 'tag-conference' : 'tag-research';
      
      const cardHtml = `
        <div class="news-card">
          <span class="news-tag ${tagClass}">${typeName}</span>
          <p class="news-date">${dateDisplay}</p>
          <h3 class="news-title">${item.title}</h3>
          <a href="${item.url}" class="news-link">查看详情 <i class="fas fa-arrow-right"></i></a>
        </div>
      `;
      newsContainer.innerHTML += cardHtml;
    });
  } catch (error) {
    console.error('获取最新动态数据失败:', error);
    // 显示错误信息
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
      newsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--text-tertiary);">加载数据失败，请稍后再试</p>';
    }
  }
} 
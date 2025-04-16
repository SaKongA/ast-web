document.addEventListener('DOMContentLoaded', function() {
  // 初始化导航栏和页脚
  document.getElementById('navbar-container').innerHTML = renderNavbar();
  document.getElementById('footer-container').innerHTML = renderFooter();
  
  // 预加载背景图片
  preloadBackgroundImage();
  
  // 加载科研成果数据
  loadResearch();
  
  // 设置分类筛选功能
  setupCategoryFilter();
  
  // 设置搜索功能
  setupSearch();
});

// 预加载背景图片
function preloadBackgroundImage() {
  const bgImage = new Image();
  bgImage.src = '/images/research-bg.jpg';
  bgImage.onload = function() {
    const headerBg = document.querySelector('.header-bg-image');
    if (headerBg) {
      headerBg.classList.add('loaded');
    }
  };
}

// 设置分类筛选功能
function setupCategoryFilter() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  if (!categoryButtons.length) return;
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有按钮的active类
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // 给当前点击的按钮添加active类
      this.classList.add('active');
      
      // 获取分类值
      const category = this.dataset.category;
      
      // 筛选科研成果
      filterResearchByCategory(category);
    });
  });
}

// 设置搜索功能
function setupSearch() {
  const searchInput = document.getElementById('research-search');
  if (!searchInput) return;
  
  let debounceTimeout;
  
  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const query = this.value.trim().toLowerCase();
      searchResearch(query);
    }, 300); // 300ms防抖
  });
}

// 加载科研成果数据
function loadResearch() {
  // 显示加载中状态
  const researchGrid = document.querySelector('.research-grid');
  if (researchGrid) {
    researchGrid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 正在加载科研成果数据...</div>';
  }
  
  API.fetchResearch()
    .then(data => {
      if (!data || !data.data || !Array.isArray(data.data)) {
        throw new Error('无效的科研成果数据');
      }
      
      // 存储所有科研成果数据，方便后续筛选
      window.allResearch = data.data;
      
      // 渲染科研成果
      renderResearch(data.data);
    })
    .catch(error => {
      console.error('获取科研成果数据失败:', error);
      
      if (researchGrid) {
        researchGrid.innerHTML = `
          <div class="no-research">
            <i class="fas fa-exclamation-circle"></i>
            <p>加载科研成果数据失败，请稍后再试</p>
          </div>
        `;
      }
    });
}

// 根据分类筛选科研成果
function filterResearchByCategory(category) {
  if (!window.allResearch) return;
  
  // 获取搜索框的值
  const searchInput = document.getElementById('research-search');
  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  
  // 如果搜索框不为空，则先按关键词搜索后再筛选分类
  if (searchQuery) {
    return searchResearch(searchQuery, category);
  }
  
  // 如果选择"全部"，则显示所有科研成果
  if (category === 'all') {
    renderResearch(window.allResearch);
    return;
  }
  
  // 按分类筛选科研成果
  const filteredData = window.allResearch.filter(research => {
    return research.category === category;
  });
  
  renderResearch(filteredData);
}

// 根据关键词搜索科研成果
function searchResearch(query, category = null) {
  if (!window.allResearch) return;
  
  // 如果搜索框为空，则只按分类筛选
  if (!query) {
    const activeCategory = category || document.querySelector('.category-btn.active')?.dataset.category || 'all';
    return filterResearchByCategory(activeCategory);
  }
  
  // 先按分类筛选
  let filteredData = window.allResearch;
  if (category && category !== 'all') {
    filteredData = window.allResearch.filter(research => research.category === category);
  } else {
    // 如果没有指定分类，则获取当前激活的分类
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category;
    if (activeCategory && activeCategory !== 'all') {
      filteredData = window.allResearch.filter(research => research.category === activeCategory);
    }
  }
  
  // 再按关键词搜索
  filteredData = filteredData.filter(research => {
    return (
      research.title.toLowerCase().includes(query) || 
      research.author.toLowerCase().includes(query) || 
      research.summary.toLowerCase().includes(query) ||
      (research.content && research.content.toLowerCase().includes(query))
    );
  });
  
  renderResearch(filteredData);
}

// 渲染科研成果
function renderResearch(researchData) {
  const researchGrid = document.querySelector('.research-grid');
  if (!researchGrid) return;
  
  // 如果没有数据，显示无数据信息
  if (!researchData || researchData.length === 0) {
    researchGrid.innerHTML = `
      <div class="no-research">
        <i class="fas fa-search"></i>
        <p>暂无符合条件的科研成果数据</p>
      </div>
    `;
    return;
  }
  
  // 渲染科研成果卡片
  const researchHTML = researchData.map(research => {
    // 格式化日期
    const formattedDate = formatDate(research.date);
    
    // 截取摘要，最多显示150个字符
    const summary = research.summary.length > 150 
      ? research.summary.substring(0, 150) + '...' 
      : research.summary;
    
    return `
      <div class="research-item">
        <div class="research-header">
          <h3 class="research-title">${research.title}</h3>
          <div class="research-meta">
            <div class="research-author">
              <i class="fas fa-user"></i> ${research.author}
            </div>
            <div class="research-date">
              <i class="far fa-calendar-alt"></i> ${formattedDate}
            </div>
          </div>
        </div>
        <div class="research-body">
          <div class="research-summary">${summary}</div>
          <a href="/research-details.html?id=${research.id}" class="btn-detail">
            查看详情 <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');
  
  researchGrid.innerHTML = researchHTML;
}

// 格式化日期函数
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
} 
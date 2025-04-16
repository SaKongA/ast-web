document.addEventListener('DOMContentLoaded', function() {
  // 初始化导航栏和页脚
  document.getElementById('navbar-container').innerHTML = renderNavbar();
  document.getElementById('footer-container').innerHTML = renderFooter();
  
  // 初始化会议数据
  initConferences();
  preloadBackgroundImage(); // 预加载背景图片
});

// 全局变量
let allConferences = [];
let filteredConferences = [];
let currentPage = 1;
const itemsPerPage = 6;

// 初始化会议数据
async function initConferences() {
  try {
    const conferencesData = await API.fetchConferences();
    
    if (!conferencesData || !conferencesData.data || conferencesData.data.length === 0) {
      showNoConferences();
      return;
    }
    
    // 存储所有会议数据
    allConferences = conferencesData.data.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return dateB - dateA;
    });
    
    // 初始应用筛选
    filteredConferences = [...allConferences];
    
    // 填充年份筛选
    populateYearFilter();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 渲染会议和分页
    renderConferences();
    renderPagination();
    
  } catch (error) {
    console.error('加载会议数据出错:', error);
    showError('加载会议信息出错，请稍后再试');
  }
}

// 填充年份筛选下拉菜单
function populateYearFilter() {
  const yearSelect = document.getElementById('year-select');
  const years = new Set();
  
  allConferences.forEach(conference => {
    const date = new Date(conference.date || conference.createdAt);
    years.add(date.getFullYear());
  });
  
  const sortedYears = Array.from(years).sort((a, b) => b - a);
  
  sortedYears.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });
}

// 设置事件监听器
function setupEventListeners() {
  // 搜索框
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', debounce(filterConferences, 300));
  
  // 年份过滤器
  const yearSelect = document.getElementById('year-select');
  yearSelect.addEventListener('change', filterConferences);
}

// 过滤会议数据
function filterConferences() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  const selectedYear = document.getElementById('year-select').value;
  
  filteredConferences = allConferences.filter(conference => {
    // 搜索过滤
    const matchesSearch = 
      !searchTerm || 
      conference.title.toLowerCase().includes(searchTerm) ||
      (conference.summary && conference.summary.toLowerCase().includes(searchTerm)) ||
      (conference.content && conference.content.toLowerCase().includes(searchTerm)) ||
      (conference.author && conference.author.toLowerCase().includes(searchTerm));
    
    // 年份过滤
    const conferenceDate = new Date(conference.date || conference.createdAt);
    const conferenceYear = conferenceDate.getFullYear();
    const matchesYear = selectedYear === 'all' || conferenceYear === parseInt(selectedYear);
    
    return matchesSearch && matchesYear;
  });
  
  // 重置到第一页并重新渲染
  currentPage = 1;
  renderConferences();
  renderPagination();
}

// 渲染会议数据
function renderConferences() {
  const conferencesContainer = document.getElementById('conferences-container');
  conferencesContainer.innerHTML = '';
  
  if (filteredConferences.length === 0) {
    showNoConferences();
    return;
  }
  
  // 计算当前页的会议
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredConferences.length);
  const currentPageConferences = filteredConferences.slice(startIndex, endIndex);
  
  currentPageConferences.forEach(conference => {
    const formattedDate = API.formatDate(conference.date || conference.createdAt);
    
    const conferenceElement = document.createElement('div');
    conferenceElement.className = 'conference-item';
    conferenceElement.innerHTML = `
      <div class="conference-header">
        <h2 class="conference-title">${conference.title}</h2>
        <div class="conference-meta">
          <p class="conference-author"><i class="far fa-user"></i> ${conference.author || '未知作者'}</p>
          <p class="conference-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
        </div>
      </div>
      <div class="conference-body">
        <p class="conference-summary">${conference.summary || ''}</p>
        <a href="/pages/conference-detail.html?id=${conference.id}" class="btn-detail">
          查看详情 <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;
    
    conferencesContainer.appendChild(conferenceElement);
  });
}

// 渲染分页控件
function renderPagination() {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';
  
  if (filteredConferences.length === 0) {
    return;
  }
  
  const totalPages = Math.ceil(filteredConferences.length / itemsPerPage);
  
  if (totalPages <= 1) {
    return;
  }
  
  // 添加上一页按钮
  const prevBtn = document.createElement('button');
  prevBtn.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderConferences();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  paginationContainer.appendChild(prevBtn);
  
  // 添加页码按钮
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderConferences();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationContainer.appendChild(pageBtn);
  }
  
  // 添加下一页按钮
  const nextBtn = document.createElement('button');
  nextBtn.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderConferences();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  paginationContainer.appendChild(nextBtn);
}

// 显示无会议信息
function showNoConferences() {
  const conferencesContainer = document.getElementById('conferences-container');
  conferencesContainer.innerHTML = '<div class="no-conferences">暂无符合条件的会议信息</div>';
  
  // 清空分页
  document.getElementById('pagination').innerHTML = '';
}

// 显示错误信息
function showError(message) {
  const conferencesContainer = document.getElementById('conferences-container');
  conferencesContainer.innerHTML = `<div class="no-conferences">${message}</div>`;
  
  // 清空分页
  document.getElementById('pagination').innerHTML = '';
}

// 防抖函数
function debounce(func, delay) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// 预加载背景图片
function preloadBackgroundImage() {
  const headerBgImage = document.querySelector('.header-bg-image');
  if (headerBgImage) {
    setTimeout(() => {
      headerBgImage.classList.add('loaded');
    }, 100);
  }
} 
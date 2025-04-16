// 初始化导航栏和页脚
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('navbar-container').innerHTML = renderNavbar();
  document.getElementById('footer-container').innerHTML = renderFooter();
  
  // 获取科研成果详情
  loadResearchDetails();
});

// 从URL获取科研成果ID
function getResearchId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// 加载科研成果详情数据
async function loadResearchDetails() {
  const researchId = getResearchId();
  const researchContainer = document.getElementById('research-container');
  
  // 如果没有ID参数，显示错误
  if (!researchId) {
    showError('未指定科研成果ID，请返回科研成果列表页面选择一个科研成果');
    return;
  }
  
  try {
    // 先尝试使用单个科研成果API
    let research = null;
    try {
      const researchData = await API.fetchResearchById(researchId);
      if (researchData && researchData.data) {
        research = researchData.data;
      }
    } catch (e) {
      console.log('单个科研成果API不可用，将回退到获取所有科研成果');
    }
    
    // 如果单个科研成果API不可用，回退到获取所有科研成果
    if (!research) {
      const researchsData = await API.fetchResearch();
      
      if (!researchsData || !researchsData.data || researchsData.data.length === 0) {
        showError('获取科研成果数据失败');
        return;
      }
      
      // 查找指定ID的科研成果
      research = researchsData.data.find(r => r.id === parseInt(researchId));
    }
    
    if (!research) {
      showError('找不到指定ID的科研成果');
      return;
    }
    
    // 渲染科研成果详情
    renderResearchDetails(research);
    
  } catch (error) {
    console.error('加载科研成果详情失败:', error);
    showError('加载科研成果详情时出错，请稍后再试');
  }
}

// 渲染科研成果详情
function renderResearchDetails(research) {
  const researchContainer = document.getElementById('research-container');
  const formattedDate = research.date ? API.formatDate(research.date) : API.formatDate(research.createdAt);
  
  // 使用API的formatContent方法处理内容
  const formattedContent = API.formatContent(research.content);
  
  const detailsHTML = `
    <div class="research-container">
      <div class="research-header">
        <h2 class="research-title">${research.title}</h2>
        <div class="research-meta">
          <div class="meta-item">
            <i class="far fa-user"></i>
            <span>${research.author || '未知作者'}</span>
          </div>
          <div class="meta-item">
            <i class="far fa-clock"></i>
            <span>发布于 ${API.formatDate(research.publishedAt || research.createdAt)}</span>
          </div>
        </div>
        <div class="research-summary">
          ${research.summary || ''}
        </div>
      </div>
      <div class="research-body">
        <div class="research-content">
          ${formattedContent}
        </div>
        <div class="action-buttons">
          <a href="/pages/research.html" class="btn btn-back">
            <i class="fas fa-arrow-left"></i> 返回科研成果列表
          </a>
          <button class="btn btn-share" onclick="shareResearch()">
            <i class="fas fa-share-alt"></i> 分享
          </button>
        </div>
      </div>
    </div>
  `;
  
  researchContainer.innerHTML = detailsHTML;
  
  // 更新页面标题
  document.title = `${research.title} - 亚洲科学技术研究院`;
  
  // 应用代码高亮
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
}

// 显示错误消息
function showError(message) {
  const researchContainer = document.getElementById('research-container');
  researchContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <a href="/pages/research.html" class="btn btn-back" style="margin-top: 20px;">
        <i class="fas fa-arrow-left"></i> 返回科研成果列表
      </a>
    </div>
  `;
}

// 分享功能
function shareResearch() {
  const researchId = getResearchId();
  const shareUrl = `${window.location.origin}/pages/research-detail.html?id=${researchId}`;
  
  // 检查是否支持网页分享API
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: shareUrl
    })
    .catch(error => {
      console.error('分享失败:', error);
      fallbackShare(shareUrl);
    });
  } else {
    fallbackShare(shareUrl);
  }
}

// 备用分享方法 - 复制链接到剪贴板
function fallbackShare(url) {
  // 创建临时输入框
  const tempInput = document.createElement('input');
  tempInput.value = url;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  // 显示提示
  alert('链接已复制到剪贴板');
} 
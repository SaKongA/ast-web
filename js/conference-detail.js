// 初始化导航栏和页脚
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('navbar-container').innerHTML = renderNavbar();
  document.getElementById('footer-container').innerHTML = renderFooter();
  
  // 获取会议详情
  loadConferenceDetails();
});

// 从URL获取会议ID
function getConferenceId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// 加载会议详情数据
async function loadConferenceDetails() {
  const conferenceId = getConferenceId();
  const conferenceContainer = document.getElementById('conference-container');
  
  // 如果没有ID参数，显示错误
  if (!conferenceId) {
    showError('未指定会议ID，请返回会议列表页面选择一个会议');
    return;
  }
  
  try {
    // 先尝试使用单个会议API
    let conference = null;
    try {
      const conferenceData = await API.fetchConferenceById(conferenceId);
      if (conferenceData && conferenceData.data) {
        conference = conferenceData.data;
      }
    } catch (e) {
      console.log('单个会议API不可用，将回退到获取所有会议');
    }
    
    // 如果单个会议API不可用，回退到获取所有会议
    if (!conference) {
      const conferencesData = await API.fetchConferences();
      
      if (!conferencesData || !conferencesData.data || conferencesData.data.length === 0) {
        showError('获取会议数据失败');
        return;
      }
      
      // 查找指定ID的会议
      conference = conferencesData.data.find(conf => conf.id === parseInt(conferenceId));
    }
    
    if (!conference) {
      showError('找不到指定ID的会议');
      return;
    }
    
    // 渲染会议详情
    renderConferenceDetails(conference);
    
  } catch (error) {
    console.error('加载会议详情失败:', error);
    showError('加载会议详情时出错，请稍后再试');
  }
}

// 渲染会议详情
function renderConferenceDetails(conference) {
  const conferenceContainer = document.getElementById('conference-container');
  const formattedDate = API.formatDate(conference.date || conference.createdAt);
  
  // 处理内容段落 - 对会议详情页使用传统的非Markdown格式
  const formattedContent = API.formatContent(conference.content, true); // 第二个参数为true，强制使用传统格式
  
  const detailsHTML = `
    <div class="conference-container">
      <div class="conference-header">
        <h2 class="conference-title">${conference.title}</h2>
        <div class="conference-meta">
          <div class="meta-item">
            <i class="far fa-calendar-alt"></i>
            <span>${formattedDate}</span>
          </div>
          <div class="meta-item">
            <i class="far fa-user"></i>
            <span>${conference.author || '未知作者'}</span>
          </div>
          <div class="meta-item">
            <i class="far fa-clock"></i>
            <span>发布于 ${API.formatDate(conference.publishedAt || conference.createdAt)}</span>
          </div>
        </div>
        <div class="conference-summary">
          ${conference.summary || ''}
        </div>
      </div>
      <div class="conference-body">
        <div class="conference-content">
          ${formattedContent}
        </div>
        <div class="action-buttons">
          <a href="/pages/conferences.html" class="btn btn-back">
            <i class="fas fa-arrow-left"></i> 返回会议列表
          </a>
          <button class="btn btn-share" onclick="shareConference()">
            <i class="fas fa-share-alt"></i> 分享
          </button>
        </div>
      </div>
    </div>
  `;
  
  conferenceContainer.innerHTML = detailsHTML;
  
  // 更新页面标题
  document.title = `${conference.title} - 亚洲科学技术研究院`;
  
  // 应用代码高亮
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
}

// 显示错误消息
function showError(message) {
  const conferenceContainer = document.getElementById('conference-container');
  conferenceContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <a href="/pages/conferences.html" class="btn btn-back" style="margin-top: 20px;">
        <i class="fas fa-arrow-left"></i> 返回会议列表
      </a>
    </div>
  `;
}

// 分享功能
function shareConference() {
  const conferenceId = getConferenceId();
  const shareUrl = `${window.location.origin}/pages/conference-detail.html?id=${conferenceId}`;
  
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
document.addEventListener('DOMContentLoaded', function() {
  // 初始化导航栏和页脚
  document.getElementById('navbar-container').innerHTML = renderNavbar();
  document.getElementById('footer-container').innerHTML = renderFooter();
  
  // 加载联系信息
  loadContactData();
  
  // 初始化动画
  initAnimations();
  
  // 预加载背景图片
  preloadBackgroundImage();
});

// 预加载背景图片
function preloadBackgroundImage() {
  const bgImage = new Image();
  bgImage.src = '/images/contact-bg.jpg';
  bgImage.onload = function() {
    const headerBg = document.querySelector('.header-bg-image');
    if (headerBg) {
      headerBg.classList.add('loaded');
    }
  };
}

// 初始化动画
function initAnimations() {
  // 让联系卡片整体先显示
  const contactCard = document.querySelector('.contact-info-full');
  if (contactCard) {
    contactCard.classList.add('animated');
  }
  
  // 地图容器动画
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    mapContainer.classList.add('animated', 'delay-5');
  }
  
  // 卡片动画会在渲染完成后初始化
}

// 加载联系信息
function loadContactData() {
  fetch('/api/contacts')
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应不正确');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.data && data.data.length > 0) {
        renderContactInfo(data.data[0]);
      } else {
        showErrorMessage('无法获取联系信息数据');
      }
    })
    .catch(error => {
      console.error('加载联系信息失败:', error);
      showErrorMessage('加载联系信息失败，请稍后再试');
    });
}

// 显示错误信息
function showErrorMessage(message) {
  const container = document.querySelector('.contact-section .container');
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
      </div>
    `;
  }
}

// 修改工作时间格式化函数，确保居中显示
function formatWorkingHours(workingHoursText) {
  if (!workingHoursText) {
    return {
      formatted: '暂无工作时间信息',
      hasHolidayNote: false
    };
  }
  
  // 移除原始字符串中的"（法定节假日除外）"
  let cleanHours = workingHoursText.replace(/（法定节假日除外）/, '').trim();
  
  // 检测是否已包含法定节假日说明
  const hasHolidayNote = workingHoursText.includes('法定节假日除外');
  
  // 分割上午和下午时间
  const timeParts = cleanHours.split(/[,，]/);
  
  // 格式化为居中显示的时间
  let formattedHours;
  if (timeParts.length >= 2) {
    formattedHours = `
      <div class="time-line"><span class="time-label">上午:</span>${timeParts[0].trim()}</div>
      <div class="time-line"><span class="time-label">下午:</span>${timeParts[1].trim()}</div>
    `;
  } else {
    // 尝试基于空格分割
    const parts = cleanHours.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      formattedHours = `
        <div class="time-line"><span class="time-label">上午:</span>${parts[0].trim()}</div>
        <div class="time-line"><span class="time-label">下午:</span>${parts[1].trim()}</div>
      `;
    } else {
      // 直接显示原始格式
      formattedHours = cleanHours;
    }
  }
  
  return {
    formatted: formattedHours,
    hasHolidayNote
  };
}

// 修改渲染联系信息函数，保留原有的地图部分，删除动态添加的地图
function renderContactInfo(data) {
  const container = document.querySelector('.contact-section .container');
  if (!container) return;
  
  // 格式化邮箱
  const emails = data.emails ? data.emails.split(/\s+/).filter(Boolean) : [];
  const emailsHtml = emails.length > 0 
    ? emails.map(email => `<a href="mailto:${email.trim()}" class="contact-link">${email.trim()}</a>`).join('<br>')
    : '<span class="no-info">暂无邮箱信息</span>';
  
  // 修改电话号码格式化逻辑
  let phonesHtml = '<span class="no-info">暂无电话信息</span>';
  
  if (data.phoneNumbers) {
    const phonePattern = /\+(\d{2,3})\s*(\d+)/g;
    const phones = {
      china: [],
      singapore: []
    };
    let match;
    
    const phoneText = data.phoneNumbers;
    while ((match = phonePattern.exec(phoneText)) !== null) {
      const countryCode = match[1];
      const number = match[2];
      
      if (countryCode === '86') {
        phones.china.push(number);
      } else if (countryCode === '65') {
        phones.singapore.push(number);
      }
    }
    
    // 格式化为居中显示的电话号码格式
    let phoneLines = [];
    
    if (phones.china.length > 0) {
      phoneLines.push(`<div class="phone-line">
        <span class="country-label">中国:</span>
        <a href="tel:+86${phones.china[0]}" class="contact-link">+86 ${phones.china[0]}</a>
      </div>`);
    }
    
    if (phones.singapore.length > 0) {
      phoneLines.push(`<div class="phone-line">
        <span class="country-label">新加坡:</span>
        <a href="tel:+65${phones.singapore[0]}" class="contact-link">+65 ${phones.singapore[0]}</a>
      </div>`);
    }
    
    if (phoneLines.length > 0) {
      phonesHtml = `<div class="phone-content">${phoneLines.join('')}</div>`;
    }
  }
  
  // 渲染工作时间卡片
  const workingHoursData = formatWorkingHours(data.workingHours || '8:00－11:30，13:30－18:00');
  
  // 修改卡片布局，创建两行，让第二行居中
  container.innerHTML = `
    <h2 class="info-title">联系方式</h2>
    
    <div class="first-row">
      <div class="contact-cards-row">
        <div class="contact-card">
          <div class="card-icon">
            <i class="fas fa-building"></i>
          </div>
          <h3 class="card-title">机构名称</h3>
          <div class="card-content">
            ${data.institutionName || '<span class="no-info">暂无机构名称</span>'}
          </div>
        </div>
        
        <div class="contact-card">
          <div class="card-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <h3 class="card-title">地址</h3>
          <div class="card-content">
            ${data.address || '<span class="no-info">暂无地址信息</span>'}
          </div>
        </div>
        
        <div class="contact-card">
          <div class="card-icon">
            <i class="fas fa-phone-alt"></i>
          </div>
          <h3 class="card-title">电话</h3>
          <div class="card-content">
            ${phonesHtml}
          </div>
        </div>
      </div>
    </div>
    
    <div class="second-row">
      <div class="contact-cards-center">
        <div class="contact-card">
          <div class="card-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <h3 class="card-title">邮箱</h3>
          <div class="card-content">
            ${emailsHtml}
          </div>
        </div>
        
        <div class="contact-card">
          <div class="card-icon">
            <i class="fas fa-clock"></i>
          </div>
          <h3 class="card-title">工作时间</h3>
          <div class="card-content">
            <div class="working-hours">
              ${workingHoursData.formatted}
            </div>
            <div class="holiday-note">（法定节假日除外）</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 确保卡片显示正确，无动画
  const cards = document.querySelectorAll('.contact-card');
  cards.forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'none';
  });
  
  // 初始化地图 - 这一步需要保留，为了正确显示地图
  initMap(data.address);
}

// 初始化地图
function initMap(address) {
  const mapElement = document.getElementById('contact-map');
  if (!mapElement) return;
  
  // 更新地图占位符，只保留地址信息
  mapElement.innerHTML = `
    <div class="map-placeholder">
      <div class="map-content">
        <i class="fas fa-map-marked-alt"></i>
        <h3>地图位置</h3>
        <p><i class="fas fa-location-dot" style="margin-right: 8px; font-size: 0.9em;"></i>${address || '新加坡 Singapore General Hospital'}</p>
      </div>
    </div>
  `;
} 
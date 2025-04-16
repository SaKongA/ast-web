// about.js - 关于页面的脚本

// 初始化导航栏和页脚
document.getElementById('navbar-container').innerHTML = renderNavbar();
document.getElementById('footer-container').innerHTML = renderFooter();

// 设置卡片动画延迟索引
function initializeCardAnimations() {
  document.querySelectorAll('.about-card').forEach((card, index) => {
    card.style.setProperty('--card-index', index + 1);
  });
}

// 预加载背景图片
function preloadBackgroundImage() {
  const bgImage = new Image();
  bgImage.src = '/images/about-bg.jpg';
  bgImage.onload = function() {
    const headerBg = document.querySelector('.header-bg-image');
    if (headerBg) {
      headerBg.classList.add('loaded');
    }
  };
}

// 辅助函数：格式化名字，去除连字符
function formatName(name) {
  // 将连字符替换为空格
  return name.replace(/-/g, ' ');
}

// 格式化文本函数 - 处理不同类型的内容
function formatText(text, type) {
  if (!text) return '暂无数据';
  
  switch(type) {
    case 'introduction':
      // 改进段落处理逻辑
      // 首先按照换行符或多个空格拆分文本
      const paragraphs = text.split(/\n+|\s{2,}/).filter(para => para.trim());
      // 为每个段落添加适当的样式和缩进
      return paragraphs.map(para => 
        `<p style="text-indent: 2em; margin-bottom: 1.2em; line-height: 1.8;">${para.trim()}</p>`
      ).join('');
      
    case 'leadership':
      return formatLeadership(text);
      
    case 'academic':
      return formatAcademicCommittee(text);
      
    case 'faculty':
      return formatFaculty(text);
      
    case 'visiting':
      return formatVisitingProfessors(text);
      
    default:
      return text;
  }
}

// 格式化领导组织
function formatLeadership(text) {
  const lines = text.split('\n').filter(line => line.trim());
  let html = '';
  
  lines.forEach(line => {
    const parts = line.split('：');
    if (parts.length === 2) {
      const role = parts[0];
      const names = parts[1].split(' ').filter(name => name.trim());
      
      html += '<div class="staff-section">';
      html += `<h3 class="staff-title">${role}</h3>`;
      html += '<div class="staff-list">';
      
      // 为每个人名创建单独的卡片
      names.forEach(name => {
        html += `
          <div class="staff-item">
            <div class="staff-name">${formatName(name)}</div>
          </div>
        `;
      });
      
      html += '</div></div>';
    }
  });
  
  return html;
}

// 格式化学术委员会
function formatAcademicCommittee(text) {
  const lines = text.split('\n').filter(line => line.trim());
  let html = '';
  
  lines.forEach(line => {
    const parts = line.split('：');
    if (parts.length === 2) {
      const title = parts[0];
      const names = parts[1].split(' ').filter(name => name.trim());
      
      html += '<div class="staff-section">';
      html += `<h3 class="staff-title">${title}</h3>`;
      html += '<div class="staff-list">';
      
      names.forEach(name => {
        html += `
          <div class="staff-item">
            <div class="staff-name">${formatName(name)}</div>
          </div>
        `;
      });
      
      html += '</div></div>';
    }
  });
  
  return html;
}

// 格式化教授与科研员
function formatFaculty(text) {
  const lines = text.split('\n').filter(line => line.trim());
  let html = '';
  
  lines.forEach(line => {
    const parts = line.split('：');
    if (parts.length === 2) {
      const title = parts[0];
      const names = parts[1].split(' ').filter(name => name.trim());
      
      html += '<div class="staff-section">';
      html += `<h3 class="staff-title">${title}</h3>`;
      html += '<div class="staff-list">';
      
      names.forEach(name => {
        html += `
          <div class="staff-item">
            <div class="staff-name">${formatName(name)}</div>
          </div>
        `;
      });
      
      html += '</div></div>';
    }
  });
  
  return html;
}

// 格式化客座教授
function formatVisitingProfessors(text) {
  const lines = text.split('\n').filter(line => line.trim());
  let html = '';
  
  lines.forEach(line => {
    const parts = line.split('：');
    if (parts.length === 2) {
      const title = parts[0];
      
      // 检查是否包含聘期信息
      const containsTerm = parts[1].includes('（') && parts[1].includes('）');
      const professors = parts[1].split(' ').filter(p => p.trim());
      
      html += '<div class="staff-section">';
      html += `<h3 class="staff-title">${title}</h3>`;
      html += '<div class="staff-list">';
      
      if (containsTerm) {
        // 带聘期的客座教授
        professors.forEach(prof => {
          const match = prof.match(/(.*?)（(.*?)）/);
          if (match) {
            html += `
              <div class="staff-item">
                <div class="staff-name">${formatName(match[1])}</div>
                <div class="term-info">聘期：${match[2]}</div>
              </div>
            `;
          } else {
            html += `
              <div class="staff-item">
                <div class="staff-name">${formatName(prof)}</div>
              </div>
            `;
          }
        });
      } else {
        // 无聘期的客座教授
        professors.forEach(name => {
          html += `
            <div class="staff-item">
              <div class="staff-name">${formatName(name)}</div>
            </div>
          `;
        });
      }
      
      html += '</div></div>';
    }
  });
  
  return html;
}

// 获取和显示数据
async function loadAboutData() {
  try {
    const aboutData = await API.fetchAbout();
    
    if (aboutData?.data?.[0]) {
      const data = aboutData.data[0];
      
      // 处理和显示数据
      document.getElementById('about-introduction').innerHTML = formatText(data.introduction, 'introduction');
      document.getElementById('about-leadership').innerHTML = formatText(data.leadership, 'leadership');
      document.getElementById('about-academic-committee').innerHTML = formatText(data.academicCommittee, 'academic');
      document.getElementById('about-faculty').innerHTML = formatText(data.facultyAndResearchers, 'faculty');
      document.getElementById('about-visiting').innerHTML = formatText(data.visitingProfessors, 'visiting');
    } else {
      document.querySelectorAll('.about-text').forEach(el => {
        el.textContent = '暂无数据';
      });
    }
  } catch (error) {
    console.error('加载数据时出错:', error);
    document.getElementById('about-introduction').textContent = '加载数据时出错，请稍后再试';
  }
}

// 初始化页面
function initPage() {
  initializeCardAnimations();
  loadAboutData();
  preloadBackgroundImage();
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', initPage);

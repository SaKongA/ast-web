// API.js - API工具用于从Strapi获取数据

// 基础API URL，根据实际部署环境修改
const API_BASE_URL = '/api';

// 获取关于信息
async function fetchAbout() {
  try {
    const response = await fetch('/api/abouts');
    if (!response.ok) {
      throw new Error('网络响应异常');
    }
    return await response.json();
  } catch (error) {
    console.error('获取关于数据失败:', error);
    return null;
  }
}

// 获取会议信息
async function fetchConferences() {
  try {
    const response = await fetch(`${API_BASE_URL}/conferences?populate=coverImage`);
    if (!response.ok) throw new Error('获取会议数据失败');
    return await response.json();
  } catch (error) {
    console.error('获取会议数据出错:', error);
    return null;
  }
}

// 获取单个会议详情
async function fetchConferenceById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/conferences/${id}?populate=coverImage`);
    if (!response.ok) throw new Error('获取会议详情失败');
    return await response.json();
  } catch (error) {
    console.error('获取会议详情出错:', error);
    return null;
  }
}

// 获取联系信息
function fetchContact() {
  return fetch('/api/contacts')
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应不正确');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.data && data.data.length > 0) {
        return data.data[0];
      }
      throw new Error('无法获取联系信息数据');
    });
}

// 获取科研成果
async function fetchResearch() {
  try {
    const response = await fetch(`${API_BASE_URL}/researches`);
    if (!response.ok) throw new Error('获取科研成果数据失败');
    return await response.json();
  } catch (error) {
    console.error('获取科研成果数据出错:', error);
    return null;
  }
}

// 获取单个科研成果详情
async function fetchResearchById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/researches/${id}`);
    if (!response.ok) throw new Error('获取科研成果详情失败');
    return await response.json();
  } catch (error) {
    console.error('获取科研成果详情出错:', error);
    return null;
  }
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// 格式化文本内容（支持Markdown）
function formatContent(content, isConferenceDetail = false) {
  if (!content) return '';
  
  // 如果是会议详情页，或Markdown组件不可用，则使用传统的段落分割
  if (isConferenceDetail || !window.Markdown || !window.Markdown.shouldEnable()) {
    // 特殊处理图片标签，保留其后的换行
    let processedContent = content;
    
    // 先处理代码块，确保会议详情页也能显示代码块
    processedContent = processedContent.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, language, code) {
      return `<pre><code class="language-${language}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });
    
    // 再处理图片，将图片标签转换为HTML
    processedContent = processedContent.replace(/!\[(.*?)\]\((.*?)\)(\s*\n*)/g, function(match, alt, url, spaces) {
      // 返回图片标签，并为其添加特殊标记
      return `<img src="${url}" alt="${alt}" class="non-markdown-img" style="display: block; margin-left: auto; margin-right: auto;">${spaces || ''}`;
    });

    // 然后进行段落分割
    const paragraphs = processedContent.split('\n\n');
    return paragraphs
      .map(paragraph => {
        if (!paragraph.trim()) return '';
        
        // 如果段落已经是HTML标签（如预格式化代码块），不再包装
        if (paragraph.startsWith('<pre>') || paragraph.startsWith('<code>')) {
          return paragraph;
        }
        
        // 如果段落包含图片，并且后面有换行符，添加合适的处理
        if (paragraph.includes('<img') && paragraph.includes('non-markdown-img')) {
          // 处理单行中的换行
          paragraph = paragraph.replace(/\n/g, '<br>');
        }
        
        return `<p>${paragraph}</p>`;
      })
      .filter(p => p) // 移除空段落
      .join('');
  }
  
  // 使用Markdown解析
  return window.Markdown.parse(content);
}

// 将所有API函数导出到window对象，使其可以在页面中直接访问
window.API = {
  fetchAbout,
  fetchConferences,
  fetchConferenceById,
  fetchContact,
  fetchResearch,
  fetchResearchById,
  formatDate,
  formatContent
}; 
// Markdown.js - Markdown解析组件

// 简单的Markdown解析函数
function parseMarkdown(markdown) {
  if (!markdown) return '';
  
  try {
    // 如果页面中已经加载了marked库
    if (typeof marked !== 'undefined') {
      // 配置marked选项，确保段落之间有空行
      marked.setOptions({
        breaks: true, // 转换回车为<br>
        gfm: true     // 使用GitHub风格Markdown
      });
      return marked.parse(markdown);
    }
    
    // 基本的Markdown解析（简化版）
    return basicMarkdownParse(markdown);
  } catch (error) {
    console.error('Markdown解析错误:', error);
    // 降级处理：按段落拆分文本
    return markdown
      .split('\n')
      .filter(paragraph => paragraph.trim())
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  }
}

// 简单的Markdown解析实现（基础功能）
function basicMarkdownParse(markdown) {
  if (!markdown) return '';
  
  let html = markdown;
  
  // 处理代码块 (```lang code ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, language, code) {
    return `<pre><code class="language-${language}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });
  
  // 特殊处理图片后的换行
  // 先替换图片标记为特殊标记，以便后续处理
  let imageCounter = 0;
  const imagePlaceholders = [];
  
  html = html.replace(/!\[(.*?)\]\((.*?)\)(\s*)/g, function(match, alt, url, spaces) {
    const placeholder = `__IMAGE_PLACEHOLDER_${imageCounter}__`;
    // 添加单独图片包装器，确保图片居中而不影响文字
    imagePlaceholders[imageCounter] = {
      html: `<img src="${url}" alt="${alt}" class="markdown-img">`,
      spaces: spaces || ''
    };
    imageCounter++;
    return placeholder;
  });
  
  // 处理链接 ([text](url))
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // 处理粗体 (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 处理斜体 (*text*)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 处理标题 (# text)
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
  html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
  
  // 处理段落，确保图片后的换行正确处理
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(p => {
    p = p.trim();
    
    // 将图片占位符替换回实际图片HTML
    for (let i = 0; i < imageCounter; i++) {
      const placeholder = `__IMAGE_PLACEHOLDER_${i}__`;
      const imageData = imagePlaceholders[i];
      
      if (p.includes(placeholder)) {
        // 图片后有两个以上换行符，这意味着应该是单独的段落
        if (imageData.spaces.includes('\n\n')) {
          p = p.replace(placeholder, `${imageData.html}</p><p>`);
        } 
        // 图片后有一个换行符，添加<br>
        else if (imageData.spaces.includes('\n')) {
          p = p.replace(placeholder, `${imageData.html}<br>`);
        }
        // 否则只是普通替换
        else {
          p = p.replace(placeholder, imageData.html);
        }
      }
    }
    
    // 如果段落不是以HTML标签开始，则包装在<p>标签中
    if (p && !p.startsWith('<')) {
      return `<p>${p}</p>`;
    }
    return p;
  }).join('\n');
  
  // 修复可能存在的空段落问题
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  // 处理单行回车为<br>
  html = html.replace(/<p>(.*?)\n(.*?)<\/p>/g, '<p>$1<br>$2</p>');
  
  return html;
}

// 是否启用Markdown解析（在会议详情页禁用）
function shouldEnableMarkdown() {
  // 在会议详情页不启用Markdown解析
  return !window.location.pathname.includes('conference-detail');
}

// 导出到全局对象
window.Markdown = {
  parse: parseMarkdown,
  shouldEnable: shouldEnableMarkdown
}; 
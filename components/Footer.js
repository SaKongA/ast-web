// Footer.js - 页脚组件
function renderFooter() {
  const currentYear = new Date().getFullYear();
  
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-column">
            <h3>关于我们</h3>
            <p>亚洲科学技术研究院（Asia Science and Technology Institute, ASTI）是一所非盈利性科研院所。其主要从事于技术研究、创新科技等相关领域，包括自然科学、人文社科、基础学科等范畴。</p>
          </div>
          
          <div class="footer-column">
            <h3>快速链接</h3>
            <ul class="footer-links">
              <li><a href="/">首页</a></li>
              <li><a href="/conferences.html">学术会议</a></li>
              <li><a href="/research.html">科研成果</a></li>
              <li><a href="/collaboration.html">国际合作</a></li>
              <li><a href="/about.html">关于亚科院</a></li>
              <li><a href="/contact.html">联系我们</a></li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h3>联系方式</h3>
            <div class="footer-contact">
              <p>电话: +65 86568589（新加坡）</p>
              <p>电话: +86 15932656572（中国）</p>
              <p>邮箱: GuoJiaSheHuiKexue@qq.com</p>
              <p>邮箱: sia-committe@hotmail.com</p>
            </div>
          </div>
          
          <div class="footer-column">
            <h3>地址</h3>
            <p>新加坡Blk 6Singapore General Hospital Level 6</p>
            <p>工作时间: 8:00－11:30，13:30－18:00（法定节假日除外）</p>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${currentYear} 亚洲科学技术研究院. 版权所有.</p>
        </div>
      </div>
    </footer>
  `;
}

// 导出函数用于其他页面引用
window.renderFooter = renderFooter; 
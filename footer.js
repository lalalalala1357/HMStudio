const footerHTML = `
<style>
  footer {
    background-color: #EFEBE9; /* 溫暖的淺大地色底 */
    color: #5D4037;
    padding: 40px 20px 20px;
    margin-top: 60px;
    border-top: 2px solid #D7CCC8;
    font-family: sans-serif;
  }

  .footer-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 30px;
  }

  .footer-brand h3 {
    margin: 0 0 15px 0;
    color: #4E342E;
    font-size: 1.3rem;
  }

  .footer-brand p {
    font-size: 0.95rem;
    color: #795548;
    line-height: 1.6;
    margin: 0;
  }

  .footer-links h4, .footer-contact h4 {
    margin: 0 0 15px 0;
    color: #4E342E;
  }

  .footer-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 10px;
  }

  .footer-links a {
    color: #795548;
    text-decoration: none;
    transition: color 0.3s;
  }

  .footer-links a:hover {
    color: #D84315; /* 滑鼠移過去變深橘色 */
  }

  .footer-contact p {
    font-size: 0.95rem;
    margin: 5px 0;
    color: #795548;
  }

  /* 最底部的版權區塊 */
  .footer-bottom {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px dashed #D7CCC8;
    font-size: 0.85rem;
    color: #8D6E63;
  }
</style>

<footer>
  <div class="footer-container">
    <div class="footer-brand" style="flex: 2; min-width: 250px;">
      <h3>手作縫紉工作室</h3>
      <p>每一塊布料的挑選、每一道車縫，<br>都蘊含著獨一無二的溫度。<br>為您量身打造專屬的日常陪伴。</p>
    </div>

    <div class="footer-links" style="flex: 1; min-width: 150px;">
      <h4>快速導覽</h4>
      <ul>
        <li><a href="index.html">🏠 回到首頁</a></li>
        <li><a href="products.html">👜 媽媽的布包</a></li>
        <li><a href="booking.html">💬 預約客製/修改</a></li>
        <li><a href="contact.html">❓ 常見問題</a></li>
      </ul>
    </div>

    <div class="footer-contact" style="flex: 1; min-width: 150px;">
      <h4>聯絡我們</h4>
      <p>📍 台中市大肚區</p>
      <p>📱 LINE ID: <a href="https://line.me/R/ti/p/@130xhbqv" style="color: #4E342E; text-decoration: none; font-weight: bold;">@130xhbqv</a></p>
      <p>🕒 營業時間: 18:00 - 22:00</p>
    </div>
  </div>

  <div class="footer-bottom">
    &copy; 2026 手作縫紉工作室. All Rights Reserved.
  </div>
</footer>
`;

document.getElementById('footer-placeholder').innerHTML = footerHTML;
const navbarHTML = `
<style>
  /* 頂部導覽列外框 */
  .custom-navbar {
    background-color: #EFEBE9; /* 溫暖的大地色底 */
    position: relative; 
    border-bottom: 2px solid #D7CCC8;
  }

  /* 內部排版容器 */
  .nav-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 15px 20px;
    display: flex;
    flex-direction: column; /* 電腦版預設直向排列：標題在上，選單在下 */
    align-items: center;
  }

  /* 網站大標題 */
  .nav-title {
    color: #4E342E;
    margin: 0 0 15px 0;
    font-size: 1.8rem;
    letter-spacing: 2px;
  }

  /* 電腦版：橫向排列的選單 */
  .nav-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .nav-menu li a {
    text-decoration: none;
    color: #6D4C41;
    font-weight: bold;
    font-size: 1.05rem;
    padding: 8px 15px;
    border-radius: 20px;
    transition: background 0.3s, color 0.3s;
    white-space: nowrap; /* ⚠️ 關鍵魔法：絕對不准文字斷行！ */
  }

  .nav-menu li a:hover {
    background-color: #D7CCC8;
    color: #4E342E;
  }

  /* 漢堡按鈕 (電腦版預設隱藏) */
  .menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 1.8rem;
    color: #4E342E;
    cursor: pointer;
  }

  /* 📱 手機版專屬設計 (當螢幕寬度小於 768px 時啟動) */
  @media (max-width: 768px) {
    .nav-container {
      flex-direction: row; /* 手機版變橫向：標題在左，按鈕在右 */
      justify-content: space-between;
      padding: 15px 20px;
    }

    .nav-title {
      margin-bottom: 0; /* 取消下方的留白 */
      font-size: 1.5rem;
    }

    .menu-btn {
      display: block; /* 顯示漢堡按鈕 */
    }

    /* 手機版的下拉選單設計 */
    .nav-menu {
      display: none; /* 預設先隱藏起來 */
      flex-direction: column;
      position: absolute;
      top: 100%; /* 貼在導覽列正下方 */
      left: 0;
      width: 100%;
      background-color: #FDFBF7;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      padding: 0;
      z-index: 1000;
    }

    /* 透過點擊按鈕加上 active 類別後顯示出來 */
    .nav-menu.active {
      display: flex;
    }

    .nav-menu li {
      margin: 0;
    }

    .nav-menu li a {
      display: block;
      padding: 15px 20px;
      border-radius: 0; /* 手機版不需要按鈕圓角，填滿整行更好點 */
      border-bottom: 1px dashed #EFEBE9; /* 選項之間的虛線分隔 */
    }
  }
</style>

<div class="custom-navbar">
  <div class="nav-container">
    <h1 class="nav-title">手作縫紉工作室</h1>
    
    <button class="menu-btn" onclick="toggleMobileMenu()">☰</button>
    
    <ul class="nav-menu" id="mobileMenu">
      <li><a href="index.html">首頁</a></li>
      <li><a href="about.html">關於我們</a></li>
      <li><a href="services.html">修改服務</a></li>
      <li><a href="products.html">手作成品</a></li>
      <li><a href="booking.html">線上預約</a></li>
      <li><a href="contact.html">聯絡我們</a></li>
    </ul>
  </div>
</div>
`;

document.getElementById('navbar-placeholder').innerHTML = navbarHTML;

// 讓漢堡按鈕可以開關的 JavaScript 魔法
window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
};
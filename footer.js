const FOOTER_FALLBACK_LINE_URL = "https://line.me/R/ti/p/@130xhbqv";

function getFooterLineUrl() {
  return window.SiteConfig && window.SiteConfig.lineUrl
    ? window.SiteConfig.lineUrl
    : FOOTER_FALLBACK_LINE_URL;
}

function createFooterLink(label, href) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  item.appendChild(link);
  return item;
}

function initFooter() {
  const placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) return;

  const footer = document.createElement("footer");
  footer.className = "site-footer";

  const container = document.createElement("div");
  container.className = "site-shell footer-container";

  const brand = document.createElement("section");
  brand.className = "footer-brand";
  brand.setAttribute("aria-labelledby", "footerBrandTitle");

  const brandTitle = document.createElement("h2");
  brandTitle.id = "footerBrandTitle";
  brandTitle.textContent = "手作縫紉工作室";

  const brandText = document.createElement("p");
  brandText.textContent = "提供手作布包、布藝生活小物、客製訂製與衣物修改服務，從日常使用出發，細緻完成每一件作品。";

  brand.append(brandTitle, brandText);

  const shop = document.createElement("section");
  shop.className = "footer-column";
  const shopTitle = document.createElement("h2");
  shopTitle.textContent = "商品與服務";
  const shopLinks = document.createElement("ul");
  shopLinks.className = "footer-links";
  [
    ["全部商品", "products.html"],
    ["衣物修改", "services.html"],
    ["客製訂製詢價", "booking.html"],
    ["品牌故事", "about.html"]
  ].forEach(([label, href]) => shopLinks.appendChild(createFooterLink(label, href)));
  shop.append(shopTitle, shopLinks);

  const support = document.createElement("section");
  support.className = "footer-column";
  const supportTitle = document.createElement("h2");
  supportTitle.textContent = "顧客服務";
  const supportLinks = document.createElement("ul");
  supportLinks.className = "footer-links";
  [
    ["聯絡與購買說明", "contact.html"],
    ["購買須知", "shopping-guide.html"],
    ["退換貨說明", "shopping-guide.html#returns"],
    ["隱私權政策", "privacy.html"]
  ].forEach(([label, href]) => supportLinks.appendChild(createFooterLink(label, href)));
  support.append(supportTitle, supportLinks);

  const contact = document.createElement("section");
  contact.className = "footer-column";
  const contactTitle = document.createElement("h2");
  contactTitle.textContent = "聯絡方式";

  const contactText = document.createElement("p");
  contactText.textContent = "LINE 官方帳號：@130xhbqv";

  const serviceText = document.createElement("p");
  serviceText.textContent = "服務時間：週一至週五 18:00 - 22:00";

  const deliveryText = document.createElement("p");
  deliveryText.textContent = "配送方式：台中面交、超商寄送";

  const paymentText = document.createElement("p");
  paymentText.textContent = "付款方式：依 LINE 確認內容為準";

  const lineLink = document.createElement("a");
  lineLink.className = "text-link";
  lineLink.href = getFooterLineUrl();
  lineLink.target = "_blank";
  lineLink.rel = "noopener noreferrer";
  lineLink.textContent = "加入 LINE 詢問";

  contact.append(contactTitle, contactText, serviceText, deliveryText, paymentText, lineLink);

  const bottom = document.createElement("div");
  bottom.className = "site-shell footer-bottom";

  const copyright = document.createElement("p");
  copyright.textContent = `© ${new Date().getFullYear()} 手作縫紉工作室. All Rights Reserved.`;

  const notice = document.createElement("p");
  notice.textContent = "手作品尺寸與花色會因材質略有差異，請以下單前確認為準。";

  bottom.append(copyright, notice);
  container.append(brand, shop, support, contact);
  footer.append(container, bottom);
  placeholder.replaceChildren(footer);
}

initFooter();

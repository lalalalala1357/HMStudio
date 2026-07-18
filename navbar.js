const FALLBACK_LINE_URL = "https://line.me/R/ti/p/@130xhbqv";

const navItems = [
  { label: "首頁", href: "index.html", match: ["", "index.html"] },
  { label: "全部商品", href: "products.html", match: ["products.html", "product-detail.html"] },
  { label: "衣物修改", href: "services.html", match: ["services.html"] },
  { label: "客製訂製", href: "booking.html", match: ["booking.html"] },
  { label: "品牌故事", href: "about.html", match: ["about.html"] },
  { label: "購買說明", href: "shopping-guide.html", match: ["shopping-guide.html", "contact.html"] }
];

function getCurrentPage() {
  const fileName = window.location.pathname.split("/").pop();
  return fileName || "index.html";
}

function getLineUrl() {
  return window.SiteConfig && window.SiteConfig.lineUrl
    ? window.SiteConfig.lineUrl
    : FALLBACK_LINE_URL;
}

function createNavLink(item, currentPage) {
  const li = document.createElement("li");
  const link = document.createElement("a");
  const isActive = item.match.includes(currentPage);

  link.className = "nav-link";
  link.href = item.href;
  link.textContent = item.label;

  if (isActive) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }

  li.appendChild(link);
  return li;
}

function initNavbar() {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  const currentPage = getCurrentPage();
  const header = document.createElement("header");
  header.className = "site-header";

  const container = document.createElement("div");
  container.className = "site-shell nav-container";

  const brand = document.createElement("a");
  brand.className = "brand-link";
  brand.href = "index.html";
  brand.setAttribute("aria-label", "回到手作縫紉工作室首頁");

  const brandMark = document.createElement("img");
  brandMark.className = "brand-mark";
  brandMark.src = "baghead.jpg";
  brandMark.alt = "";
  brandMark.loading = "lazy";

  const brandName = document.createElement("span");
  brandName.className = "brand-name";
  brandName.textContent = "手作縫紉工作室";

  brand.append(brandMark, brandName);

  const navWrap = document.createElement("nav");
  navWrap.className = "nav-menu-wrap";
  navWrap.setAttribute("aria-label", "主要導覽");

  const menu = document.createElement("ul");
  menu.className = "nav-menu";
  menu.id = "primaryNav";

  navItems.forEach((item) => {
    menu.appendChild(createNavLink(item, currentPage));
  });
  navWrap.appendChild(menu);

  const actions = document.createElement("div");
  actions.className = "nav-actions";

  const lineLink = document.createElement("a");
  lineLink.className = "btn btn--line";
  lineLink.href = getLineUrl();
  lineLink.target = "_blank";
  lineLink.rel = "noopener noreferrer";
  lineLink.textContent = "LINE 詢問";

  const toggleButton = document.createElement("button");
  toggleButton.className = "menu-toggle";
  toggleButton.type = "button";
  toggleButton.setAttribute("aria-label", "開啟主選單");
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-controls", "primaryNav");

  const toggleIcon = document.createElement("span");
  toggleIcon.setAttribute("aria-hidden", "true");
  toggleButton.appendChild(toggleIcon);

  actions.append(lineLink, toggleButton);
  container.append(brand, navWrap, actions);
  header.appendChild(container);
  placeholder.replaceChildren(header);

  const setMenuOpen = (isOpen) => {
    header.classList.toggle("menu-active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute("aria-label", isOpen ? "關閉主選單" : "開啟主選單");
  };

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(toggleButton.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("menu-active")) return;
    if (!header.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      toggleButton.focus();
    }
  });
}

initNavbar();

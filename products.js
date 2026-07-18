(function () {
  const state = {
    allProducts: [],
    searchTerm: "",
    category: "all",
    status: "all",
    sort: "latest"
  };

  const elements = {};

  function cacheElements() {
    elements.form = document.getElementById("productFilterForm");
    elements.search = document.getElementById("productSearch");
    elements.category = document.getElementById("productCategory");
    elements.status = document.getElementById("productStatus");
    elements.sort = document.getElementById("productSort");
    elements.container = document.getElementById("productContainer");
    elements.stateMessage = document.getElementById("productStateMessage");
    elements.resultCount = document.getElementById("productResultCount");
    elements.clear = document.getElementById("clearProductFilters");
  }

  function setControlsDisabled(isDisabled) {
    [elements.search, elements.category, elements.status, elements.sort, elements.clear]
      .filter(Boolean)
      .forEach((control) => {
        control.disabled = isDisabled;
      });
  }

  function setMessage(message, type) {
    elements.stateMessage.hidden = !message;
    elements.stateMessage.className = type ? `${type}-state` : "loading-state";
    elements.stateMessage.textContent = message || "";
  }

  function updateResultCount(count) {
    elements.resultCount.textContent = `顯示 ${count} 件商品`;
  }

  function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function populateCategoryFilter(products) {
    const categories = Array.from(new Set(products.map((product) => product.category))).sort((a, b) => a.localeCompare(b, "zh-Hant"));
    elements.category.replaceChildren(createOption("all", "全部分類"));
    categories.forEach((category) => {
      elements.category.appendChild(createOption(category, category));
    });
  }

  function matchesSearch(product) {
    if (!state.searchTerm) return true;
    const haystack = [
      product.name,
      product.sku,
      product.category,
      product.shortDescription,
      product.description
    ].join(" ").toLowerCase();

    return haystack.includes(state.searchTerm);
  }

  function sortProducts(products) {
    const sortedProducts = [...products];

    if (state.sort === "price_asc") {
      return sortedProducts.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
    }

    if (state.sort === "price_desc") {
      return sortedProducts.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    }

    return sortedProducts.sort((a, b) => {
      const aTime = getCreatedTime(a.createdAt);
      const bTime = getCreatedTime(b.createdAt);
      return bTime - aTime;
    });
  }

  function getCreatedTime(createdAt) {
    if (!createdAt) return 0;
    if (typeof createdAt.toMillis === "function") return createdAt.toMillis();
    if (createdAt instanceof Date) return createdAt.getTime();
    return 0;
  }

  function getFilteredProducts() {
    const filteredProducts = state.allProducts.filter((product) => {
      const categoryMatched = state.category === "all" || product.category === state.category;
      const statusMatched = state.status === "all" || product.status === state.status;
      return categoryMatched && statusMatched && matchesSearch(product);
    });

    return sortProducts(filteredProducts);
  }

  function createStatusBadge(product) {
    const badge = document.createElement("span");
    badge.className = ProductStore.getStatusClass(product.status);
    badge.textContent = product.statusLabel;
    return badge;
  }

  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card catalog-card";
    if (product.status === "sold_out") {
      card.classList.add("product-card--sold-out");
    }

    const mediaLink = document.createElement("a");
    mediaLink.className = "catalog-card__media";
    mediaLink.href = `product-detail.html?id=${encodeURIComponent(product.id)}`;
    mediaLink.setAttribute("aria-label", `查看 ${product.name} 詳情`);

    const image = document.createElement("img");
    image.src = product.imageUrl;
    image.alt = `${product.name} 商品照片`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.src = ProductStore.FALLBACK_IMAGE;
    }, { once: true });

    mediaLink.appendChild(image);

    const body = document.createElement("div");
    body.className = "product-card__body";

    const meta = document.createElement("div");
    meta.className = "product-card__meta";

    const category = document.createElement("span");
    category.className = "catalog-card__category";
    category.textContent = product.category;

    meta.append(createStatusBadge(product), category);

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "catalog-card__description";
    description.textContent = ProductStore.truncateText(product.shortDescription, 92);

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = ProductStore.formatPrice(product.price);

    const detailLink = document.createElement("a");
    detailLink.className = "btn btn--secondary";
    detailLink.href = `product-detail.html?id=${encodeURIComponent(product.id)}`;
    detailLink.textContent = product.status === "sold_out" ? "查看詳情" : "查看商品";

    body.append(meta, title, description, price, detailLink);
    card.append(mediaLink, body);
    return card;
  }

  function renderProducts() {
    const products = getFilteredProducts();
    elements.container.replaceChildren(...products.map(createProductCard));
    updateResultCount(products.length);

    if (!products.length) {
      setMessage("目前沒有符合條件的商品，請調整搜尋或篩選條件。", "empty");
      return;
    }

    setMessage("", "");
  }

  function syncStateFromControls() {
    state.searchTerm = elements.search.value.trim().toLowerCase();
    state.category = elements.category.value;
    state.status = elements.status.value;
    state.sort = elements.sort.value;
  }

  function bindEvents() {
    elements.form.addEventListener("input", () => {
      syncStateFromControls();
      renderProducts();
    });

    elements.form.addEventListener("change", () => {
      syncStateFromControls();
      renderProducts();
    });

    elements.form.addEventListener("submit", (event) => {
      event.preventDefault();
      syncStateFromControls();
      renderProducts();
    });

    elements.clear.addEventListener("click", () => {
      elements.form.reset();
      syncStateFromControls();
      renderProducts();
      elements.search.focus();
    });
  }

  async function loadProducts() {
    setControlsDisabled(true);
    setMessage("正在載入商品...", "loading");

    try {
      const db = ProductStore.getDb();
      const snapshot = await db.collection("products")
        .where("isPublished", "==", true)
        .limit(120)
        .get();
      state.allProducts = [];

      snapshot.forEach((doc) => {
        const product = ProductStore.normalizeProduct(doc);
        state.allProducts.push(product);
      });

      populateCategoryFilter(state.allProducts);
      syncStateFromControls();
      renderProducts();

      if (!state.allProducts.length) {
        setMessage("目前尚未有上架商品，歡迎加入 LINE 詢問可製作款式。", "empty");
      }
    } catch (error) {
      console.error("商品列表載入失敗：", error);
      elements.container.replaceChildren();
      updateResultCount(0);
      setMessage("商品暫時無法載入，請稍後再試，或直接透過 LINE 詢問。", "error");
    } finally {
      setControlsDisabled(false);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    bindEvents();
    loadProducts();
  });
})();

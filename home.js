(function () {
  const state = {
    products: []
  };

  const elements = {};

  function cacheElements() {
    elements.latestProducts = document.getElementById("latestProducts");
    elements.latestProductsState = document.getElementById("latestProductsState");
    elements.heroImage = document.getElementById("heroProductImage");
    elements.heroCaption = document.getElementById("heroImageCaption");
    elements.categoryImages = Array.from(document.querySelectorAll("[data-category-image]"));
    elements.storyImage = document.getElementById("storyImage");
  }

  function getCreatedTime(product) {
    if (!product.createdAt) return 0;
    if (typeof product.createdAt.toMillis === "function") return product.createdAt.toMillis();
    if (product.createdAt instanceof Date) return product.createdAt.getTime();
    return 0;
  }

  function sortHomeProducts(products) {
    return [...products].sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return getCreatedTime(b) - getCreatedTime(a);
    });
  }

  function setProductsState(message, type) {
    elements.latestProductsState.hidden = !message;
    elements.latestProductsState.className = type ? `${type}-state` : "loading-state";
    elements.latestProductsState.textContent = message || "";
  }

  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.imageUrl || ProductStore.FALLBACK_IMAGE;
    image.alt = product.name ? `${product.name} 商品照片` : "手作商品照片";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.src = ProductStore.FALLBACK_IMAGE;
    }, { once: true });

    const body = document.createElement("div");
    body.className = "product-card__body";

    const meta = document.createElement("div");
    meta.className = "product-card__meta";

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = ProductStore.formatPrice(product.price);

    const badge = document.createElement("span");
    badge.className = ProductStore.getStatusClass(product.status);
    badge.textContent = product.statusLabel;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = ProductStore.truncateText(product.shortDescription || product.description, 72);

    const link = document.createElement("a");
    link.className = "btn btn--secondary";
    link.href = `product-detail.html?id=${encodeURIComponent(product.id)}`;
    link.textContent = "查看商品";

    meta.append(price, badge);
    body.append(meta, title, description, link);
    card.append(image, body);
    return card;
  }

  function setImage(image, product, fallbackAlt) {
    if (!image || !product || !product.imageUrl) return;

    image.src = product.imageUrl;
    image.alt = product.name ? `${product.name} 商品照片` : fallbackAlt;
    image.addEventListener("error", () => {
      image.src = ProductStore.FALLBACK_IMAGE;
    }, { once: true });
  }

  function updateHomeImages(products) {
    const imageProducts = products.filter((product) => product.imageUrl && product.imageUrl !== ProductStore.FALLBACK_IMAGE);
    if (!imageProducts.length) return;

    setImage(elements.heroImage, imageProducts[0], "最新上架手作商品照片");
    if (elements.heroCaption) {
      elements.heroCaption.textContent = `最新推薦：${imageProducts[0].name}`;
    }

    elements.categoryImages.forEach((image, index) => {
      setImage(image, imageProducts[index % imageProducts.length], image.alt || "手作商品照片");
    });

    setImage(elements.storyImage, imageProducts[1] || imageProducts[0], "手作縫紉工作室作品照片");
  }

  async function loadLatestProducts() {
    setProductsState("正在載入最新商品...", "loading");

    try {
      const db = ProductStore.getDb();
      const snapshot = await db.collection("products")
        .where("isPublished", "==", true)
        .limit(24)
        .get();
      const products = [];

      snapshot.forEach((doc) => {
        const product = ProductStore.normalizeProduct(doc);
        products.push(product);
      });

      state.products = sortHomeProducts(products);
      const latestProducts = state.products.slice(0, 4);

      if (!latestProducts.length) {
        setProductsState("目前尚未有上架商品，歡迎加入 LINE 詢問可製作款式。", "empty");
        return;
      }

      elements.latestProducts.replaceChildren(...latestProducts.map(createProductCard));
      setProductsState("", "");
      updateHomeImages(state.products);
    } catch (error) {
      console.error("載入首頁商品失敗：", error);
      setProductsState("商品暫時無法載入，請稍後再試，或直接透過 LINE 詢問。", "error");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    loadLatestProducts();
  });
})();

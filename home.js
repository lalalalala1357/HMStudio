(function () {
  const state = {
    products: []
  };

  const elements = {};

  function cacheElements() {
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

    setImage(elements.heroImage, imageProducts[0], "推薦手作商品照片");
    if (elements.heroCaption) {
      elements.heroCaption.textContent = `推薦作品：${imageProducts[0].name}`;
    }

    elements.categoryImages.forEach((image, index) => {
      setImage(image, imageProducts[index % imageProducts.length], image.alt || "手作商品照片");
    });

    setImage(elements.storyImage, imageProducts[1] || imageProducts[0], "手作縫紉工作室作品照片");
  }

  async function loadHomeImages() {
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
      updateHomeImages(state.products);
    } catch (error) {
      console.warn("載入首頁圖片失敗：", error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    loadHomeImages();
  });
})();

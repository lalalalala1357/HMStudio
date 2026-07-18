(function () {
  const elements = {};

  function cacheElements() {
    elements.loading = document.getElementById("detailLoading");
    elements.error = document.getElementById("detailError");
    elements.content = document.getElementById("detailContent");
    elements.image = document.getElementById("detailImage");
    elements.name = document.getElementById("detailName");
    elements.sku = document.getElementById("detailSku");
    elements.status = document.getElementById("detailStatus");
    elements.price = document.getElementById("detailPrice");
    elements.category = document.getElementById("detailCategory");
    elements.size = document.getElementById("detailSize");
    elements.material = document.getElementById("detailMaterial");
    elements.color = document.getElementById("detailColor");
    elements.description = document.getElementById("detailDescription");
    elements.care = document.getElementById("detailCare");
    elements.delivery = document.getElementById("detailDelivery");
    elements.customizable = document.getElementById("detailCustomizable");
    elements.line = document.getElementById("detailLineLink");
  }

  function setVisible(target, isVisible) {
    target.hidden = !isVisible;
  }

  function showError(message) {
    elements.error.querySelector("p").textContent = message;
    setVisible(elements.loading, false);
    setVisible(elements.content, false);
    setVisible(elements.error, true);
  }

  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "";
  }

  function getProductUrl(productId) {
    const configuredBase = window.SiteConfig && window.SiteConfig.siteBaseUrl
      ? window.SiteConfig.siteBaseUrl.trim().replace(/\/$/, "")
      : "";
    const pageName = window.location.pathname.split("/").pop() || "product-detail.html";

    if (configuredBase) {
      return `${configuredBase}/${pageName}?id=${encodeURIComponent(productId)}`;
    }

    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("id", productId);
    return url.toString();
  }

  function buildLineMessage(product) {
    return [
      "您好，我想詢問以下商品：",
      `商品名稱：${product.name}`,
      `商品編號：${product.sku}`,
      `價格：${ProductStore.formatPrice(product.price)}`,
      `商品網址：${getProductUrl(product.id)}`
    ].join("\n");
  }

  function setText(element, text) {
    element.textContent = text;
  }

  function setMetaProperty(property, content) {
    const meta = document.querySelector(`meta[property='${property}']`);
    if (meta) {
      meta.setAttribute("content", content);
    }
  }

  function renderProduct(product) {
    const productUrl = getProductUrl(product.id);

    document.title = `${product.name} | 手作縫紉工作室`;
    document.querySelector("meta[name='description']").setAttribute("content", `${product.name}，${product.shortDescription}`);
    document.querySelector("link[rel='canonical']").setAttribute("href", productUrl);
    setMetaProperty("og:title", `${product.name} | 手作縫紉工作室`);
    setMetaProperty("og:description", product.shortDescription);
    setMetaProperty("og:image", product.imageUrl);
    setMetaProperty("og:url", productUrl);

    elements.image.src = product.imageUrl;
    elements.image.alt = `${product.name} 商品照片`;
    elements.image.addEventListener("error", () => {
      elements.image.src = ProductStore.FALLBACK_IMAGE;
    }, { once: true });

    setText(elements.name, product.name);
    setText(elements.sku, product.sku);
    setText(elements.price, ProductStore.formatPrice(product.price));
    setText(elements.category, product.category);
    setText(elements.size, product.size);
    setText(elements.material, product.material);
    setText(elements.color, product.color);
    setText(elements.description, product.description);
    setText(elements.care, product.careInstructions);
    setText(elements.delivery, "台中可約面交，也可依商品尺寸討論超商寄送。實際配送方式以下單前 LINE 確認為準。");
    setText(elements.customizable, product.isCustomizable ? "可討論客製需求" : "此款以現貨或既有款式為主");

    elements.status.className = ProductStore.getStatusClass(product.status);
    elements.status.textContent = product.statusLabel;

    elements.line.href = ProductStore.getLineMessageUrl(buildLineMessage(product));
    elements.line.target = "_blank";
    elements.line.rel = "noopener noreferrer";

    setVisible(elements.loading, false);
    setVisible(elements.error, false);
    setVisible(elements.content, true);
  }

  async function loadProductDetail() {
    const productId = getProductId();

    if (!productId) {
      showError("找不到商品編號，請返回商品列表重新選擇。");
      return;
    }

    try {
      const db = ProductStore.getDb();
      const doc = await db.collection("products").doc(productId).get();

      if (!doc.exists) {
        showError("此商品不存在或已無法瀏覽。");
        return;
      }

      const product = ProductStore.normalizeProduct(doc);
      if (!product.isPublished) {
        showError("此商品目前未上架，請返回商品列表查看其他作品。");
        return;
      }

      renderProduct(product);
    } catch (error) {
      console.error("商品詳情載入失敗：", error);
      showError("商品資料暫時無法載入，請稍後再試。");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    loadProductDetail();
  });
})();

(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAK7QVkeFUCWryls-ooFPcA5Z7Zr5PeQAg",
    authDomain: "bagggg-f9088.firebaseapp.com",
    projectId: "bagggg-f9088",
    messagingSenderId: "951657039312",
    appId: "1:951657039312:web:69fd0b25a7b516fb08a5d5"
  };

  const FALLBACK_IMAGE = "baghead.jpg";
  const LINE_ID = "@130xhbqv";
  const STATUS_LABELS = {
    in_stock: "現貨",
    made_to_order: "接單製作",
    sold_out: "已售出"
  };

  function getDb() {
    if (!window.firebase) {
      throw new Error("Firebase SDK is not loaded.");
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    return firebase.firestore();
  }

  function getAuth() {
    if (!window.firebase) {
      throw new Error("Firebase SDK is not loaded.");
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    return firebase.auth();
  }

  function getSafeString(value, fallback) {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  function getSafeNumber(value, fallback) {
    if (value === null || value === undefined || value === "") return fallback;
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
  }

  function truncateText(value, maxLength) {
    const text = getSafeString(value, "");
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
  }

  function getProductStatus(data) {
    const rawStatus = getSafeString(data.status, "");
    if (rawStatus in STATUS_LABELS) return rawStatus;

    if (data.stock !== null && data.stock !== undefined && data.stock !== "" && Number(data.stock) === 0) {
      return "sold_out";
    }

    return "in_stock";
  }

  function normalizeProduct(doc) {
    const data = doc.data() || {};
    const status = getProductStatus(data);
    const description = getSafeString(data.description, "歡迎加入 LINE 詢問商品細節。");
    const shortDescription = getSafeString(data.shortDescription, truncateText(description, 72));
    const imageUrls = Array.isArray(data.imageUrls)
      ? data.imageUrls.filter((url) => typeof url === "string" && url.trim())
      : [];
    const primaryImage = getSafeString(data.imageUrl, imageUrls[0] || FALLBACK_IMAGE);

    return {
      id: doc.id,
      name: getSafeString(data.name, "未命名手作商品"),
      sku: getSafeString(data.sku, doc.id),
      category: getSafeString(data.category, "手作商品"),
      price: getSafeNumber(data.price, null),
      originalPrice: getSafeNumber(data.originalPrice, null),
      description,
      shortDescription,
      material: getSafeString(data.material, "請洽工作室確認"),
      size: getSafeString(data.size, "請洽工作室確認"),
      color: getSafeString(data.color, "依實品為準"),
      careInstructions: getSafeString(data.careInstructions, "建議手洗、陰乾，避免長時間浸泡與高溫烘乾。"),
      imageUrl: primaryImage,
      imageUrls: imageUrls.length ? imageUrls : [primaryImage],
      stock: getSafeNumber(data.stock, null),
      status,
      statusLabel: STATUS_LABELS[status],
      isCustomizable: Boolean(data.isCustomizable),
      isFeatured: Boolean(data.isFeatured),
      isPublished: data.isPublished !== false,
      sortOrder: getSafeNumber(data.sortOrder, 0),
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null
    };
  }

  function formatPrice(price) {
    if (price === null || price === undefined || price === "") return "價格請洽詢";
    if (!Number.isFinite(Number(price))) return "價格請洽詢";
    return `NT$ ${Number(price).toLocaleString("zh-TW")}`;
  }

  function getStatusClass(status) {
    if (status === "sold_out") return "status-badge status-badge--sold";
    if (status === "made_to_order") return "status-badge status-badge--order";
    return "status-badge";
  }

  function getLineMessageUrl(message) {
    const lineId = window.SiteConfig && window.SiteConfig.lineId
      ? window.SiteConfig.lineId
      : LINE_ID;
    return `https://line.me/R/oaMessage/${encodeURIComponent(lineId)}/?${encodeURIComponent(message)}`;
  }

  window.ProductStore = {
    FALLBACK_IMAGE,
    LINE_ID,
    STATUS_LABELS,
    formatPrice,
    getAuth,
    getDb,
    getLineMessageUrl,
    getSafeString,
    getStatusClass,
    normalizeProduct,
    truncateText
  };
})();

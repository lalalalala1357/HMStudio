(function () {
  const SITE_BASE_URL = "";
  const LINE_ID = "@130xhbqv";
  const LINE_URL = "https://line.me/R/ti/p/@130xhbqv";

  function getPageName() {
    const pageName = window.location.pathname.split("/").pop();
    return pageName || "index.html";
  }

  function getCanonicalUrl() {
    const pageName = getPageName();
    const trimmedBase = SITE_BASE_URL.trim().replace(/\/$/, "");

    if (trimmedBase) {
      return `${trimmedBase}/${pageName}`;
    }

    if (window.location.protocol.startsWith("http")) {
      return `${window.location.origin}${window.location.pathname}`;
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical ? canonical.href : "";
  }

  function ensureMeta(property, content) {
    if (!content) return;

    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  }

  function updateSeoUrls() {
    const canonicalUrl = getCanonicalUrl();
    if (!canonicalUrl) return;

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = canonicalUrl;
    }

    ensureMeta("og:url", canonicalUrl);

    const ogImage = document.querySelector('meta[property="og:image"]');
    const trimmedBase = SITE_BASE_URL.trim().replace(/\/$/, "");
    if (ogImage && trimmedBase && !/^https?:\/\//.test(ogImage.content)) {
      ogImage.content = `${trimmedBase}/${ogImage.content.replace(/^\//, "")}`;
    }
  }

  function updateLineLinks() {
    document.querySelectorAll('a[href^="https://line.me/R/ti/p/"]').forEach((link) => {
      link.href = LINE_URL;
    });
  }

  updateSeoUrls();
  updateLineLinks();

  window.SiteConfig = {
    siteBaseUrl: SITE_BASE_URL,
    lineId: LINE_ID,
    lineUrl: LINE_URL,
    getCanonicalUrl
  };
})();

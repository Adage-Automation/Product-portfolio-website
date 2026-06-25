/**
 * Loads products from Vercel KV via /api/products when available.
 * Falls back to PRODUCTS from data.js (static CSV loader).
 */
async function loadProductsFromServer() {
  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) return false;

    const data = await res.json();
    if (!Array.isArray(data.products) || !data.products.length) return false;

    window.PRODUCTS = data.products;

    // Rebuild filter globals from the server-loaded products
    window.INDUSTRIES          = [...new Set(PRODUCTS.flatMap(p => p.industries      || []))].sort();
    window.COMPANIES           = [...new Set(PRODUCTS.map(p => p.company))].sort();
    window.USE_CASES           = [...new Set(PRODUCTS.flatMap(p => p.useCases        || []))].sort();
    window.TECHNOLOGY_TAGS     = [...new Set(PRODUCTS.flatMap(p => p.technologyTags  || []))].sort();
    window.MEASURED_COMPONENTS = [...new Set(PRODUCTS.flatMap(p => p.measuredComponent || []))].sort();

    window.__productsSource = "server";
    return true;
  } catch {
    window.__productsSource = "file";
    return false;
  }
}

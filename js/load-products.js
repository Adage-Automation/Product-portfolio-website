/**
 * Loads products from Vercel KV via /api/products when available.
 * Falls back to PRODUCTS from data.js (static file).
 */
async function loadProductsFromServer() {
  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) return false;

    const data = await res.json();
    if (!Array.isArray(data.products) || !data.products.length) return false;

    window.PRODUCTS = data.products;
    window.INDUSTRIES = [...new Set(PRODUCTS.map((p) => p.industry))].sort();
    window.COMPANIES = [...new Set(PRODUCTS.map((p) => p.company))].sort();
    window.CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))].sort();
    window.__productsSource = "server";
    return true;
  } catch {
    window.__productsSource = "file";
    return false;
  }
}

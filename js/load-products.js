/**
 * Thin wrapper so existing pages can call `await loadProductsFromServer()`
 * without changes. Delegates to loadProductData() defined in data.js.
 */
async function loadProductsFromServer() {
  if (typeof loadProductData === 'function') {
    await loadProductData();
  }
}

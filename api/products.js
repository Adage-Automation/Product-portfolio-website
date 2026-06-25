/**
 * This API route is no longer used.
 * Product data is now read directly from Google Sheets via the public
 * gviz/tq endpoint in data.js. There is no write-back endpoint.
 *
 * Kept as a stub so existing Vercel deployments don't 404 on /api/products.
 */
export default function handler(req, res) {
  res.status(410).json({
    error: 'This endpoint is retired. Products are served from Google Sheets.',
  });
}

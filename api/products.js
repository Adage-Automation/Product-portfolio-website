import { kv } from "@vercel/kv";

const KV_KEY = "products";

function isAdmin(email, password) {
  const normalized = (email || "").trim().toLowerCase();
  if (normalized !== "admin@adageautomation.com") return false;

  const expected =
    process.env.ADMIN_PASSWORD || "Adage@2025";
  return password === expected;
}

async function readProducts() {
  try {
    return await kv.get(KV_KEY);
  } catch {
    return null;
  }
}

async function writeProducts(products) {
  await kv.set(KV_KEY, products);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const products = await readProducts();
    return res.status(200).json({
      products: Array.isArray(products) ? products : null,
      source: products ? "kv" : "fallback",
    });
  }

  if (req.method === "PUT") {
    const { products, email, password } = req.body || {};

    if (!isAdmin(email, password)) {
      return res.status(401).json({ error: "Admin credentials required." });
    }

    if (!Array.isArray(products) || !products.length) {
      return res.status(400).json({ error: "Invalid product list." });
    }

    try {
      await writeProducts(products);
      return res.status(200).json({ ok: true, count: products.length });
    } catch (err) {
      return res.status(503).json({
        error: "Storage unavailable. Connect Vercel KV to this project.",
        detail: err.message,
      });
    }
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ error: "Method not allowed." });
}

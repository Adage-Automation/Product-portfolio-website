import { kv } from "@vercel/kv";

const KV_KEY = "products_csv";

// Fields stored as pipe-separated arrays
const ARRAY_FIELDS = ['industries', 'useCases', 'tags', 'technologyTags', 'measuredComponent'];

function isAdmin(email, password) {
  const normalized = (email || "").trim().toLowerCase();
  if (normalized !== "admin@adageautomation.com") return false;
  const expected = process.env.ADMIN_PASSWORD || "Adage@2025";
  return password === expected;
}

// ── CSV helpers ──────────────────────────────────────────────────────────────

function splitCSVRow(row) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === "," && !inQuotes) {
      fields.push(current); current = "";
    } else { current += ch; }
  }
  fields.push(current);
  return fields;
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (!lines.length) return [];
  const headers = splitCSVRow(lines[0]);
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitCSVRow(line);
    const obj = {};
    headers.forEach((h, idx) => { obj[h.trim()] = (values[idx] || "").trim(); });
    obj.id = parseInt(obj.id, 10);
    ARRAY_FIELDS.forEach(field => {
      obj[field] = obj[field]
        ? obj[field].split("|").map(v => v.trim()).filter(Boolean)
        : [];
    });
    result.push(obj);
  }
  return result;
}

function csvField(value) {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function productsToCSV(products) {
  const headers = ["id","name","company","industries","useCases","description","onedrive","tags","technologyTags","measuredComponent","image"];
  const rows = [headers.join(",")];
  for (const p of products) {
    rows.push([
      csvField(p.id),
      csvField(p.name),
      csvField(p.company),
      csvField(Array.isArray(p.industries)      ? p.industries.join("|")      : (p.industries || "")),
      csvField(Array.isArray(p.useCases)        ? p.useCases.join("|")        : (p.useCases || "")),
      csvField(p.description),
      csvField(p.onedrive),
      csvField(Array.isArray(p.tags)            ? p.tags.join("|")            : (p.tags || "")),
      csvField(Array.isArray(p.technologyTags)  ? p.technologyTags.join("|")  : (p.technologyTags || "")),
      csvField(Array.isArray(p.measuredComponent) ? p.measuredComponent.join("|") : (p.measuredComponent || "")),
      csvField(p.image),
    ].join(","));
  }
  return rows.join("\n");
}

// ── KV read / write ──────────────────────────────────────────────────────────

async function readCSV() {
  try { return await kv.get(KV_KEY); } catch { return null; }
}

async function writeCSV(csvString) {
  await kv.set(KV_KEY, csvString);
}

// ── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method === "GET") {
    const csv = await readCSV();
    if (!csv) return res.status(200).json({ products: null, source: "fallback" });
    return res.status(200).json({ products: parseCSV(csv), source: "kv" });
  }

  if (req.method === "PUT") {
    const { products, email, password } = req.body || {};
    if (!isAdmin(email, password))
      return res.status(401).json({ error: "Admin credentials required." });
    if (!Array.isArray(products) || !products.length)
      return res.status(400).json({ error: "Invalid product list." });
    try {
      await writeCSV(productsToCSV(products));
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

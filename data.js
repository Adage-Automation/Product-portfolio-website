// ============================================================
//  ADAGE AUTOMATION — PRODUCT DATA LOADER
//  Primary source: Google Sheets (public gviz/tq endpoint)
//  Fallback:       data.csv (served as a static file)
//
//  Column order in the sheet:
//    A  id
//    B  name
//    C  company
//    D  industries       (pipe-separated: Oil & Gas | Chemical)
//    E  useCases         (pipe-separated)
//    F  description
//    G  onedrive
//    H  tags             (pipe-separated)
//    I  technologyTags   (pipe-separated)
//    J  measuredComponent(pipe-separated)
//    K  image
// ============================================================

const SHEET_ID   = '1kFfFCB57ekRwOgjxZFsZh9ojx-Q2xy6ObTiMNUZhqFs';
const SHEET_NAME = 'Sheet1';
const SHEET_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

// Fields that are pipe-separated inside a single cell
const PIPE_FIELDS = ['industries','useCases','tags','technologyTags','measuredComponent'];

// ── Parse a gviz/tq JSON response into product objects ──────────────────────
function parseSheetData(text) {
  // The response is wrapped: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  // Strip the prefix/suffix to get pure JSON
  const json = JSON.parse(text.substring(47, text.length - 2));
  return json.table.rows
    .filter(row => row.c && row.c[0]?.v) // skip header / empty rows
    .map(row => {
      const v = i => (row.c[i]?.v ?? '').toString().trim();
      const arr = (i, sep = '|') => v(i) ? v(i).split(sep).map(s => s.trim()).filter(Boolean) : [];
      return {
        id:               parseInt(v(0), 10) || 0,
        name:             v(1),
        company:          v(2),
        industries:       arr(3),
        useCases:         arr(4),
        description:      v(5),
        onedrive:         v(6),
        tags:             arr(7),
        technologyTags:   arr(8),
        measuredComponent:arr(9),
        image:            v(10),
      };
    });
}

// ── CSV fallback parser (same logic as before) ───────────────────────────────
function splitCSVRow(row) {
  const fields = [];
  let cur = '', inQ = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQ && row[i+1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) { fields.push(cur); cur = ''; }
    else cur += ch;
  }
  fields.push(cur);
  return fields;
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
  if (!lines.length) return [];
  const headers = splitCSVRow(lines[0]);
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals = splitCSVRow(line);
    const obj = {};
    headers.forEach((h, idx) => { obj[h.trim()] = (vals[idx] || '').trim(); });
    obj.id = parseInt(obj.id, 10);
    PIPE_FIELDS.forEach(f => {
      obj[f] = obj[f] ? obj[f].split('|').map(v => v.trim()).filter(Boolean) : [];
    });
    result.push(obj);
  }
  return result;
}

// ── Populate global filter arrays from loaded products ───────────────────────
function buildGlobals(products) {
  window.PRODUCTS            = products;
  window.INDUSTRIES          = [...new Set(products.flatMap(p => p.industries      || []))].sort();
  window.COMPANIES           = [...new Set(products.map(p => p.company))].sort();
  window.USE_CASES           = [...new Set(products.flatMap(p => p.useCases        || []))].sort();
  window.TECHNOLOGY_TAGS     = [...new Set(products.flatMap(p => p.technologyTags  || []))].sort();
  window.MEASURED_COMPONENTS = [...new Set(products.flatMap(p => p.measuredComponent || []))].sort();
}

// ── Main loader — called by load-products.js ─────────────────────────────────
// Returns true if data was loaded successfully, false on total failure.
async function loadProductData() {
  // 1. Try Google Sheets
  try {
    const res = await fetch(SHEET_URL);
    if (res.ok) {
      const text = await res.text();
      const products = parseSheetData(text);
      if (products.length) {
        buildGlobals(products);
        window.__productsSource = 'sheet';
        return true;
      }
    }
  } catch (e) {
    console.warn('Google Sheets fetch failed, falling back to CSV:', e);
  }

  // 2. Fallback: data.csv
  try {
    const res = await fetch('/data.csv');
    if (res.ok || res.status === 0) {
      const text = await res.text();
      const products = parseCSV(text);
      if (products.length) {
        buildGlobals(products);
        window.__productsSource = 'csv';
        return true;
      }
    }
  } catch (e) {
    console.warn('CSV fallback also failed:', e);
  }

  // 3. Nothing worked
  buildGlobals([]);
  window.__productsSource = 'empty';
  return false;
}

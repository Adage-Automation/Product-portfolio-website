// ============================================================
//  ADAGE AUTOMATION — PRODUCT DATA LOADER
//  Products are stored in data.csv.
//  Multi-value fields (industries, useCases, tags, technologyTags,
//  measuredComponent) are pipe-separated ( | ) inside their cell.
// ============================================================

/**
 * Split a single CSV row, respecting double-quoted fields.
 */
function splitCSVRow(row) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// Fields stored as pipe-separated arrays
const ARRAY_FIELDS = ['industries', 'useCases', 'tags', 'technologyTags', 'measuredComponent'];

/**
 * Parse a CSV string into an array of product objects.
 */
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (!lines.length) return [];

  const headers = splitCSVRow(lines[0]);
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitCSVRow(line);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = (values[idx] || '').trim();
    });

    // Coerce id to number
    if (obj.id) obj.id = parseInt(obj.id, 10);

    // Coerce all array fields from pipe-separated strings to arrays
    ARRAY_FIELDS.forEach(field => {
      obj[field] = obj[field]
        ? obj[field].split('|').map(v => v.trim()).filter(Boolean)
        : [];
    });

    result.push(obj);
  }
  return result;
}

// ── Load CSV and populate globals ──────────────────────────────────────────
(function loadCSV() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/data.csv', false); // synchronous
    xhr.send();
    if (xhr.status === 200 || xhr.status === 0) {
      window.PRODUCTS = parseCSV(xhr.responseText);
    } else {
      console.warn('data.csv not found, PRODUCTS will be empty.');
      window.PRODUCTS = [];
    }
  } catch (e) {
    console.error('Failed to load data.csv:', e);
    window.PRODUCTS = [];
  }

  // Flatten all values from array fields for filter lists
  window.INDUSTRIES       = [...new Set(PRODUCTS.flatMap(p => p.industries))].sort();
  window.COMPANIES        = [...new Set(PRODUCTS.map(p => p.company))].sort();
  window.USE_CASES        = [...new Set(PRODUCTS.flatMap(p => p.useCases))].sort();
  window.TECHNOLOGY_TAGS  = [...new Set(PRODUCTS.flatMap(p => p.technologyTags))].sort();
  window.MEASURED_COMPONENTS = [...new Set(PRODUCTS.flatMap(p => p.measuredComponent))].sort();
})();

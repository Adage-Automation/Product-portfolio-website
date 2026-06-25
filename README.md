# Adage Automation — Product Portal (Phase 1)

## What's in this folder

| File / folder | Purpose |
|------|---------|
| `index.html` | Login page |
| `library.html` | Product directory — searchable, filterable grid |
| `product.html` | Individual product page with OneDrive link |
| `data.js` | Default product data (fallback + local dev seed) |
| `adage-data-editor.html` | Admin editor — save changes to the live portal |
| `api/products.js` | Vercel serverless API — reads/writes product data |
| `js/load-products.js` | Loads products from API when available, else `data.js` |

---

## Why edits weren't showing on the portal

The editor runs entirely in the browser. Until now, changes only existed in memory until you **downloaded** a new `data.js` and **manually replaced** the file in your project.

On Vercel (static hosting), the browser **cannot write** to files on the server. You need:

1. **Vercel KV** — a small database to store products
2. **`/api/products`** — saves admin edits to KV
3. **Save to portal** in the editor — pushes changes live

---

## Deploy on Vercel (recommended)

### Step 1 — Push to GitHub

Push this entire folder to a GitHub repo.

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Deploy (Vercel auto-detects the static site + API routes)

### Step 3 — Connect Vercel KV (required for live saves)

1. In your Vercel project → **Storage** tab → **Create Database** → **KV**
2. Name it (e.g. `adage-products`) and create it
3. Click **Connect to Project** and select this project
4. Redeploy when prompted (Vercel injects `KV_*` environment variables automatically)

### Step 4 — Optional: change admin password

In Vercel → **Settings** → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `ADMIN_PASSWORD` | Your new admin password |

If not set, the default is `Adage@2025`.

### Step 5 — Save products from the editor

1. Log in as `admin@adageautomation.com`
2. Edit a product (or add one)
3. Click **Preview & Download**
4. Click **Save to portal**
5. Refresh the library — changes appear for all users

> **First deploy:** KV is empty, so the site uses `data.js` until the admin saves once. After the first **Save to portal**, KV becomes the live source.

---

## Manual fallback (no KV)

If you don't connect KV, you can still update products manually:

1. Edit in `adage-data-editor.html`
2. **Preview & Download** → **Download backup**
3. Replace `data.js` in your repo
4. Push to GitHub → Vercel redeploys automatically

---

## How to add or update a product (via code)

Open `data.js` and add a new entry to the `PRODUCTS` array:

```js
{
  id: 9,
  name: "Your Product Name",
  company: "Manufacturer Name",
  industry: "Oil & Gas",
  category: "Pressure Measurement",
  description: "One paragraph description visible on the card and product page.",
  onedrive: "https://onedrive.live.com/your-actual-link",
  tags: ["Tag1", "Tag2"],
  image: ""
}
```

Filter options (Industry, Company, Category) are **automatically generated** from the data.

---

## Login credentials (demo)

| Email | Password |
|-------|---------|
| admin@adageautomation.com | Adage@2025 |
| sales@adageautomation.com | Sales@2025 |
| marketing@adageautomation.com | Mktg@2025 |

> **Note:** Demo credentials for Phase 1. Only the admin account can access the editor and save to the portal.

---

## Local development

Opening `index.html` directly in a browser works for viewing, but **Save to portal** requires the Vercel API. For local API testing:

```bash
npm install
npx vercel dev
```

Link a KV store to the project when prompted, or use the manual download workflow locally.

---

## Phase 2 additions (planned)

- In-page PDF catalogue viewer (PDF.js)
- Embedded product videos
- Marketing summaries and key specs sections
- Real backend authentication

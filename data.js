// ============================================================
//  ADAGE AUTOMATION — PRODUCT DATA
//  Edit this file to add, remove, or update products.
//  Each row maps directly to what you'd fill in a spreadsheet.
// ============================================================

const PRODUCTS = [
  {
    id: 1,
    name: "FlowMaster Pro 3000",
    company: "Emerson",
    industry: "Oil & Gas",
    category: "Flow Measurement",
    description: "High-accuracy Coriolis mass flow meter for custody transfer and process control in upstream and midstream applications.",
    onedrive: "https://onedrive.live.com/your-link-here",
    tags: ["Flow", "Coriolis", "Custody Transfer"],
    image: "" // leave blank to show auto-generated placeholder
  },
  {
    id: 2,
    name: "PowerGuard XL Series",
    company: "ABB",
    industry: "Power",
    category: "Protection Relays",
    description: "Numerical protection relay for medium voltage feeders, transformers, and generators with integrated communication.",
    onedrive: "https://onedrive.live.com/your-link-here",
    tags: ["Protection", "MV", "IEC 61850"],
    image: ""
  },
  {
    id: 3,
    name: "SteelSense Analyzer",
    company: "Yokogawa",
    industry: "Steel",
    category: "Process Analyzers",
    description: "Online X-ray fluorescence analyzer for real-time elemental composition monitoring in steel production lines.",
    onedrive: "https://onedrive.live.com/your-link-here",
    tags: ["XRF", "Analyzer", "Quality Control"],
    image: ""
  },
  {
    id: 4,
    name: "ValveMatic Smart Positioner",
    company: "Metso",
    industry: "Oil & Gas",
    category: "Valve Automation",
    description: "HART-compatible digital valve positioner with built-in diagnostics and partial stroke testing capability.",
    onedrive: "https://onedrive.live.com/your-link-here",
    tags: ["Valve", "HART", "Positioner"],
    image: ""
  },
  {
    id: 5,
    name: "ThermoScan 800",
    company: "Endress+Hauser",
    industry: "Power",
    category: "Temperature Measurement",
    description: "Multipoint temperature profiling system for heat exchangers, reactors, and distillation columns.",
    onedrive: "https://onedrive.live.com/your-link-here",
    tags: ["Temperature", "Profiling", "Multipoint"],
    image: ""
  },
  {
    id: 6,
    name: "LevelPro Radar 5G",
    company: "Vega",
    industry: "Steel",
    category: "Level Measurement",
    description: "80 GHz FMCW radar level transmitter for bulk solids and liquids in extreme process conditions.",
    onedrive: "https://onedrive.live.com/your-link-here",
    tags: ["Radar", "Level", "Non-contact"],
    image: ""
  },
  {
    id: 7,
    name: "PressurePilot DP Cell",
    company: "Honeywell",
    industry: "Oil & Gas",
    category: "Pressure Measurement",
    description: "Differential pressure transmitter with remote seals for aggressive media, rated for SIL 2 safety functions.",
    onedrive: "https://onedrive.live.com/your-link-here",
    tags: ["Pressure", "DP", "SIL 2"],
    image: ""
  },
  {
    id: 8,
    name: "MotorGuard VFD Series",
    company: "Siemens",
    industry: "Power",
    category: "Drives & Motors",
    description: "Variable frequency drive for centrifugal pumps and fans, with energy optimization and predictive maintenance features.",
    onedrive: "https://onedrive.live.com/your-link-here",
    tags: ["VFD", "Energy", "Motor Control"],
    image: ""
  }
];

// ============================================================
//  FILTER OPTIONS — auto-generated from product data above
//  (no need to edit this section)
// ============================================================
const INDUSTRIES  = [...new Set(PRODUCTS.map(p => p.industry))].sort();
const COMPANIES   = [...new Set(PRODUCTS.map(p => p.company))].sort();
const CATEGORIES  = [...new Set(PRODUCTS.map(p => p.category))].sort();

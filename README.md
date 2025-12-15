## <samp> LeafByte

<samp>
  
**LeafByte is a Chrome extension provides real-time CO₂ monitoring via dynamic dashboards, gamification, privacy-focused local storage & developer utilities. Emissions are calculated through the Performance API as `data transfer × energy/byte × carbon intensity`, using defaults of 475 g CO₂/kWh and 0.5 kWh/GB, with a 50% reduction applied to green-hosted sites. All processing occurs locally without external APIs, providing accurate insights into energy use, carbon intensity, and digital footprint.**

<details>
  
**<summary>Features</summary>**

* **Provides real-time CO₂ tracking with live display, resource breakdown, and smart badge; includes a dashboard with charts, site analytics, trends, and goals; supports gamification with achievements, levels, and streaks; offers customization with location-based factors, alerts, themes, and data export; ensures privacy with local storage, optional sync, and no external tracking; and includes developer tools for audit mode, optimization suggestions, and debug logging.**

* **Emission Calculation: Utilizes the Performance API to derive `Emissions = Data Transfer × Energy/Byte × Carbon Intensity`; defaults assume 475 g CO₂/kWh global average, 0.5 kWh/GB energy factor, with a 50% reduction applied for renewable‑powered (green hosting) sites.**

* **Technical Overview: Compatible with Chrome v88+ (Manifest V3) and Chromium-based Edge; requires `storage`, `history`, `tabs`, `alarms`, `notifications`, and optional `declarativeNetRequest` permissions; persists emission data/settings in `local` and `sync` storage with all computation performed locally (no external APIs).**


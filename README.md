## <samp> LeafByte

<samp>
  
**Making the web more sustainable, one page at a time.**

**LeafByte is a Chrome extension that tracks and displays the carbon emissions of your web browsing, helping you make more environmentally conscious decisions online.**
<hr>

## Features

**Features**: Provides real-time CO₂ tracking with live display, resource breakdown, and smart badge; includes a comprehensive dashboard (interactive charts, site analytics, trends, goals), gamification (achievements, levels, streaks, sharing), advanced customization (location-based factors, alerts, themes, data export), privacy-first design (local storage, optional sync, no external tracking, retention control), and developer tools (audit mode, optimization suggestions, debug logging, API integration with The Green Web Foundation).


<hr>

## Preview



<p align="left">
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop.png" width="49%" />
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(1).png" width="49%" />
</p>
<p align="left">
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(2).png" width="49%" />
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(3).png" width="48%" />
</p>
<p align="left">
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(4).png" width="49%" />
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(5).png" width="49%" />
</p>

<hr>


## How It Works

**Emission Calculation**: Utilizes the Performance API to derive `Emissions = Data Transfer × Energy/Byte × Carbon Intensity`; defaults assume 475 g CO₂/kWh global average, 0.5 kWh/GB energy factor, with a 50% reduction applied for renewable‑powered (green hosting) sites.



## Technical Details

**Technical Overview**: Compatible with Chrome v88+ (Manifest V3) and Chromium-based Edge; requires `storage`, `history`, `tabs`, `alarms`, `notifications`, and optional `declarativeNetRequest` permissions; persists emission data/settings in `local` and `sync` storage with all computation performed locally (no external APIs).

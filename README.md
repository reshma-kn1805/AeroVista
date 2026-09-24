# AeroVista 3D — Single-Pass Drone Intelligence & 3D Reconstruction

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-38BDF8?style=for-the-badge&logo=github)](https://reshma-kn1805.github.io/AeroVista/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)

**AeroVista 3D** transforms raw monocular drone video into explorable, photogrammetric 3D digital twins with automated scale recovery, 3D object intelligence, explainable quality auditing, and real-time point clouds.

🔗 **Live Deployment Link**: **[https://reshma-kn1805.github.io/AeroVista/](https://reshma-kn1805.github.io/AeroVista/)**

---

## 🚀 Key Capabilities & 3D Digital Twin Environments

AeroVista features **adaptive 3D environment synthesis** tailored to different flight profiles, video headers, and terrain types:

| Environment | Profile | Distinct 3D Features & Models |
| :--- | :--- | :--- |
| **🏔️ Mountain Survey 024** | *Terrain Survey* | High alpine ridges, steep southern ravine, microwave comm mast with red beacon, operations facility, pickup truck |
| **🏗️ Urban Transit Hub Alpha** | *Construction Monitoring* | City street grid with crosswalks, deep foundation excavation pit, **48m Potain Tower Crane**, multi-story concrete core building, mixer trucks |
| **⛏️ Coastal Quarry Pass 1** | *Infrastructure Inspection* | Concentric stepped excavation benches descending into pit, sheer western rock cliff, **coastal ocean water**, heavy Cat excavators, 70-ton haul trucks |
| **⚡ Industrial Substation 03** | *Infrastructure Inspection* | Crushed gravel yard, **400kV step-up transformer units** with radiator fin banks & porcelain bushings, 24m A-frame lattice transmission pylon with overhead busbars |
| **🌾 Valley Agro Canopy Survey** | *Agriculture/Land Analysis* | Rolling agricultural swells, parallel crop furrows, central blue irrigation canal, **twin silver cylindrical grain silos**, agricultural barn, John Deere harvester |
| **⚠️ Seismic Fault & Collapse** | *Disaster Assessment* | Tectonic fault fissure with a 6.4m vertical shear drop, canyon river gorge, **collapsed highway bridge deck**, active landslide rubble mound, emergency mobile command post |
| **📹 Custom Video Ingestion** | *Adaptive / User Video* | Drag-and-drop or upload any drone video file; extracts video headers and deterministically synthesizes custom 3D topography and object layouts |

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript
- **3D Graphics Engine**: Three.js, OrbitControls, PCFSoftShadowMap
- **Icons**: Lucide React
- **Build & Bundler**: Vite 8, Rolldown engine
- **Styling**: Modern dark aerospace glassmorphic UI system (Vanilla CSS tokens)
- **Deployment**: Automated GitHub Pages CI/CD Workflow (`.github/workflows/deploy.yml`)

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/reshma-kn1805/AeroVista.git
cd AeroVista

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 🌐 Deployment

This repository is configured with an automated GitHub Actions workflow (`.github/workflows/deploy.yml`). Pushing to the `main` or `master` branch automatically builds and publishes the production bundle to GitHub Pages at:

👉 **[https://reshma-kn1805.github.io/AeroVista/](https://reshma-kn1805.github.io/AeroVista/)**

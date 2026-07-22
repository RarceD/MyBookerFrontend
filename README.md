<div align="center">

# 🎾 MeApunto.Online

**A modern, cross-platform booking app for private urbanizations in Spain.**

Reserve courts and shared amenities, read community rules, manage your profile, and — as an admin — track usage with live analytics. One React codebase shipping to **web, iOS, and Android**.

Live at **[meapunto.online](https://www.meapunto.online)**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-7-119EFF?logo=capacitor&logoColor=white)

</div>

---

## ✨ Features

| | |
|---|---|
| 🏸 **Court booking** | Browse availability by date, pick a slot, and reserve in a couple of taps. |
| 👥 **Community** | Shared listings and neighbour-facing info for the urbanization. |
| 📜 **Normative** | House rules and regulations, organized in a clean accordion. |
| 👤 **Profile** | Manage personal details and account settings. |
| 🛠️ **Admin panel** | Look up members by code or email and manage bookings. |
| 📊 **Live stats** | Usage analytics and booking trends visualized with Recharts. |
| 🌍 **Multi-language** | Runtime i18n via `react-i18nify`. |
| 📱 **Native apps** | Same code runs as iOS & Android apps through Capacitor. |

## 🧱 Tech Stack

- **Framework** — React 19 + TypeScript, bundled with Vite 5
- **UI** — Material UI (MUI 5) with Emotion styling
- **Routing** — React Router 7 with lazy-loaded, code-split pages
- **Data** — REST API + WebSocket for real-time updates
- **Charts** — Recharts
- **Mobile** — Capacitor 7 (iOS + Android)
- **Storage** — `localforage` / `localStorage` for offline-friendly caching

## 🚀 Getting Started

```sh
# Install dependencies
yarn install        # or: bun install

# Start the dev server
yarn dev            # http://localhost:5173

# Production build (type-check + bundle)
yarn build

# Preview the production build
yarn preview
```

## 📱 Mobile Builds

Powered by Capacitor — build the web app, then sync to the native platforms:

```sh
yarn build
npx cap sync
npx cap open android   # or: npx cap open ios
```

## 🐳 Docker

```sh
docker build -t my-booker-frontend .
docker-compose up          # serves on http://localhost:8000
```

## 📦 Deployment

Deploy a fresh build to the server:

```sh
rm -rf * ; cp /home/ubuntu/dist.zip . ; unzip dist.zip
```

## 🗂️ Project Structure

```
src/
├── api/          # REST + WebSocket clients, auth
├── components/   # Reusable UI (admin, courts, community, profile, …)
├── interfaces/   # TypeScript DTOs & domain models
├── pages/        # Route-level views (Courts, Admin, Stats, Login, …)
├── util/         # Translation & responsive helpers
├── theme.ts      # MUI theme
└── App.tsx       # Router + app shell
```

---
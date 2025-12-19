# NeaPulse – Marketing Site

This repository contains the **landing page** for **NeaPulse**, a real-time editorial intelligence platform for newsrooms.

The site is a **static, performance-focused website** used to explain the product, pricing, and value proposition — it does **not** contain the NeaPulse application or GA4 integration logic.

---

## 🧠 About NeaPulse

NeaPulse helps editorial teams surface:

- real-time audience signals
- momentum spikes
- trending and viral stories

…without digging through analytics dashboards.

This repo is **marketing only**.

---

## 🧱 Tech Stack

- **Vite** – build tool
- **Tailwind CSS** – styling & animations
- **Vanilla JavaScript (ES modules)** – no framework
- **Cloudflare Pages** – hosting & CDN

No React. No Next.js. Minimal and fast.

---

---

## 🚀 Local Development

### Install dependencies
```bash
npm install
npm run dev
```

---

## 🚀 Deployment

### Deploy to Cloudflare Pages with CLI
```bash
rm -rf dist
npm run build
npx wrangler pages deploy dist --project-name neapulse
```
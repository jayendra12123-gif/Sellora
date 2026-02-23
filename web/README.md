# Sellora Web

Customer-facing storefront built with React, Vite, Redux Toolkit, and Tailwind CSS.

## Requirements

- Node.js 18+
- npm 9+

## Environment

From `web/`:

```bash
cp .env.example .env
```

`VITE_API_BASE_URL` should point to your backend base URL (default: `http://localhost:5000`). The app appends `/api`.

## Run

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

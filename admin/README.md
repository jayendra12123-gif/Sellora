# Sellora Admin

Admin dashboard built with React and Vite.

## Requirements

- Node.js 18+
- npm 9+

## Environment

From `admin/`:

```bash
cp .env.example .env
```

`VITE_ADMIN_API_BASE_URL` should point to your backend base URL (default: `http://localhost:5000`). The app appends `/api`.

## Run

From `admin/`:

```bash
npm install
npm run dev
```

App runs at `http://localhost:5174` by default (or the next available port).

**Default admin login (dev only)**
- Email: `admin@sellora.com`
- Password: `Sellora123`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`

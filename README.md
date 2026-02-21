# Sellora

Sellora is a full-stack e-commerce platform with a customer-facing web app, an admin dashboard, and a Node/Express API.

## Highlights

- Authenticated user flows with data isolation
- Cart, orders, saved addresses, and preferences
- React UI with Tailwind CSS
- Separate admin experience

## Apps

- `web/`: Customer storefront (React + Vite)
- `admin/`: Admin dashboard (React + Vite)
- `backend/`: API server (Node.js + Express + MongoDB)

## Tech Stack

- **Frontend:** React, React Router, Redux Toolkit, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)

## Environment Variables

### Backend (`backend/.env`)

- `MONGODB_URI` (required)
- `PORT` (optional, default 5000)
- `CORS_ORIGINS` (optional, comma-separated list of allowed origins)

Example:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sellora
PORT=5000
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Web (`web/.env`)

- `VITE_API_URL` (preferred) full API URL that ends with `/api`
- or `VITE_API_BASE_URL` (fallback) base URL (the app appends `/api`)

### Admin (`admin/.env`)

- `VITE_API_URL` (preferred) full API URL that ends with `/api`
- or `VITE_ADMIN_API_BASE_URL` (fallback) base URL (the app appends `/api`)

## Quick Start (Backend + Web)

```bash
./setup.sh
```

## Manual Setup

### 1) Environment

```bash
cp backend/.env.example backend/.env
cp web/.env.example web/.env
```

Update the values in `backend/.env` and make sure `web/.env` points to the API base URL.

### 2) Backend

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### 3) Web

```bash
cd web
npm install
npm run dev
```

Web app runs at `http://localhost:5173`.

### 4) Admin

```bash
cd admin
npm install
npm run dev
```

Admin app runs at `http://localhost:5174` by default (or the next available port).

## Common Ports

- `5000`: API
- `5173`: Web
- `5174`: Admin

## Scripts

### Web

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

### Admin

- `npm run dev`
- `npm run build`
- `npm run preview`

### Backend

- `npm run dev`
- `npm start`

## Project Structure

```
Sellora/
├── admin/                # Admin dashboard
├── backend/              # API server
├── web/                  # Customer web app
├── setup.sh              # Quick start script (backend + web)
└── README.md
```

## Deployment (Backend on Render + Web/Admin on Vercel)

### 1) Deploy Backend (Render)

Use the `backend/` folder as the project root.

**Env vars**
- `MONGODB_URI` (required)
- `CORS_ORIGINS` (optional, comma-separated list of allowed origins)

**Start command**
- `npm start`

After deploy, note your backend URL, e.g. `https://sellora-5f0s.onrender.com`.

### 2) Deploy Web (Vercel)

Create a Vercel project with **Root Directory** set to `web/`.

**Build settings**
- Build command: `npm run build`
- Output directory: `dist`

**Env vars**
- `VITE_API_URL` = `https://sellora-5f0s.onrender.com/api`

### 3) Deploy Admin (Vercel)

Create another Vercel project with **Root Directory** set to `admin/`.

**Build settings**
- Build command: `npm run build`
- Output directory: `dist`

**Env vars**
- `VITE_API_URL` = `https://sellora-5f0s.onrender.com/api`

### Notes

- Both frontends are Vite SPAs. The included `vercel.json` in each app adds a rewrite so client-side routes don’t 404 on refresh.
- If you change the backend URL, update the Vercel env vars and redeploy the frontends.

## Troubleshooting

- **Frontend shows “Not Found” on refresh**  
  Ensure `web/vercel.json` and `admin/vercel.json` are present for SPA rewrites.
- **API calls failing**  
  Verify `VITE_API_URL` is set in Vercel and redeploy.
- **CORS errors**  
  Add your Vercel domains to `CORS_ORIGINS` on the backend and redeploy Render.

## License

ISC

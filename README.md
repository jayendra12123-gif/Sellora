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

## License

ISC

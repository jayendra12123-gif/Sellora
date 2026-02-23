# Sellora Backend

Node.js + Express API server for Sellora.

## Requirements

- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)

## Environment

From `backend/`:

```bash
cp .env.example .env
```

Key variables:

- `MONGODB_URI`
- `PORT`
- `CORS_ORIGINS`
- `SESSION_TTL_DAYS`
- `PASSWORD_RESET_TTL_MINUTES`
- `BCRYPT_SALT_ROUNDS`
- `PRODUCT_CACHE_MS`
- `ORDER_STATS_CACHE_MS`

## Run (Dev)

```bash
npm install
npm run dev
```

API runs at `http://localhost:5000`.

## Run (Prod)

```bash
npm start
```

## Scripts

- `npm run dev`
- `npm start`

## Default Admin (Dev)

On startup, the server ensures a default admin user exists:
- Email: `admin@sellora.com`
- Password: `Sellora123`

## API Overview

Routes are prefixed with `/api`:

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `PUT /auth/change-password`
- `DELETE /auth/account`

- `GET /products`
- `GET /products/:id`
- `GET /products/search`
- `GET /products/categories`
- `GET /products/collections`

- `GET /cart`
- `POST /cart`
- `PUT /cart/:id`
- `DELETE /cart/:id`

- `GET /orders`
- `POST /orders`
- `GET /orders/:id`
- `POST /orders/:id/cancel`

- `GET /addresses`
- `POST /addresses`
- `PUT /addresses/:id`
- `DELETE /addresses/:id`
- `PATCH /addresses/:id/default`

- `GET /preferences`
- `PUT /preferences`

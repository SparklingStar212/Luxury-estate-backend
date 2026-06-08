# Luxury Estate Backend

This folder contains a lightweight Express API scaffold for the Luxury Estate frontend.

MongoDB is required for runtime data.

## What it includes

- `/api/health`
- `/api/properties`
- `/api/dashboard/overview`
- `/api/dashboard/activity`
- `/api/agents/:id`
- `/api/inquiries`

## Run it

```bash
npm install
npm run dev
```

The server defaults to port `4000`.

## Environment

Create a `.env` file from `.env.example` and set `MONGODB_URI` before starting the server.

## Seed data

```bash
npm run seed
```

This inserts starter documents for properties, agents, inquiries, activity, and dashboard overview.

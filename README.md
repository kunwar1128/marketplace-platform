# Marketplace Platform

A full-stack marketplace platform built with **React**, **Express**, and **PostgreSQL**, designed to scale from a small client website into a Kijiji-style classifieds marketplace.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Auth:** Session-based authentication (cookies), role-based authorization (admin)
- **ORM / DB Access:** `pg` with connection pooling
- **Deployment:** Single-domain (Express serves React build)

## Current Features

- Session-based authentication (admin)
- Secure login/logout with hashed passwords
- Admin-protected API routes
- Admin inbox for contact messages with:
  - message storage
  - read/unread status
  - delete functionality
- Clean backend architecture:
  - routes
  - middleware
  - database layer
- React frontend with auth-aware UI
- One-domain production setup (no CORS in production)

## Architecture Overview

- **React** handles UI and state
- **Express** exposes REST APIs and serves the frontend
- **PostgreSQL** stores users, sessions, and messages
- **Sessions** stored server-side for security
- Clear separation of concerns across frontend and backend

## Project Structure

```text
marketplace-platform/
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   └── index.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── dist/
└── README.md
```

## In Progress / Planned Features

- Marketplace listings (CRUD)
- Browse, search, and filter listings
- User-to-user messaging
- Favorites and saved listings
- Admin moderation tools
- Pagination and performance optimizations
- Production deployment with managed PostgreSQL

## Why This Project

This project is built as a **real-world production system**, focusing on:

- clean architecture
- security best practices
- scalability
- maintainability
- interview-ready design decisions

## Getting Started (Local Development)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Author

### Randhir Multani

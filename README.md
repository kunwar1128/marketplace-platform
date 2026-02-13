# Marketplace Platform

A full-stack marketplace platform built with **React**, **Express**, and **PostgreSQL**, focusing on clean architecture, data integrity, and scalable design. The system supports authenticated users, listings management, and admin moderation, and is designed to evolve into a production-ready classified listings application.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Auth:** Session-based authentication (cookies), role-based authorization
- **ORM / DB Access:** `pg` with connection pooling
- **Deployment:** Single-domain (Express serves React build)

## Current Features

- Session-based authentication (admin)
- Secure login/logout with hashed passwords
- Admin-protected API routes
- Contact form backend with:
  - message storage
  - read/unread status
  - delete functionality
- Marketplace listings:
  - create listings (authenticated users)
  - browse listings (public)
  - frontend CreateListing page
  - backend validation + database constraints
- Clean backend architecture:
  - routes
  - middleware
  - database layer
  - shared validation utilities
- React frontend with:
  - protected routes
  - role-based route guards (admin-only views)
  - auth session validation via `/api/auth/me`
  - Create Listing page (authenticated users)
  - listings browsing with pagination
- One-domain production setup (no CORS in production)

## Architecture Overview

- **React** handles UI and state
- **Express** exposes REST APIs and serves the frontend
- **PostgreSQL** stores users, sessions, and messages
- **Sessions** stored server-side for security
- Clear separation of concerns across frontend and backend

### Frontend Architecture

- React Router v6 with centralized route definitions
- Layout component using `<Outlet />`
- Separation of pages, routes, and shared components
- AbortController for safe async request handling
- API abstraction via shared `apiFetch` utility

## Project Structure

```text
marketplace-platform/
├── backend/
│   ├── db/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── session.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── contact.routes.js
│   │   └── listings.routes.js
│   ├── utils/
│   │   └── validation.js
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiFetch.js
│   │   ├── components/
│   │   │   └── AdminInbox.jsx
│   │   ├── hooks/
│   │   ├── layouts/
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── CreateListing.jsx
│   │   │   ├── ListingsBrowse.jsx
│   │   │   └── Login.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── LoginRoute.jsx
│   │   │   ├── RequireAdmin.jsx
│   │   │   └── RequireAuth.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
└── README.md

```

## In Progress / Planned Features

- Pagination and filtering
- User-to-user messaging
- Favorites and saved listings
- Admin moderation tools
- Database migrations
- Production deployment with managed PostgreSQL

## Data Integrity & Validation

- Input validation at the API layer for clear user feedback
- Database-level constraints to guarantee data integrity
- Shared validation utilities to avoid duplication

## Why This Project

This project is designed with **production-grade architecture**, focusing on:

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

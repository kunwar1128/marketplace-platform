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

### Authentication & Authorization

- Session-based authentication
- Secure login/logout with hashed passwords
- Role-based authorization (admin-only routes)
- Auth session validation via `/api/auth/me`

### Marketplace Listings

- Create listings (authenticated users)
- Frontend CreateListing page
- Client-side validation
- Server-side validation + database constraints
- Browse listings with pagination
- Listing detail page (`/listings/:id`) with full listing info
- Owner-only edit listing
- Owner-only status toggle (active ↔ sold)
- Secure PATCH endpoint for status updates
- Owner-only delete listing
- Full CRUD implementation with ownership enforcement

### Contact System

- Message storage
- Read/unread status
- Delete functionality
- Admin-protected access

### Architecture & Structure

- Clean separation of routes, middleware, and database layers
- Shared validation utilities
- React Router v6 with protected routes
- Layout component using `<Outlet />`
- One-domain production setup (no CORS in production)

## Architecture Overview

- **React** handles UI rendering and client-side state
- **Express** exposes RESTful APIs and serves the frontend build
- **PostgreSQL** stores users, sessions, messages, and listings
- **Session-based authentication** with server-side session storage
- Clear separation of concerns across frontend and backend layers
- RESTful route design (GET, POST, PUT, PATCH, DELETE)
- Ownership enforcement at the API layer for edit, status, and delete operations
- Partial updates implemented using PATCH for resource state changes

### Frontend Architecture

- React Router v6 with centralized route definitions
- Layout component using `<Outlet />`
- Separation of pages, routes, and shared components
- AbortController for safe async request handling
- API abstraction via shared `apiFetch` utility
- ListingDetail page (accessible via `/listings/:id`)
- Clickable listings in Browse page
- Proper error handling for not found listings

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
│   │   └── listings.routes.js   ← (now includes PUT + PATCH)
│   ├── utils/
│   │   └── validation.js        ← (new)
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
│   │   │   ├── EditListing.jsx         ← (new)
│   │   │   ├── ListingsBrowse.jsx
│   │   │   ├── ListingDetail.jsx       ← (new)
│   │   │   └── Login.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── LoginRoute.jsx
│   │   │   ├── RequireAdmin.jsx
│   │   │   └── RequireAuth.jsx
│   │   ├── utils/
│   │   │   └── validateListings.js
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
- production-minded design decisions

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

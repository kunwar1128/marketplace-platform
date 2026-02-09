# Marketplace Platform

A full-stack marketplace platform built with **React**, **Express**, and **PostgreSQL**, focusing on clean architecture, data integrity, and scalable design. The system supports authenticated users, listings management, and admin moderation, and is designed to evolve into a production-ready classified listings application.

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
- Contact form backend with:
  - message storage
  - read/unread status
  - delete functionality
- Marketplace listings backend:
  - create listings (authenticated users)
  - browse listings (public)
  - server-side validation + database constraints
- Clean backend architecture:
  - routes
  - middleware
  - database layer
  - shared validation utilities
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

- React UI for browsing listings
- Create listing form (frontend)
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

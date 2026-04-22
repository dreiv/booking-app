# 🏨 StayEasy | Booking.com Challenge

A full-stack travel booking application built for speed, type-safety, and seamless user experience. Discover unique stays, read community reviews, and book your next trip in seconds.

## 🛠️ Monorepo Structure

This project is managed as an NPM Workspace:

- `client/`: React + Vite + TypeScript (Frontend)
- `server/`: Node.js + Express + Prisma (Backend)

## ⚡ Quick Start

### 1. Environment Setup

You need to define environment variables for both the backend and frontend to communicate.

**Backend (`server/.env`):**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/booking_db"
PORT=3000
```

**Frontend (`client/.env`):**

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Install & Database Setup

From the **root** directory, run the following to get the monorepo ready:

```sh
# Install all dependencies for all workspaces
npm install

# Setup database (Migrate + Seed) via workspace proxy
npm run db:setup
```

### 3. Run Development Mode

This command starts both the Express server and the Vite dev server concurrently.

```sh
npm run dev
```

_Backend: `http://localhost:3000` | Frontend: `http://localhost:5173`_

---

## ⚙️ Tech Stack

**Core:** [Node.js](https://nodejs.org/), [React 19](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)

**Data:** [Prisma ORM](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/), [Zod](https://zod.dev/), [TanStack Query](https://tanstack.com/query/latest)

**Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)

**Quality:** [Oxlint](https://oxc.rs/) (High-speed linting), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Vitest](https://vitest.dev/)

---

## ✅ Quality Control & CI/CD

We use GitHub Actions to ensure code quality before every deployment.

### Unified Scripts (Root)

```sh
npm run fix          # Format code & fix linting errors
npm run type-check   # Validate TS across all workspaces
npm run test         # Run Vitest suite (Client & Server)
npm run build        # Production build for all workspaces
```

### CI/CD Pipeline

The project uses a **GitHub Actions** workflow that:

1. Validates code style (Prettier/Oxlint).
2. Runs Type Checks and Unit/Integration tests.
3. **Automatic Deployment:** Deployment to **Render** is only triggered via "After CI Checks Pass" rule once the suite is green.

---

## 🏗️ Architecture & Trade-offs

### Architecture

- **Workspace References:** Uses TypeScript Project References for strict boundary checking between Client and Server.
- **Oxlint Integration:** Replaced/Supplemented standard ESLint rules with Oxlint for near-instant linting performance in the dev loop.
- **Unified Error Handling:** Global middleware in Express ensures all API errors (including Zod validation) follow a consistent RFC-style JSON structure.

### Trade-offs

- **Shared Workspace:** Opted for a shared folder for Zod schemas to ensure "Single Source of Truth" for types between Frontend and Backend.
- **Manual DB Seed:** Chose a robust seeding script over a heavy SQL dump to ensure the database remains platform-agnostic.

---

## 🤖 LLM Usage Disclosure

This project utilized **AI** as a technical collaborator.

- **Usage:** Optimizing the Monorepo `tsconfig` project references, debugging CI/CD pipeline timeouts, and refining the Vite-Tailwind v4 integration.
- **Guardrails:** All configurations were manually tested. AI was used to explain _why_ TypeScript errors occurred in the workspace graph, not just to provide a "blind fix."

---

### 🎥 Presentation

[Link to your Loom/Video recording here]

### 🌐 Deployment

[Live App on Render](https://booking-app-frontend-g5xa.onrender.com/)

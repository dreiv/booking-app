# 🏨 StayEasy | Booking.com Challenge

A full-stack travel booking application built for speed, type-safety, and seamless user experience. Discover unique stays, read community reviews, and book your next trip in seconds.

## ⚡ Quick Start: Database Setup

Before running the application, ensure your PostgreSQL instance is running and your `.env` is configured.

```sh
# 1. Install dependencies
npm install

# 2. Sync database schema and generate Prisma Client
npx prisma migrate dev

# 3. Populate the database with seed data (Essential)
npx prisma db seed
```

## 🚀 Running the App

The project is organized as a monorepo (or separate folders). Follow these steps to start development:

```sh
npm run dev
```

_Backend runs at `http://localhost:3000` | Frontend runs at `http://localhost:5173`._

## ⚙️ Tech Stack

**Backend:** [Node.js](https://www.google.com/search?q=https://nodejs.org/), [Express](https://www.google.com/search?q=https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [Prisma ORM](https://www.google.com/search?q=https://www.prisma.io/), [Zod](https://www.google.com/search?q=https://zod.dev/)
**Frontend:** [React](https://www.google.com/search?q=https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://www.google.com/search?q=https://tailwindcss.com/)
**Testing:** [Vitest](https://vitest.dev/), [Supertest](https://www.google.com/search?q=https://github.com/ladjs/supertest)
**Quality:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://github.com/typicode/husky)

## 🧪 Testing & Quality

We prioritize high-confidence code through automated testing and strict linting.

```sh
# Run all tests (Server)
npm run test

# Run specific test files with UI
npx vitest --ui

# Quality Checks
npm run lint         # Run ESLint
npm run type-check   # Validate TypeScript types
```

**Testing Highlights:**

- **Integration Tests:** Full API flow testing using Supertest and Prisma mocking.
- **Validation Testing:** Ensuring Zod schemas catch malformed data before hitting the DB.
- **Utility Testing:** Direct unit tests for high-impact helpers like `asyncHandler`.

## 🏗️ Architecture & Trade-offs

### Architecture

- **Layered Pattern:** Controllers handle logic, Schemas (Zod) handle validation, and the Prisma layer handles data persistence.
- **Singleton DB Client:** Implemented a `PrismaClient` singleton to prevent connection exhaustion during hot-reloads.
- **Centralized Error Handling:** A global middleware catches all errors, providing consistent JSON responses for both validation and server-side failures.

### Trade-offs

- **Mocked Payments:** For the short project scope, the checkout flow confirms availability and creates a record in the DB but mocks the 3rd-party payment gateway.
- **Local State vs. Global:** Used React Context/Hooks for stay filtering to keep the bundle light, rather than introducing Redux for a mid-sized scope.
- **Prisma Adapters:** Used the new `@prisma/adapter-pg` for better performance and future-proofing with serverless environments.

## 🤖 LLM Usage Disclosure

This project utilized **AI** as a collaborative partner.

- **Usage:** Brainstorming the singleton pattern for Prisma, refining Zod schema coercions, and generating boilerplate for Vitest integration tests.
- **Prompts:** _"How can I fix 'any' types in an Express asyncHandler?"_, _"Write a Supertest for a paginated GET endpoint."_
- **Guardrails:** All AI-generated code was manually reviewed for type-safety and integrated into a custom architectural pattern to ensure consistency.

## 🔮 What's Next? (If I had more time)

1.  **Real-time Map View:** Integrate Leaflet or Google Maps to show stay locations dynamically.
2.  **Authentication:** Implement JWT-based auth or Clerk for user profiles and "Saved Stays."
3.  **Optimistic UI:** Use TanStack Query to update reviews instantly before the server confirms.
4.  **Image Optimization:** Integrate Cloudinary for responsive images and faster LCP (Largest Contentful Paint).

---

### 🎥 Presentation

[Link to your Loom/Video recording here]

### 🌐 Deployment

[StayEasy](https://booking-app-frontend-g5xa.onrender.com/)

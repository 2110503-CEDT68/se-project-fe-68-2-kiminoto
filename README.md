[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/XWWLhQPu)

# 🚗 Venue Explorer — Frontend

> Next.js frontend for the Car Rental booking platform — browse car providers, manage bookings, and write reviews.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker](#docker)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)

---

## 🛠 Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 15 (App Router, Turbopack)             |
| Language        | TypeScript 5                                   |
| UI Library      | MUI (Material UI) 7                            |
| Styling         | Tailwind CSS 4                                 |
| State Mgmt      | Redux Toolkit + Redux Persist                  |
| Auth            | NextAuth.js 4                                  |
| Date Handling   | Day.js                                         |
| Testing         | Jest + React Testing Library                   |
| Deployment      | Docker (standalone output)                     |

---

## 📂 Project Structure

```
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/            # API route handlers (NextAuth)
│   │   ├── booking/        # Booking detail page
│   │   ├── mybooking/      # My bookings page
│   │   ├── profile/        # User profile page
│   │   ├── privacy-policy/ # Privacy policy page
│   │   ├── signin/         # Sign in page
│   │   ├── signout/        # Sign out page
│   │   ├── signup/         # Sign up page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable React components
│   │   ├── Banner.tsx
│   │   ├── BookingCard.tsx
│   │   ├── BookingForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Profile.tsx
│   │   ├── ProviderList.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── TopMenu.tsx
│   │   └── ...
│   ├── libs/               # API client functions
│   │   ├── authOptions.ts
│   │   ├── createBooking.tsx
│   │   ├── getVenues.tsx
│   │   ├── userLogIn.tsx
│   │   └── ...
│   ├── providers/          # React context providers
│   │   └── NextAuthProvider.tsx
│   └── interface.ts        # Shared TypeScript interfaces
├── Dockerfile              # Multi-stage production build
├── jest.config.js          # Jest configuration
├── next.config.ts          # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Docker** (optional, for containerised setup)
- A running instance of the [backend API](https://github.com/2110503-CEDT68/se-project-be-68-2-kiminoto)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/2110503-CEDT68/se-project-fe-68-2-kiminoto.git
   cd se-project-fe-68-2-kiminoto
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root (see [Environment Variables](#-environment-variables)):

   ```bash
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   NEXTAUTH_SECRET=change-me-in-development
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000) with Turbopack hot-reload.

### Docker

Build and run the frontend as a standalone container:

```bash
# Build the image (pass the backend URL at build time)
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_URL=http://localhost:5000 \
  -t venue-explorer-fe .

# Run the container
docker run -p 3000:3000 venue-explorer-fe
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> 💡 **Tip:** For the full stack (MongoDB + Backend + Frontend), use the `docker-compose.yml` in the [backend repository](https://github.com/2110503-CEDT68/se-project-be-68-2-kiminoto).

---

## 🔐 Environment Variables

| Variable                    | Description                    | Example                   |
| --------------------------- | ------------------------------ | ------------------------- |
| `NEXT_PUBLIC_BACKEND_URL`   | Backend API base URL           | `http://localhost:5000`   |
| `NEXTAUTH_SECRET`           | NextAuth.js signing secret     | *(random string)*         |

> `NEXT_PUBLIC_BACKEND_URL` is baked into the client bundle at **build time**. When using Docker, pass it as a `--build-arg`.

---

## 🧪 Testing

Tests use **Jest** and **React Testing Library**.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📄 License

ISC

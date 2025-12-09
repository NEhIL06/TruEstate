# System Architecture

## Backend Architecture
The backend is built using **Node.js** and **Express**, following a layered architecture to separate concerns and ensure maintainability.
- **API Layer (Controllers):** Handles HTTP requests, validates input using Zod, and sends responses. It acts as the entry point for the application.
- **Service Layer:** Contains the business logic. It processes data, applies rules, and orchestrates database interactions.
- **Data Access Layer (Prisma):** Uses **Prisma ORM** to interact with the **PostgreSQL** database. It provides a type-safe interface for database queries.

## Frontend Architecture
The frontend is a **Next.js** application using the **App Router**, designed for performance and SEO.
- **Component-Based:** Built with **React** components, utilizing **Shadcn UI** for a consistent and accessible design system.
- **State Management:** Uses **Zustand** for global state management (e.g., filters, pagination) to avoid prop drilling.
- **Styling:** **Tailwind CSS** is used for utility-first, responsive styling.
- **Data Fetching:** Custom hooks (e.g., `useTransactions`) abstract API calls and manage loading/error states.

## Data Flow
1.  **User Interaction:** The user interacts with the UI (e.g., types in search, selects a filter).
2.  **State Update:** The interaction updates the global store via Zustand.
3.  **API Request:** The `useTransactions` hook detects state changes and triggers an API call to the backend with updated query parameters.
4.  **Request Processing:** The Express backend receives the request. The Controller validates parameters and calls the Service.
5.  **Database Query:** The Service constructs a Prisma query and executes it against the PostgreSQL database.
6.  **Response:** The database returns data, which is passed back through the Service and Controller to the Frontend.
7.  **UI Update:** The Frontend receives the JSON response and updates the UI to display the new data.

## Folder Structure

### Backend (`/backend`)
- `src/controllers`: Request handlers.
- `src/services`: Business logic.
- `src/models`: Data models and interfaces.
- `src/prisma`: Prisma client configuration.
- `src/utils`: Utility functions and environment configuration.
- `prisma/`: Database schema and migrations.

### Frontend (`/salesmanagement`)
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (charts, tables, filters).
- `hooks/`: Custom React hooks for logic reuse.
- `services/`: API client functions.
- `store/`: Zustand state stores.
- `types/`: TypeScript type definitions.
- `lib/`: Utility functions (e.g., cn helper).

## Module Responsibilities

### Backend Modules
- **TransactionController:** Validates query params and invokes TransactionService.
- **TransactionService:** Implements filtering, sorting, and pagination logic; calls Prisma.
- **Prisma Client:** Manages database connection and query execution.

### Frontend Modules
- **DashboardContent:** Main container orchestrating the dashboard layout.
- **FilterBar:** Manages all filter inputs and updates the store.
- **TransactionTable:** Renders the data grid with formatted values.
- **useTransactionStore:** Holds the "source of truth" for the current view state.
- **api.ts:** Handles HTTP communication with the backend.

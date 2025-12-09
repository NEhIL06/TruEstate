# TruEstate Sales Management System

## Overview
TruEstate is a comprehensive sales management dashboard designed to track and analyze transaction data. It provides real-time insights into sales performance, customer demographics, and product trends. The system features a responsive UI with advanced filtering, searching, and data visualization capabilities, backed by a robust Node.js API and PostgreSQL database.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn UI, Zustand, Recharts.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
- **Tools:** pnpm/npm, Git.

## Search Implementation Summary
The search functionality allows users to find transactions by **Customer Name** or **Phone Number**.
- **Frontend:** A debounced search input updates the global transaction store.
- **Backend:** The API performs a case-insensitive `contains` query on both `customerName` and `phoneNumber` fields using Prisma's `OR` operator.

## Filter Implementation Summary
Users can filter data across multiple dimensions to narrow down the dataset.
- **Supported Filters:** Region, Gender, Age Range, Product Category, Tags, Payment Method, and Date Range.
- **Frontend:** Multi-select dropdowns and range pickers update the store. Active filters are passed as query parameters.
- **Backend:** The service constructs a dynamic `where` clause in Prisma, using `in` for arrays, `gte`/`lte` for ranges, and `hasSome` for tags.

## Sorting Implementation Summary
Data can be sorted to highlight recent transactions or high-value orders.
- **Options:** Date, Quantity, Customer Name.
- **Direction:** Ascending or Descending.
- **Backend:** Prisma's `orderBy` is used to sort the result set based on the requested field and direction.

## Pagination Implementation Summary
Efficient data loading is achieved through server-side pagination.
- **Frontend:** Pagination controls allow navigation between pages. The current page and page size are managed in the store.
- **Backend:** Uses `skip` and `take` to fetch only the required subset of records. Returns metadata including `totalItems`, `totalPages`, and `currentPage`.

## Setup Instructions

### Backend
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up environment variables: Copy `.env.example` to `.env` and configure `DATABASE_URL`.
4. Run migrations: `npx prisma migrate dev`
5. Start the server: `npm run dev`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

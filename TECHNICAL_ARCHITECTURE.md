# Bankify Technical Architecture

This document outlines the technical architecture for the Bankify application.

## 1. System Architecture

Bankify will be a monolithic application built on Next.js. The frontend and backend will be tightly coupled within the same Next.js project. This approach simplifies development and deployment for a project of this scale.

- **Frontend:** Built with React and server-side rendering (SSR) or static site generation (SSG) from Next.js for performance.
- **Backend:** Implemented using Next.js API routes.
- **Database:** A PostgreSQL database will be used for data persistence.
- **ORM:** Prisma will be used to interact with the database, providing a type-safe API.
- **Authentication:** NextAuth.js will be used for authentication, supporting various providers if needed in the future.

## 2. Database Schema

The database schema is designed to support the core features of the application.

```prisma
// This is a schema definition for Prisma.
// You can update it as needed.

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String       @id @default(cuid())
  name          String?
  email         String?      @unique
  emailVerified DateTime?
  image         String?
  role          UserRole     @default(CLIENT)
  accounts      Account[]
  sessions      Session[]
  agentId       String?
  agent         User?        @relation("AgentClients", fields: [agentId], references: [id])
  clients       User[]       @relation("AgentClients")
  transactions  Transaction[]
  budgets       Budget[]
  goals         Goal[]
  loans         Loan[]
  documents     Document[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum UserRole {
  CLIENT
  AGENT
  ADMIN
}

model Transaction {
  id          String   @id @default(cuid())
  amount      Float
  type        String // e.g., "deposit", "withdrawal", "transfer"
  description String?
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

model Budget {
  id        String   @id @default(cuid())
  name      String
  amount    Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

model Goal {
  id           String   @id @default(cuid())
  name         String
  targetAmount Float
  currentAmount Float
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  userId       String
  user         User     @relation(fields: [userId], references: [id])
}

model Loan {
  id        String     @id @default(cuid())
  amount    Float
  purpose   String
  status    LoanStatus @default(PENDING)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  documents Document[]
}

enum LoanStatus {
  PENDING
  APPROVED
  REJECTED
}

model Document {
  id        String   @id @default(cuid())
  url       String
  type      String // e.g., "ID", "Proof of Income"
  createdAt DateTime @default(now())
  loanId    String?
  loan      Loan?    @relation(fields: [loanId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

## 3. API Design

The API will be implemented as RESTful endpoints using Next.js API routes.

- `POST /api/auth/*`: Handled by NextAuth.js for authentication.
- `GET /api/users`: Get a list of users (Admin only).
- `GET /api/users/{id}`: Get a user by ID.
- `PUT /api/users/{id}`: Update a user.

- `GET /api/transactions`: Get a list of transactions for the current user.
- `POST /api/transactions`: Create a new transaction.

- `GET /api/budgets`: Get a list of budgets for the current user.
- `POST /api/budgets`: Create a new budget.
- `PUT /api/budgets/{id}`: Update a budget.
- `DELETE /api/budgets/{id}`: Delete a budget.

- `GET /api/goals`: Get a list of goals for the current user.
- `POST /api/goals`: Create a new goal.
- `PUT /api/goals/{id}`: Update a goal.
- `DELETE /api/goals/{id}`: Delete a goal.

- `GET /api/loans`: Get a list of loans for the current user.
- `POST /api/loans`: Create a new loan application.
- `GET /api/loans/{id}`: Get a loan by ID.
- `PUT /api/loans/{id}`: Update a loan (Admin only).

- `POST /api/documents/upload`: Upload a document.

## 4. Next.js Folder Structure

The project will follow the standard Next.js `app` directory structure.

```
/app
  /api
    /auth
      /[...nextauth]
        /route.ts  // NextAuth.js handler
    /users
    /transactions
    /budgets
    /goals
    /loans
    /documents
  /agent
    /commission
    /history
    /transaction
    /verification
    /page.tsx
  /client
    /budget
    /goals
    /history
    /page.tsx
  /loan
    /apply
    /compliance
    /documents
    /status
    /page.tsx
  /layout.tsx
  /page.tsx
/components
  /layout
  /providers
  /shared
  /ui
/lib
  /prisma.ts
  /utils.ts
/prisma
  /schema.prisma
```

This structure separates concerns and aligns with the modular nature of the application.

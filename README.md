# QueueFlow

> **Book your time. Skip the wait.**

QueueFlow is a modular booking and appointment platform designed to support multiple booking-based services from a single ecosystem.

The platform is designed to support:

* Doctor appointments
* Hotel and room reservations
* Vehicle service appointments
* Salon and personal care bookings
* Restaurant reservations
* Local service bookings
* Queue/token management
* Future booking modules

The project uses a **monorepo architecture**, where each major module can have its own independent Next.js application while sharing common UI components, types, authentication, utilities, and backend services.

---

# Table of Contents

* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [What is Portal?](#what-is-portal)
* [What is Business?](#what-is-business)
* [Applications](#applications)
* [Shared Packages](#shared-packages)
* [Backend](#backend)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Running the Entire Project](#running-the-entire-project)
* [Running Individual Applications](#running-individual-applications)
* [Running the Backend](#running-the-backend)
* [Building the Project](#building-the-project)
* [Installing Packages](#installing-packages)
* [Creating a New Module](#creating-a-new-module)
* [Creating a Shared Package](#creating-a-shared-package)
* [Environment Variables](#environment-variables)
* [Git Workflow](#git-workflow)
* [Commit Guidelines](#commit-guidelines)
* [Branching](#branching)
* [Pulling Latest Changes](#pulling-latest-changes)
* [Before Pushing](#before-pushing)
* [Production Build](#production-build)
* [Development Ports](#development-ports)
* [Architecture Rules](#architecture-rules)
* [Future Modules](#future-modules)

---

# Architecture

QueueFlow uses a **monorepo architecture**.

The repository contains multiple independent applications and shared packages.

```text
                              QUEUEFLOW
                                  |
                 +----------------+----------------+
                 |                                 |
           Customer Side                     Business Side
                 |                                 |
             Portal App                     Business App
                 |                                 |
                 +----------------+----------------+
                                  |
                            Node.js API
                                  |
                 +----------------+----------------+
                 |                |                |
              Doctor           Hotel           Vehicle
              Module           Module           Module
                 |                |                |
                 +----------------+----------------+
                                  |
                               MongoDB
```

The important concept is:

```text
One repository
      |
      +-- Multiple Next.js applications
      |
      +-- One common backend
      |
      +-- Shared packages
```

This allows each business module to evolve independently without creating completely separate repositories.

---

# Project Structure

```text
queueflow/
│
├── apps/
│   │
│   ├── portal/
│   │   └── Customer-facing QueueFlow application
│   │
│   ├── business/
│   │   └── Business management application
│   │
│   ├── doctor/
│   │   └── Doctor appointment module
│   │
│   ├── hotel/
│   │   └── Hotel and room booking module
│   │
│   ├── vehicle/
│   │   └── Vehicle service module
│   │
│   └── restaurant/
│       └── Restaurant reservation module
│
├── packages/
│   │
│   ├── ui/
│   │   └── Shared UI and shadcn components
│   │
│   ├── types/
│   │   └── Shared TypeScript types
│   │
│   ├── validators/
│   │   └── Shared Zod validation schemas
│   │
│   ├── api-client/
│   │   └── Shared API communication layer
│   │
│   ├── auth/
│   │   └── Shared authentication utilities
│   │
│   ├── config/
│   │   └── Shared configuration
│   │
│   └── utils/
│       └── Shared utility functions
│
├── services/
│   │
│   └── api/
│       └── Node.js + Express backend
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# What is Portal?

The **Portal** is the main customer-facing QueueFlow application.

It is NOT a doctor application.

It is NOT a hotel application.

It is NOT a vehicle service application.

It is the **common customer platform**.

For example:

```text
queueflow.com
```

The portal allows a customer to:

* Register
* Login
* Manage their profile
* Discover services
* Search businesses
* View different booking categories
* See upcoming bookings
* View booking history
* Receive notifications
* Manage saved businesses
* Manage payments
* Access settings

Example:

```text
Customer opens QueueFlow
        |
        +-- Doctor
        |
        +-- Hotel
        |
        +-- Vehicle Service
        |
        +-- Restaurant
        |
        +-- Salon
        |
        +-- More
```

The Portal should focus on **discovery and common customer functionality**.

---

# Portal Responsibilities

The portal owns:

```text
Authentication
User Profile
Discover
Search
My Bookings
Booking History
Notifications
Saved Businesses
Payments
Settings
```

The portal should NOT contain detailed domain-specific functionality.

For example:

Do NOT put:

```text
Doctor prescription management
Hotel room inventory
Vehicle job cards
Restaurant kitchen management
```

inside the portal.

Those belong to their respective modules.

---

# Business Application

The Business application is for businesses that use QueueFlow.

Example:

```text
business.queueflow.com
```

A business owner can manage:

* Business profile
* Services
* Availability
* Appointments
* Queue
* Customers
* Staff
* Payments
* Reports
* Notifications

The interface can adapt depending on the business type.

For example:

### Doctor

```text
Dashboard
Doctors
Patients
Appointments
Schedule
Queue
Payments
Reports
```

### Hotel

```text
Dashboard
Rooms
Reservations
Guests
Availability
Check-in
Payments
Reports
```

### Vehicle Workshop

```text
Dashboard
Job Cards
Vehicles
Customers
Technicians
Queue
Parts
Payments
Reports
```

---

# Applications

Each application inside `apps/` is an independent Next.js project.

## Portal

```text
apps/portal
```

Customer-facing application.

---

## Business

```text
apps/business
```

Business management application.

---

## Doctor

```text
apps/doctor
```

Doctor-specific customer/business functionality.

---

## Hotel

```text
apps/hotel
```

Hotel and room booking functionality.

---

## Vehicle

```text
apps/vehicle
```

Vehicle service and workshop functionality.

---

## Restaurant

```text
apps/restaurant
```

Restaurant reservation functionality.

---

# Shared Packages

The `packages/` directory contains code shared between applications.

---

## UI

```text
packages/ui
```

Contains common UI components.

Examples:

```text
Button
Card
Dialog
Input
Select
Table
Dropdown
Toast
Modal
DatePicker
```

The goal is:

```text
@queueflow/ui
      |
      +-- Portal
      +-- Business
      +-- Doctor
      +-- Hotel
      +-- Vehicle
```

Do not duplicate common UI components inside every application.

---

# Types

```text
packages/types
```

Contains shared TypeScript types.

Example:

```ts
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";
```

All applications can use the same type.

---

# Validators

```text
packages/validators
```

Contains shared Zod schemas.

Example:

```ts
import { z } from "zod";

export const bookingSchema = z.object({
  date: z.string(),
  status: z.string(),
});
```

---

# API Client

```text
packages/api-client
```

Contains reusable API functions.

Example:

```ts
bookingApi.create()
bookingApi.cancel()
bookingApi.getById()
```

This prevents every application from creating its own API logic.

---

# Auth

```text
packages/auth
```

Contains common authentication utilities.

The goal is to provide a common QueueFlow account across all modules.

```text
QueueFlow Account
       |
       +-- Portal
       +-- Doctor
       +-- Hotel
       +-- Vehicle
       +-- Restaurant
```

---

# Backend

The backend is located at:

```text
services/api
```

Technology:

```text
Node.js
Express.js
TypeScript
MongoDB
Mongoose
Zod
JWT
```

Backend modules should be separated by domain.

```text
services/api/src/modules/

auth/
users/
businesses/
bookings/
notifications/
payments/

doctor/
hotel/
vehicle/
restaurant/
```

---

# Prerequisites

Install:

* Node.js
* pnpm
* Git
* MongoDB or MongoDB Atlas

Check Node:

```bash
node -v
```

Check pnpm:

```bash
pnpm -v
```

Check Git:

```bash
git --version
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project:

```bash
cd queueflow
```

Install all workspace dependencies:

```bash
pnpm install
```

This installs dependencies for:

```text
apps/*
packages/*
services/*
```

---

# Running the Entire Project

From the root:

```bash
pnpm dev
```

Turborepo will start all applications that contain a `dev` script.

Example:

```text
Portal      → 3000
Business    → 3001
Doctor      → 3002
Hotel       → 3003
Vehicle     → 3004
API         → 5000
```

---

# Running Individual Applications

You do not need to start the entire project every time.

## Portal

```bash
pnpm --filter portal dev
```

---

## Business

```bash
pnpm --filter business dev
```

---

## Doctor

```bash
pnpm --filter doctor dev
```

---

## Hotel

```bash
pnpm --filter hotel dev
```

---

## Vehicle

```bash
pnpm --filter vehicle dev
```

---

# Running Backend Only

```bash
pnpm --filter @queueflow/api dev
```

---

# Installing Packages

There are three important cases.

---

## Install package for one application

Example: install Axios only for Portal.

```bash
pnpm --filter portal add axios
```

Install React Query only for Doctor:

```bash
pnpm --filter doctor add @tanstack/react-query
```

Install a development package:

```bash
pnpm --filter portal add -D some-package
```

---

# Install a package for the backend

Example:

```bash
pnpm --filter @queueflow/api add multer
```

Development package:

```bash
pnpm --filter @queueflow/api add -D @types/multer
```

---

# Install a shared package

Example:

```bash
pnpm --filter @queueflow/validators add zod
```

---

# Install a package at the root

Only install something at root if it is needed by the monorepo itself.

Example:

```bash
pnpm add -D prettier -w
```

The `-w` means:

```text
workspace root
```

Do NOT install normal application dependencies at the root unnecessarily.

---

# Adding shadcn Components

For an application that owns its own shadcn configuration:

```bash
cd apps/portal
pnpm dlx shadcn@latest add button
```

However, the long-term goal is to keep reusable UI components inside:

```text
packages/ui
```

Shared components should be imported as:

```ts
import { Button } from "@queueflow/ui";
```

---

# Creating a New Module

Suppose we want to add:

```text
Restaurant
```

Create the application:

```bash
pnpm create next-app@latest apps/restaurant
```

Use the same configuration as the existing applications:

```text
TypeScript
ESLint
React Compiler
Tailwind CSS
src/
App Router
Turbopack
@/*
```

Then install required module-specific packages:

```bash
pnpm --filter restaurant add <package>
```

The new application becomes:

```text
apps/
├── portal/
├── business/
├── doctor/
├── hotel/
├── vehicle/
└── restaurant/
```

---

# Creating a New Backend Module

Create:

```text
services/api/src/modules/restaurant/
```

Recommended structure:

```text
restaurant/
├── restaurant.controller.ts
├── restaurant.service.ts
├── restaurant.routes.ts
├── restaurant.model.ts
├── restaurant.validation.ts
└── restaurant.repository.ts
```

Then register the routes in the API router.

---

# Module Rules

Each module should own its domain logic.

For example:

```text
doctor/
```

owns:

```text
Doctor
Patient
Doctor Schedule
Appointment
Consultation
Doctor Queue
```

Hotel owns:

```text
Hotel
Room
Room Type
Availability
Reservation
Guest
Check-in
Check-out
```

Vehicle owns:

```text
Workshop
Vehicle
Service
Technician
Job
Queue
```

Do not put these domain-specific models into generic folders.

---

# Common Booking Core

QueueFlow should have a common booking concept.

Common booking functionality:

```text
Create
Confirm
Cancel
Reschedule
Complete
Payment
Notification
Customer
Business
Date
Time
```

Domain-specific rules remain inside each module.

Example:

```text
Doctor
   |
   +-- Common Booking
   |
   +-- Doctor Schedule
   +-- Patient
   +-- Consultation

Hotel
   |
   +-- Common Booking
   |
   +-- Room
   +-- Availability
   +-- Guest
```

---

# Environment Variables

Each application can have its own environment variables.

Example:

```text
apps/portal/.env.local
apps/business/.env.local
apps/doctor/.env.local

services/api/.env
```

Example Portal:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Example API:

```env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/queueflow

JWT_SECRET=your_secret_here

CLIENT_URL=http://localhost:3000
```

Never commit `.env` files containing secrets.

---

# Git Workflow

Before starting work:

```bash
git pull origin main
```

Check status:

```bash
git status
```

Check branches:

```bash
git branch
```

---

# Create a Feature Branch

Never develop major features directly on `main`.

Example:

```bash
git checkout -b feature/doctor-booking
```

Other examples:

```bash
git checkout -b feature/hotel-booking
git checkout -b feature/vehicle-queue
git checkout -b feature/authentication
git checkout -b fix/booking-validation
```

---

# Check Changed Files

```bash
git status
```

See changes:

```bash
git diff
```

---

# Add Changes

Add everything:

```bash
git add .
```

Or add specific files:

```bash
git add apps/portal/src/app/page.tsx
```

---

# Commit Changes

Use meaningful commit messages.

Example:

```bash
git commit -m "feat: add customer booking flow"
```

Other examples:

```bash
git commit -m "fix: resolve booking validation issue"

git commit -m "feat: add vehicle queue management"

git commit -m "feat: add doctor appointment module"

git commit -m "refactor: improve shared booking service"

git commit -m "style: update portal landing page"

git commit -m "docs: update project documentation"
```

---

# Push Branch

```bash
git push origin feature/doctor-booking
```

For the first push:

```bash
git push -u origin feature/doctor-booking
```

Then create a Pull Request on GitHub.

---

# Main Branch

Do not normally push directly to:

```text
main
```

Recommended workflow:

```text
main
 |
 +-- feature/auth
 |
 +-- feature/doctor
 |
 +-- feature/hotel
 |
 +-- fix/booking
```

After testing and review:

```text
feature/doctor
       ↓
Pull Request
       ↓
main
```

---

# Pull Latest Changes

Before starting new work:

```bash
git checkout main
git pull origin main
```

Then create your new branch:

```bash
git checkout -b feature/new-feature
```

---

# Before Pushing

Always run:

```bash
pnpm lint
```

Then:

```bash
pnpm typecheck
```

Then:

```bash
pnpm build
```

If everything passes:

```bash
git add .
git commit -m "feat: your change"
git push
```

---

# Building the Entire Project

From root:

```bash
pnpm build
```

Turborepo will build the workspace applications.

---

# Building an Individual Application

Portal:

```bash
pnpm --filter portal build
```

Business:

```bash
pnpm --filter business build
```

Doctor:

```bash
pnpm --filter doctor build
```

Hotel:

```bash
pnpm --filter hotel build
```

Vehicle:

```bash
pnpm --filter vehicle build
```

---

# Linting

All applications:

```bash
pnpm lint
```

Individual application:

```bash
pnpm --filter portal lint
```

---

# Type Checking

All applications:

```bash
pnpm typecheck
```

Individual application:

```bash
pnpm --filter portal typecheck
```

---

# Cleaning the Project

If dependencies or builds become corrupted:

```bash
rm -rf node_modules
```

Remove Next.js build folders:

```bash
find apps -name ".next" -type d -prune -exec rm -rf {} +
```

Then reinstall:

```bash
pnpm install
```

Do not delete `pnpm-lock.yaml` unless there is a specific reason.

---

# Development Ports

Recommended local development ports:

| Application | Port |
| ----------- | ---: |
| Portal      | 3000 |
| Business    | 3001 |
| Doctor      | 3002 |
| Hotel       | 3003 |
| Vehicle     | 3004 |
| Restaurant  | 3005 |
| API         | 5000 |

Example URLs:

```text
Portal
http://localhost:3000

Business
http://localhost:3001

Doctor
http://localhost:3002

Hotel
http://localhost:3003

Vehicle
http://localhost:3004

API
http://localhost:5000
```

---

# Architecture Rules

## Rule 1 — Keep applications independent

Each application inside:

```text
apps/
```

must be independently buildable.

---

## Rule 2 — Shared functionality goes into packages

If something is used by multiple applications:

```text
packages/
```

is usually the correct location.

Example:

```text
Button
Modal
BookingStatus
UserType
Zod schemas
API client
```

---

## Rule 3 — Do not duplicate common components

Avoid:

```text
portal/components/Button
doctor/components/Button
hotel/components/Button
```

Prefer:

```text
packages/ui
```

---

## Rule 4 — Domain logic belongs to the domain

Doctor logic:

```text
modules/doctor
```

Hotel logic:

```text
modules/hotel
```

Vehicle logic:

```text
modules/vehicle
```

---

## Rule 5 — Portal is not the backend

The Portal communicates with:

```text
services/api
```

It should not directly connect to MongoDB.

Correct:

```text
Portal
  ↓
API
  ↓
MongoDB
```

Incorrect:

```text
Portal
  ↓
MongoDB
```

---

# Recommended Development Order

Do not build every module immediately.

Build in this order:

```text
1. Monorepo
       ↓
2. Shared UI
       ↓
3. Authentication
       ↓
4. User system
       ↓
5. Business system
       ↓
6. Booking Core
       ↓
7. Portal
       ↓
8. Business Portal
       ↓
9. First business module
       ↓
10. Additional modules
```

---

# First Business Module

The recommended first module is:

```text
Vehicle Service
```

because it provides a good combination of:

```text
Appointment
Queue
Business
Customer
Service
Technician
Status
Payment
```

After the architecture is proven:

```text
Vehicle
   ↓
Doctor
   ↓
Hotel
   ↓
Restaurant
   ↓
Salon
   ↓
Other Services
```

---

# Long-Term Vision

QueueFlow should eventually become:

```text
                    QUEUEFLOW
                       |
       +---------------+---------------+
       |               |               |
    CUSTOMER        BUSINESS        ADMIN
       |               |               |
       +---------------+---------------+
                       |
                 BOOKING CORE
                       |
       +---------------+---------------+
       |               |               |
     DOCTOR          HOTEL          VEHICLE
       |               |               |
   Appointment      Rooms          Service
   Patients         Booking        Queue
   Queue            Guests         Job
       |
       +---------------+---------------+
                       |
                  MORE MODULES
                       |
       +---------------+---------------+
       |               |               |
    Restaurant       Salon          Events
```

The goal is to maintain:

**One QueueFlow account.**

**One customer experience.**

**One business platform.**

**Multiple specialized booking modules.**

---

# Quick Command Reference

## Install everything

```bash
pnpm install
```

## Start everything

```bash
pnpm dev
```

## Start Portal

```bash
pnpm --filter portal dev
```

## Start Business

```bash
pnpm --filter business dev
```

## Start API

```bash
pnpm --filter @queueflow/api dev
```

## Build everything

```bash
pnpm build
```

## Lint everything

```bash
pnpm lint
```

## Type check everything

```bash
pnpm typecheck
```

## Install package in one app

```bash
pnpm --filter portal add axios
```

## Install backend package

```bash
pnpm --filter @queueflow/api add multer
```

## Install root package

```bash
pnpm add -D prettier -w
```

## Create a new Next.js module

```bash
pnpm create next-app@latest apps/<module-name>
```

## Git status

```bash
git status
```

## Git pull

```bash
git pull origin main
```

## Create branch

```bash
git checkout -b feature/<feature-name>
```

## Commit

```bash
git add .
git commit -m "feat: description"
```

## Push

```bash
git push -u origin <branch-name>
```

---

# Important

QueueFlow is intentionally designed as a **modular monorepo**, not as a collection of unrelated applications.

Before adding a new feature, ask:

> Is this specific to one module, or is it common to QueueFlow?

If it is common:

```text
packages/
```

If it belongs to a specific application:

```text
apps/<module>/
```

If it is backend domain logic:

```text
services/api/src/modules/<module>/
```

This rule should be followed throughout the project to keep the codebase maintainable as QueueFlow grows.

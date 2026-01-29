# Frontend Engineer Assessment – Solution

Construction Management – Drawings & Revisions Module

This repository contains my solution to the Frontend Engineer Technical Assessment.
The project demonstrates real API integration, real-time data synchronization, robust error handling, and scalable frontend architecture using React + TypeScript.

🔧 Tech Stack
React 18
TypeScript
Redux Toolkit
RTK Query
React Router v6
Tailwind CSS
WebSockets
Vite
📋 Assignment Requirements & Implementation

# Below is a direct mapping of assessment requirements to the implemented solution.

✅ Task 1: API Integration (40%)
Requirements

Replace mock data with real API calls

Create reusable API utilities

Handle authentication tokens

Support pagination, filtering, and searching

# Implementation

🔹 Centralized API Layer

Implemented a reusable API client using RTK Query

Created a global baseQueryWithInterceptor:

Automatically attaches JWT token

Handles 401 Unauthorized globally

Logs out the user on token expiration

🔹 API Modules

# authApi – login, forgot password, reset password

# drawingsApi – CRUD operations, status updates, file upload

notificationsApi – notifications list & unread count

userApi – user management

roleApi – role & permission management

Each API supports:

Pagination

Query parameters

Cache invalidation

Fully type-safe responses

✅ Task 2: Real-Time Data Handling (30%)
Requirements

Real-time updates using WebSockets

UI updates without manual refresh

# Implementation

🔹 WebSocket Integration

WebSocket connection established after login

Automatically disconnected on logout

Listens for notification events

# connectSocket(userId, role)

🔹 Real-Time UI Updates

On receiving a notification:

Refresh unread notification count

Refresh notifications list

Refresh drawings list

Display toast notification

Play notification sound

This ensures live UI synchronization without page reloads.

✅ Task 3: Error Handling & UX (20%)
Requirements

Graceful error handling

User-friendly messages

Loading and empty states

# Implementation

🔹 API Error Handling

Global handling for:

401 Unauthorized

Permission & access errors

Displays meaningful backend error messages

Auto logout on invalid token

🔹 UI / UX Enhancements

Shimmer loaders for tables

Empty state messages

Confirmation modals for delete actions

Disabled buttons during API calls

Dedicated Access Denied screen for unauthorized users

✅ Task 4: Code Quality & Structure (10%)

# Implementation

Modular, feature-based folder structure

Clear separation of concerns

Feature-based RTK Query slices

Reusable custom hooks:

useClickOutside

useActionMenuOutside

Fully typed components & APIs

Business logic separated from UI

Consistent naming conventions & formatting

# 🚀 Key Features Implemented

📁 Drawings & Revisions

Create / Edit / View / Delete drawings

File upload & download

Revision status control (Approve / Reject / Review)

Bulk selection & deletion

Export data (CSV / Excel / PDF)

Pagination, search & filters

🔐 Authentication & Authorization

JWT-based authentication

Protected routes

Role-based access control

Unauthorized access handling

🔔 Notifications

Real-time push notifications

Unread count badge

Pagination & filters

Mark-as-read functionality

# 👥 Role-Based Access Control

Role Access Level
SUPER_ADMIN Full CRUD + status updates
MANAGER View & limited actions
Others Read-only / restricted
📁 Project Structure
src/
├── app/
├── features/
│ ├── auth/
│ ├── drawings&controls/
│ ├── notifications/
│ ├── users/
│ └── roles/
├── components/
│ ├── common/
│ ├── header/
│ └── Documents&Control/
├── hooks/
├── routes/
├── utils/
├── socket/
├── App.tsx
└── main.tsx

# ▶️ How to Run the Project

npm install
npm run dev

Environment Variable
VITE_API_BASE_URL=your_api_url

##### 🔐 Demo Credentials

## Super Admin

Email: addisababa_admin@yopmail.com
Password: Admin@12345

## Project Manager

Email: johnsingh@gmail.com
Password: Test@123

## 🔄 Live Notification Flow (Demo)

Login as Project Manager
Create a new drawing
Super Admin receives a real-time notification
Super Admin approves/rejects the drawing
Project Manager receives real-time status notification

## 🌐 Production Deployment

Live URL:

# 👉 https://constructionmgtapp.netlify.app

Connectivity

A full-stack web application that helps students and professionals remember meaningful details about the people they interact with, combining contacts, timestamped notes, and personal context into one unified tool.


Problem

I wanted a way to keep track of classmates, coworkers, and organization members, not just their names, but the small details that matter: conversations, shared experiences, responsibilities, and personal preferences. I also wanted a place to remind me about those details that need to be followed up on. Existing apps either store contacts or store notes, but none combine both in a way that feels natural.


Solution

Connectivity is a multi-user web app that lets users:
Create contacts
Add timestamped notes
Add follow-up events
Search through personal history
Access data across devices
Reset passwords securely
Manage their profile

It’s built as a production-grade full-stack application with authentication, protected routes, relational data, and a polished UI.


Technical Architecture

Frontend: React + Vite
Backend: Node.js + Express
Database: PostgreSQL + Prisma ORM
Auth: JWT-based authentication with bcrypt password hashing
Deployment:
Backend → Render
Database → Supabase
Frontend → Netlify
Mobile-ready: Architecture supports future Expo/React Native client, and PWA is operational
Notes System: Contact → Note, one-to-many relational model
Reset Password Flow: Secure token-based reset with expiration


Key Features

Full authentication system (signup, login, logout, reset password)
Multi-user data isolation
CRUD for contacts
CRUD for timestamped notes
Responsive UI with clean layout
Profile settings page
Search feature
Follow Ups page (to-do-list style)
Fully deployed and accessible online


Engineering Challenges & Solutions

1. First full-stack project
I learned backend routing, database schema design, authentication, and deployment from scratch, relying on documentation, debugging, and iterative testing. (Shout-out Geeks for Geeks articles)

2. Multi-user data isolation
I refactored the backend to ensure each user only sees their own contacts and notes, adding userId relations and protected routes.

3. Notes CRUD bugs
I debugged relational mapping issues between Contact and Note, ensuring stable creation, editing, and deletion.

4. Authentication
I implemented secure JWT auth, bcrypt hashing, protected routes, and a token-based password reset system.

5. Deployment
I deployed a full-stack app across three services (Render, Neon, Cloudinary), resolving CORS issues, environment variables, and building pipeline quirks.

6. UI/UX polish
I redesigned the login/signup/reset pages to be responsive, fullscreen, and professional. Choosing a theme color that was professional but friendly was a significant milestone.

Screenshots



Tech Stack

React
Vite
Node.js
Express
PostgreSQL
Prisma
JWT
bcrypt
Neon
Render
Cloudinary


Future Improvements

AI-powered search across notes
Mobile app (Expo)
Contact groups / tagging
Reminders & notifications
Import/export contacts


What I Learned

This project taught me how to build and deploy a full-stack application from scratch. I became comfortable with backend routing, relational databases, authentication, UI design, and debugging complex issues. It also strengthened my ability to learn independently and solve problems with limited guidance.


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

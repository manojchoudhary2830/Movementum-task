# Momentum — Multi-User Task Manager

A responsive, multi-user task manager built with React 18, Firebase (Auth + Firestore), and deployed on Netlify. Costs ₹0 to run on the Firebase Spark plan.

## Features

- Email/password authentication (Firebase Auth)
- Per-user task isolation via Firestore Security Rules
- Real-time sync across tabs and devices
- CRUD: add, edit, delete, complete, reopen
- Search, filter (status + category), and sort (5 modes)
- Statistics: total, active, completed, progress %
- Overdue highlighting
- Responsive + accessible (WCAG-aware)
- Toast notifications

## Tech Stack

- React 18 (Create React App)
- Firebase 10 (Auth + Firestore)
- Netlify (hosting)
- Jest + React Testing Library

## Setup

1. Clone the repo.
2. Create a Firebase project at https://console.firebase.google.com
3. Enable Email/Password auth and Firestore (production mode).
4. Paste the security rules from `firestore.rules` into Firestore → Rules.
5. Register a Web App and copy the config values.
6. Create a `.env` file with the six `REACT_APP_FIREBASE_*` variables.
7. Run:
   ```bash
   npm install
   npm start
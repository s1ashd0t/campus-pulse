# Campus Pulse

Campus Pulse is a React and Firebase web app for tracking student engagement at Purdue University Fort Wayne. Students can discover campus events, RSVP, check in with QR codes, earn points, and redeem rewards. Admin users can manage events, news, users, and analytics.

## Features

- Student sign up and login with Firebase Authentication
- Email/password, Google, and Facebook authentication flows
- Role-based protected routes for students and admins
- Event browsing, event details, registration, and RSVP tracking
- QR code attendance check-in with browser geolocation checks
- Points dashboard, leaderboard, and reward redemption
- News and campus updates from Firestore
- In-app notifications for RSVP and attendance activity
- Admin tools for creating news, creating events, editing events, deleting events, and viewing users
- Analytics dashboard with charts for event attendance, user engagement, categories, and points
- Firebase Cloud Functions for RSVP confirmation emails with calendar attachments

## Tech Stack

- React 18
- Vite 5
- React Router
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting
- Firebase Cloud Functions
- Chart.js and react-chartjs-2
- qr-scanner, html5-qrcode, and qrcode

## Prerequisites

- Node.js 18 or newer
- npm
- A Firebase project
- Firebase CLI, if you plan to deploy or run emulators

## Getting Started

Clone the repository and install the app dependencies:

```bash
git clone https://github.com/s1ashd0t/campus-pulse.git
cd campus-pulse
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

## Firebase Setup

The app is currently configured in `src/firebase.js` for the `campuspulse-pfw` Firebase project. If you are using a different Firebase project, replace the `firebaseConfig` values in that file.

Admin access is controlled through the `role` field on a user document. Set `users/{uid}.role` to `admin` to give that account access to admin-only routes.

## Cloud Functions

The `functions/` directory contains Firebase Functions for RSVP confirmation emails. Install the function dependencies separately:

```bash
cd functions
npm install
```

Use a Gmail app password instead of your normal Google password. If you add real credentials, keep `functions/.env` untracked or add it to your local ignore rules before committing.

Run the functions emulator:

```bash
npm run serve
```

Deploy only the functions:

```bash
npm run deploy
```


## Deployment

Build the frontend before deploying hosting:

```bash
npm run build
firebase deploy --only hosting
```

Deploy functions separately from the `functions/` directory, or from the repository root with Firebase CLI:

```bash
firebase deploy --only functions
```

To deploy hosting, functions, and configured Firebase resources together:

```bash
firebase deploy
```

## Development Notes

- QR scanning requires camera access and geolocation permission. Use `localhost` or HTTPS during development.
- The scanner currently checks whether the browser location is within the configured PFW campus bounds before allowing QR scanning.
- RSVP email depends on the callable `sendRsvpEmail` function and the Firestore `onRsvpConfirmed` trigger.
- Reward redemption updates the authenticated user's `points` value in Firestore.
- This project does not currently define an automated test script; use `npm run lint` and `npm run build` as the main verification commands.

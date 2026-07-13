<div align="center">

# 🔥 Blaze Fitness

**A fully offline, local-first gym tracking app built with React Native & Expo.**

[![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK%2056-000020?logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Overview

Blaze Fitness is a mobile workout tracker that runs entirely on-device — no account, no cloud, no internet required. Users can build custom workout plans, log live sessions with a built-in rest timer, track body measurements over time, and set per-day push notification reminders. All data is persisted locally via SQLite.

---

## Features

| Feature | Description |
|---|---|
| **Onboarding** | First-launch profile setup (name, birthday, weight, height) |
| **Dashboard** | Workout streak, weekly count, quick-start, and recent session history |
| **Workout Plans** | Create, describe, reorder (drag-and-drop), and delete plans |
| **Plan Detail** | Add exercises to a plan with target sets, reps, and custom ordering |
| **Active Session** | Live session timer, per-set weight/reps logging, set completion, rest timer with presets (1m / 1.5m / 2m / 3m) |
| **Exercise Library** | Custom exercise database with muscle group tagging, optional GIF/image via URL, drag-to-reorder |
| **Progress — Workouts** | Total workouts, total sets completed, top lifts by volume, full session history |
| **Progress — Measurements** | Log and review body measurements (weight, body fat %, chest, waist, hips, bicep, thigh) |
| **Workout Reminders** | Per-day push notification scheduling with individual time pickers |
| **Settings** | Edit profile, toggle rest timer sound, manage reminders, clear all data |
| **Offline-first** | All data stored in a local SQLite database via `expo-sqlite` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.85 + Expo SDK 56 |
| Language | TypeScript 6 |
| Navigation | React Navigation v7 (native stack + bottom tabs) |
| Database | expo-sqlite (WAL mode, foreign keys) |
| State Management | Zustand v5 |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| Animations | React Native Reanimated 4 |
| Drag & Drop | react-native-draggable-flatlist |
| Notifications | expo-notifications (weekly scheduled triggers) |
| File System | expo-file-system (local image caching) |
| Icons | lucide-react-native |
| Fonts | Nunito Sans (via @expo-google-fonts) |
| Build | EAS Build |

---

## Screenshots

> **TODO** — Add screenshots once the app is running on a device or simulator.

| Dashboard | Active Session | Plans | Progress |
|---|---|---|---|
| ![Dashboard](TODO) | ![Session](TODO) | ![Plans](TODO) | ![Progress](TODO) |

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- For Android: Android Studio + an emulator or physical device with USB debugging
- For iOS: Xcode (macOS only) or the Expo Go app

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/sarozpradhan64/react-native-gym-app.git
cd react-native-gym-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Then press `a` to open on Android, `i` for iOS, or scan the QR code with Expo Go.

### Running a native build (optional)

```bash
# Android
npm run android

# iOS
npm run ios
```

> **Note:** Push notifications require a native build (`expo-dev-client` or EAS Build). They do not work in Expo Go.

---

## Project Structure

```
blaze-gym/
├── assets/                  # App icons and splash screen
├── src/
│   ├── database/
│   │   └── db.ts            # SQLite schema initialization & migrations
│   ├── navigation/
│   │   └── AppNavigator.tsx # Root stack, tab navigator, onboarding gate
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── PlansScreen.tsx
│   │   ├── PlanDetailScreen.tsx
│   │   ├── ActiveSessionScreen.tsx
│   │   ├── ExercisesScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/
│   │   ├── useSessionStore.ts   # Active session ID (Zustand)
│   │   ├── useUserStore.ts      # User profile (Zustand)
│   │   └── useRemindersStore.ts # Per-day reminder state (Zustand)
│   └── utils/
│       └── notifications.ts     # Schedule / cancel push notifications
├── App.tsx                  # Root component, font loading, SQLiteProvider
├── app.json                 # Expo config (name: "Blaze Fitness")
├── tailwind.config.js       # NativeWind / Tailwind config
├── global.css               # NativeWind global styles
└── tsconfig.json
```

---

## Database Schema

The local SQLite database (`gymtracker.db`) contains the following tables:

- `user_profile` — single-row profile (name, birthday, weight, height)
- `workout_plans` — user-created plans with optional description and ordering
- `exercises` — exercise library with muscle group, optional local image, and ordering
- `workout_plan_exercises` — join table linking exercises to plans (sets, reps, order)
- `workout_sessions` — session records with start time, completion time, and duration
- `workout_session_exercises` — per-set logs (weight, reps, completion status)
- `body_measurements` — timestamped body measurement entries
- `workout_reminders` — 7 rows (one per weekday) storing enabled state and time

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Start dev server | `npm start` | Starts Expo dev server |
| Run on Android | `npm run android` | Builds and runs on Android |
| Run on iOS | `npm run ios` | Builds and runs on iOS |
| Run on Web | `npm run web` | Starts Expo web build |

---

## Future Roadmap

- [ ] Charts and graphs for weight and volume progression over time
- [ ] One-rep max (1RM) calculator
- [ ] Workout plan templates (Push/Pull/Legs, etc.)
- [ ] Export workout history to CSV
- [ ] Dark / light theme toggle
- [ ] iCloud / Google Drive backup and restore
- [ ] Apple Health / Google Fit integration
- [ ] Plate calculator

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please keep PRs focused and include a clear description of what was changed and why.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Author

**Saroj Pradhan**
[github.com/sarozpradhan64](https://github.com/sarozpradhan64)


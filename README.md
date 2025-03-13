<div align="center">
<img src="./Chalkr/assets/images/icon-nobg.png" width="90" alt="Logo" />

<h2> Chalkr </h2>

![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![](https://img.shields.io/badge/Expo-007ACC?style=for-the-badge&logo=expo&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![](https://img.shields.io/badge/SQLite-6200EE?style=for-the-badge&logo=sqlite&logoColor=white)
![](https://img.shields.io/badge/Drizzle-3982CE?style=for-the-badge&logo=drizzle&logoColor=white)
![](https://img.shields.io/badge/firebase-6200EE?style=for-the-badge&logo=firebase&logoColor=white)

<a href="https://youtube.com/shorts/XcV6ChUhr9Q?feature=share">Link to demo</a>

</div>

## 💡 Overview

<div align="center">
<img src="./assets/Stats.PNG" height="360" alt="Stats View" />
<img src="./assets/Workout.PNG" height="360" alt="Workout Log" />
<img src="./assets/Routes.PNG" height="360" alt="Route View" />
<img src="./assets/WorkoutCharts.PNG" height="360" alt="Workout Charts" />
</div>

Chalkr is a local-first climbing workout tracker built using React Native and
SQLite. It aims to help climber analyse their workouts and get insightful data
about their training and progress. Chalkr focuses on efficiency and
user-friendliness, allowing user to create, view and update routes. Key features
include:

## ✨ Features

- 🧗 Log Routes: Record ascents with details like grade, style, etc.
- 🏋️ Record & Manage workouts: Log your climbing sessions.
- 📸 Route Documentation: Attach photos to your route logs.
- 📱 Local-First: Log your workouts on the go whether in your local gym or deep
  down your favourite crag.
- 📅 Workout History & Review: Access and review your past workouts and analyze
  your performance.
- 📊 Grade & Style Analysis: Analyze your completed routes and identify
  strengths and weaknesses.
- 📈 Analytics & Visualizations: Gain valuable insights into your climbing with
  statistics and charts.
- 🔐Google Sign-In Integration: Secure and streamlined user authentication.

## 💻 Tech Stack

- React Native: A framework for building native mobile applications using React.
- Expo: A framework for universal React Native apps.
- Firebase: A mobile and web development platform, providing authentication.
- SQLite: A self-contained SQL database engine.
- Drizzle ORM: A TypeScript ORM providing type-safe database access.
- NativeWind: Tailwind CSS for React Native.
- Jest: A JavaScript testing framework.
- React Native Testing Library: A testing utility for React Native components.

## 📦 Getting Started

To get a local copy of this project up and running, follow these steps.

### 🚀 Prerequisites

- **Node.js** (v16.x or higher) and **npm** or **yarn**.
- **Npm**: If you prefer using npm for package management and running scripts.
- **macOS:** iOS development requires a macOS environment.
- **Xcode:** Download and install Xcode from the Mac App Store. Xcode is Apple's
  integrated development environment (IDE) for iOS development.
- **Xcode Command Line Tools:** Ensure Xcode Command Line Tools are installed.
  You can install these by opening Xcode and navigating to
  `Xcode > Preferences > Locations` or by running `xcode-select --install` in
  your terminal.

### 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:Portavion/Chalkr.git
   ```

2. **Install dependencies:**

   Using Npm:

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   The Expo CLI will automatically load environment variables with an
   EXPO*PUBLIC* prefix from .env files for use within your JavaScript code
   whenever you use the Expo CLI, such as when running npx expo start to start
   your app in local development mode.

   ```bash
   npx expo start
   ```

4. **Start the development server:**

   The app is currently only developed and tested for iOs.

   ```bash
   npx expo run:ios --device
   ```

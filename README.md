# MIMO Feedback Collection Website 🚀

A modern, minimal, and responsive web application designed for collecting structured user experience feedback for the **MIMO** application. Built as an internship evaluation assignment adhering to senior full-stack development and professional UI/UX design standards.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Design Philosophy & Branding](#-design-philosophy--branding)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Project Folder Structure](#-project-folder-structure)
- [Quick Start & Local Execution](#-quick-start--local-execution)
- [JavaScript Architecture & Validation Engine](#-javascript-architecture--validation-engine)
- [Firebase Firestore Integration Status](#-firebase-firestore-integration-status)
- [Future Integration Steps (Phase 2)](#-future-integration-steps-phase-2)
- [Code Quality & Best Practices](#-code-quality--best-practices)
- [License & Attribution](#-license--attribution)

---

## 📖 Overview

The **MIMO Feedback Collection Website** provides an intuitive, friction-free portal where learners and developers can share their honest experiences using MIMO. Submissions capture:
- **Full Name** (user identification)
- **Email Address** (validated email for communications)
- **Star Rating (1–5)** (interactive experience rating with dynamic labels)
- **Feedback Message** (comprehensive feedback with live character count)

In this initial phase (**Phase 1**), full client-side validation, accessibility, micro-interactions, responsive layouts, and loading/success confirmation workflows have been fully engineered in pure Vanilla Web technologies. The backend pipeline is structured in `firebase.js` for seamless modular Cloud Firestore connection in **Phase 2**.

---

## 🎨 Design Philosophy & Branding

Inspired by MIMO's clean, friendly, and tech-forward branding:
- **Color Palette:**
  - **MIMO Tech Blue (`#2563EB`, `#1D4ED8`):** Primary branding, interactive states, and focal actions.
  - **Warm Beige & Cream (`#FAF7F2`, `#F3EFE6`):** Soothing, premium editorial background eliminating eye fatigue.
  - **Crisp Card Surface (`#FFFFFF`):** High-contrast focus area with subtle layered shadows (`box-shadow: 0 16px 40px -8px rgba(37, 99, 235, 0.07)`).
  - **Amber Gold (`#F59E0B`):** Star ratings with soft drop-shadow highlights.
  - **Emerald Green & Coral Red:** Clear feedback semantics for valid and invalid inputs.
- **Typography:** Modern geometric sans-serif (`Plus Jakarta Sans`) with optical sizing and high legibility across screens.
- **Responsiveness:** Fluid clamp sizing (`clamp(2rem, 4vw + 1rem, 3.25rem)`) and mobile-first CSS Grid/Flexbox architecture.

---

## ✨ Key Features

1. **Header & Navigation:**
   - Prominent MIMO brand mark with custom SVG logo.
   - Live status indicator badge (`Feedback Portal` with pulsing aura).
   - Minimalist navigation links.

2. **Hero Section:**
   - Focused value proposition: *"Your Experience Matters."*
   - Explanatory copy: *"Help us make MIMO better. Share your experience and let us know what you think."*
   - Trust and feature pills showcasing rapid completion and direct delivery to the product team.

3. **Interactive 5-Star Rating Component:**
   - Full keyboard accessibility (Tab focus, Arrow Left/Right/Up/Down, Home, End).
   - Hover preview states that highlight candidate stars before clicking.
   - Dynamic rating descriptor (e.g., *1: Poor*, *3: Good*, *5: Excellent*).
   - Rating score badge (*X / 5 stars*).
   - Mandatory selection validation.

4. **Robust Form Validation Engine:**
   - **Full Name:** Required, minimum 2 characters, alphabet validation.
   - **Email Address:** Required, standard RFC regex format validation.
   - **Experience Rating:** Mandatory 1–5 star choice.
   - **Feedback Message:** Required, minimum 15 characters, maximum 1,000 characters.
   - **Real-Time Error Handling:** Errors display immediately when invalid and clear automatically as soon as the user corrects their input.

5. **Live Character Counter:**
   - Tracks current character length dynamically as the user types.
   - Highlights in green once the 15-character minimum threshold is met.

6. **Submit State & Concurrency Control:**
   - Asynchronous loading state with animated CSS spinner.
   - Disables submit button during processing to prevent accidental double submissions.

7. **Success Confirmation Screen:**
   - Animated SVG checkmark badge.
   - Confirmation headline: *"Thank you for sharing your experience!"*
   - Supporting text: *"Your feedback helps us make MIMO better."*
   - Instant summary of submitted data (Name, Email, Star score, Message excerpt).
   - *"Submit Another Feedback"* button allowing a clean form reset and return without refreshing the browser.

---

## 💻 Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure (`<header>`, `<main>`, `<section>`, `<form>`, `<footer>`), ARIA attributes for accessibility |
| **CSS3** | Modern styling, CSS Custom Properties (Variables), Flexbox/Grid, smooth cubic-bezier transitions, responsive media queries |
| **Vanilla JavaScript (ES6+)** | DOM manipulation, state management, event delegation, client-side validation engine, keyboard accessibility |
| **SVG** | Scalable, high-resolution vector logo, icons, and star graphics |
| **Firebase Modular SDK (Prepared)** | Architecture in `firebase.js` ready for Cloud Firestore modular integration in Phase 2 |

*Note: Zero external UI frameworks (No React, Angular, Vue, Bootstrap, or Tailwind). Pure, high-performance vanilla implementation.*

---

## 📁 Project Folder Structure

```text
MIMO-Feedback-Website/
│
├── index.html            # Main semantic HTML5 webpage
├── css/
│   └── style.css         # Complete CSS3 stylesheet and design tokens
├── js/
│   └── script.js         # Vanilla JS application and validation logic
├── assets/
│   └── images/
│       ├── logo.svg      # Vector MIMO logo with custom typography
│       └── favicon.svg   # Vector browser tab icon
├── firebase.js           # Firebase modular SDK preparation file (Phase 2 ready)
├── README.md             # Complete documentation and project overview
└── .gitignore            # Git exclusion rules for secrets, OS files, and caches
```

---

## 🚀 Quick Start & Local Execution

This project is built with zero build step dependencies and runs immediately in any modern web browser.

### Option 1: Direct File Access
Simply double-click `index.html` or right-click and choose **"Open with Google Chrome"** (or Edge/Firefox/Safari).

### Option 2: Using a Local HTTP Server (Recommended)
Running through an HTTP server ensures full ES module support:

#### Using Python 3:
```bash
# In the project directory:
python -m http.server 8000
```
Then visit: `http://localhost:8000`

#### Using Node.js `npx serve` or `live-server`:
```bash
npx serve .
# or
npx live-server
```

#### Using VS Code Live Server:
Right-click `index.html` inside VS Code and select **"Open with Live Server"**.

---

## ⚙️ JavaScript Architecture & Validation Engine

The JavaScript logic in `js/script.js` is structured into clean functional modules:

```text
┌────────────────────────────────────────────────────────┐
│               DOM Elements Cache & State               │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Star Rating │     │  Char Count  │     │  Validation  │
│  Controller  │     │  Controller  │     │    Engine    │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │  Form Submission Handler  │
              └─────────────┬─────────────┘
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
┌──────────────┐                          ┌──────────────┐
│  Phase 1     │                          │  Phase 2     │
│  Simulated   │                          │  Firestore   │
│  Latent Flow │                          │  Integration │
└──────┬───────┘                          └──────┬───────┘
       │                                         │
       └────────────────────┬────────────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │  Success Card UI Summary  │
              └───────────────────────────┘
```

---

## ☁️ Firebase Firestore Integration Status

- **Current Status:** **Phase 1 Complete (Prepared for Phase 2)**.
- **Why no credentials are hardcoded yet:**
  Following industry security standards and the assignment guidelines, no fake keys or unauthenticated connection attempts are included.
- **Inspection in `firebase.js`:**
  - Standard modular structure for `@firebase/app` and `@firebase/firestore`.
  - Placeholder configuration block `firebaseConfig`.
  - Prepared `submitFeedbackToFirestore()` function ready for production wiring.
  - Production-ready Firestore Security Rules snippet included in comments.

---

## 🔮 Future Integration Steps (Phase 2)

Connecting Cloud Firestore involves 4 straightforward steps:

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com).
   - Create a project named `mimo-feedback-collection`.

2. **Register Web App & Copy Config:**
   - Under **Project Settings** > **General** > **Your apps**, click the Web icon (`</>`).
   - Copy the configuration object and paste into `firebase.js`:
     ```javascript
     export const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "mimo-feedback.firebaseapp.com",
       projectId: "mimo-feedback",
       storageBucket: "mimo-feedback.appspot.com",
       messagingSenderId: "1234567890",
       appId: "1:1234567890:web:abcdef"
     };
     ```

3. **Enable Cloud Firestore:**
   - Navigate to **Build** > **Firestore Database** > **Create database**.
   - Paste the provided security rules from `firebase.js` into the **Rules** tab.

4. **Connect in `script.js`:**
   - In `js/script.js`, import the helper:
     ```javascript
     import { submitFeedbackToFirestore } from '../firebase.js';
     ```
   - In the form submit handler, call:
     ```javascript
     const docId = await submitFeedbackToFirestore(feedbackData);
     ```

---

## 🏆 Code Quality & Best Practices

- **Zero Global Variable Pollution:** All script logic is safely encapsulated inside `document.addEventListener('DOMContentLoaded', ...)`.
- **Keyboard & Screen Reader Accessibility:** Star ratings utilize `role="radiogroup"`, `role="radio"`, `aria-checked`, and keyboard focus manipulation.
- **Input Sanitization:** All text inputs are properly trimmed and validated before building submission payloads.
- **Progressive Enhancement:** Form works cleanly across all screen dimensions with no external CDN dependencies required for layout rendering.

---

## 📄 License & Attribution

Designed and developed for the **MIMO Internship Evaluation Assignment**.  
© 2026 MIMO. All rights reserved.

# MIMO Feedback Collection Website 🚀

A modern, minimal, and responsive web application designed for collecting structured user experience feedback for **MIMO**. Built with pure Vanilla Web technologies (HTML5, CSS3, ES6+ JavaScript), specifically refined to embody the distinctive visual identity of the **physical MIMO kiosk**.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Design Philosophy & Physical Kiosk Branding](#-design-philosophy--physical-kiosk-branding)
- [Color Palette System](#-color-palette-system)
- [Floral & Botanical Artistry](#-floral--botanical-artistry)
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

The **MIMO Feedback Collection Website** is a digital extension of the physical MIMO kiosk branding. It provides an intuitive, friction-free portal where kiosk users, creators, and developers can share their honest experiences. Submissions capture:
- **Full Name** (user identification)
- **Email Address** (validated email for communications)
- **Star Rating (1–5)** (interactive experience rating with dynamic labels)
- **Feedback Message** (comprehensive feedback with live character count)

All frontend validation, accessibility features, micro-interactions, responsive layouts, and loading/success confirmation workflows are completely operational in pure Vanilla Web technologies. The backend pipeline is structured in `firebase.js` for modular Cloud Firestore connection in **Phase 2**.

---

## 🎨 Design Philosophy & Physical Kiosk Branding

The design is directly inspired by the physical **MIMO Kiosk**:
- **Caramel / Tan Brown Body (`#B47B45`):** Accenting badges, borders, icons, and branding elements.
- **Warm Cream (`#F2E9DC`) & Light Beige (`#E8D6C0`):** Dominates the page background, replacing stark plain white with a warm, welcoming, tactile aesthetic.
- **Bright MIMO Blue Digital Display (`#1685D5`):** Primary action buttons, interactive focus rings, link highlights, and status pulses.
- **Charcoal (`#242321`):** High-contrast, legible typography across all device sizes.
- **Pure White (`#FFFFFF`):** Reserved for card surfaces to provide clarity and contrast.
- **Brand Slogans:** Prominently incorporates `"MAKE IT REAL"` and `"PRINT MADE EASY"` in the hero badge and navigation.

---

## 🎨 Color Palette System

| Color Token | Hex Code | Role in Design |
| :--- | :--- | :--- |
| **Warm Cream** | `#F2E9DC` | Dominant page background; warm and welcoming |
| **Light Beige** | `#E8D6C0` | Secondary backgrounds, footer, input containers |
| **Caramel Brown** | `#B47B45` | Kiosk body branding, badge borders, feature icons |
| **Deep Brown** | `#80532F` | Subtitles, selected ratings, text accents |
| **MIMO Blue** | `#1685D5` | Primary action button, focus states, interactive highlights |
| **Charcoal** | `#242321` | Primary text and headings for maximum legibility |
| **Pure White** | `#FFFFFF` | Form card background and input contrast |

---

## 🌿 Floral & Botanical Artistry

In reference to the white lily flower arrangements and dark botanical foliage on the physical MIMO kiosk, custom lightweight vector SVG illustrations are placed gracefully on the left and right flanks of the hero section:
- **Stylized White Lilies (`#FFFFFF` & `#FAF6F0`):** Soft ivory petals with delicate caramel-toned stamen tips.
- **Dark Botanical Leaves (`#242321` & `#363C35`):** Curving dark foliage providing natural balance.
- **Non-Obtrusive Layout:** Positioned with `pointer-events: none` and responsive scaling so they enhance the visual elegance without interfering with form interactions.

---

## ✨ Key Features

1. **Header & Navigation:**
   - MIMO brand logo with updated kiosk color accents.
   - Live status indicator badge (`Feedback Portal` with pulsing MIMO blue dot).
   - Minimalist navigation with `"PRINT MADE EASY"` tag.

2. **Hero Section:**
   - Kiosk slogan pill: `"MAKE IT REAL • PRINT MADE EASY"`.
   - Exact heading: *"Your Experience Matters."* (with MIMO blue emphasis).
   - Exact supporting copy: *"Help us make MIMO better. Share your experience and let us know what you think."*
   - Feature pills showcasing rapid completion and direct delivery to the product team.

3. **Interactive 5-Star Rating Component:**
   - Full keyboard accessibility (Tab focus, Arrow Left/Right/Up/Down, Home, End).
   - Hover preview states that highlight candidate stars before clicking.
   - Golden-caramel star tones (`#E0983A`) with subtle warm drop shadows.
   - Dynamic rating descriptor (e.g., *1: Poor*, *3: Good*, *5: Excellent*).
   - Rating score badge (*X / 5 stars*).

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
   - Primary submit button in vibrant MIMO Blue (`#1685D5`).
   - Asynchronous loading state with animated CSS spinner.
   - Disables submit button during processing to prevent duplicate submissions.

7. **Success Confirmation Screen:**
   - Animated SVG checkmark badge with emerald and warm cream styling.
   - Confirmation headline: *"Thank you for sharing your experience!"*
   - Supporting text: *"Your feedback helps us make MIMO better."*
   - Instant summary of submitted data (Name, Email, Star score, Message excerpt).
   - *"Submit Another Feedback"* button allowing a clean form reset and return.

---

## 📁 Project Folder Structure

```text
MIMO-Feedback-Website/
│
├── index.html            # Main semantic HTML5 webpage with botanical art
├── css/
│   └── style.css         # Complete CSS3 design system & physical kiosk tokens
├── js/
│   └── script.js         # Vanilla JS application and validation logic
├── assets/
│   └── images/
│       ├── logo.svg                 # Vector MIMO logo with kiosk typography
│       ├── favicon.svg              # Vector browser tab icon
│       ├── botanical-lily-left.svg  # Custom white lily & dark botanical SVG
│       └── botanical-lily-right.svg # Complementing botanical SVG
├── admin/
│   ├── index.html            # Dedicated Administrator Dashboard & Login Portal
│   ├── css/
│   │   └── admin.css         # Admin styling matching MIMO kiosk design system
│   └── js/
│       └── admin.js          # Admin logic, Firebase Auth observer, Firestore query, metrics
├── firebase.js           # Firebase modular SDK integration & Firestore submission module
├── README.md             # Complete documentation and branding guide
└── .gitignore            # Git exclusion rules for secrets, OS files, and caches
```

---

## 🔥 Firebase Firestore Integration & Security Rules

### Integration Architecture
- **SDK:** Official Firebase Modular JavaScript SDK v10 (ES Module via `https://www.gstatic.com/firebasejs/10.12.0/`).
- **Target Collection:** `"feedback"`.
- **Document Schema:**
  - `name`: string (Submitter's name, 2–100 chars)
  - `email`: string (Valid RFC email address)
  - `rating`: number (Integer 1 to 5)
  - `message`: string (15–1,000 chars)
  - `createdAt`: serverTimestamp (Cloud Firestore server-generated timestamp)

### Production-Grade Firestore Security Rules
To secure your public feedback form against spam, malicious modifications, and unauthorized data extraction, copy and paste the following rules into:
**Firebase Console > Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /feedback/{feedbackId} {
      // Allow any public visitor to submit valid feedback only
      allow create: if request.resource.data.name is string
                    && request.resource.data.name.size() >= 2
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.email is string
                    && request.resource.data.email.size() <= 150
                    && request.resource.data.rating is int
                    && request.resource.data.rating >= 1
                    && request.resource.data.rating <= 5
                    && request.resource.data.message is string
                    && request.resource.data.message.size() >= 15
                    && request.resource.data.message.size() <= 1000
                    && request.resource.data.createdAt == request.time;
                    
      // Strictly prevent public reads, updates, and deletes to protect user privacy
      allow read, update, delete: if false;
    }
  }
}
```

---

## 🚀 Quick Start & Local Execution

This project is built with zero build step dependencies and runs immediately in any modern web browser.

### Option 1: Direct File Access
Simply double-click `index.html` or open it with Google Chrome, Edge, Firefox, or Safari.

### Option 2: Using a Local HTTP Server (Recommended)
```bash
# In the project directory:
python -m http.server 8000
```
Then visit: `http://localhost:8000`

---

## 📄 License & Attribution

Designed and developed for the **MIMO Internship Evaluation Assignment**.  
Physical kiosk visual identity inspired by MIMO hardware design.  
© 2026 MIMO. All rights reserved.

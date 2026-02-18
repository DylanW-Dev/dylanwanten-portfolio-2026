# Interactive Developer Portfolio

A minimal, interactive portfolio built with React and Vite.
Designed to feel like a modern developer interface rather than a static CV.

This project transforms a traditional résumé into a dynamic experience featuring floating information cards, subtle 3D tilt interactions, and a Recruiter Mode that generates tailored developer summaries.

---

## ✨ Concept

Instead of listing skills statically, this portfolio:

* Presents sections as interactive modules
* Displays floating detail cards connected with dynamic arrows
* Uses subtle 3D transforms for depth
* Allows recruiters to generate a custom profile summary based on selected skills

The goal is to demonstrate real frontend engineering skills — not just animations.

---

## 🧠 Features

### Interactive CV Panel

* Subtle 3D tilt effect
* Dark, minimal UI
* Responsive layout
* Clean typography and spacing

### Floating Detail Cards

* Dynamically positioned relative to selected section
* SVG Bezier arrows tracking card position
* Draggable cards (desktop)
* Bottom sheet interaction (mobile)

### Recruiter Mode

* Toggle between Developer Mode and Recruiter Mode
* Select skills dynamically
* Generate custom summary based on selected technologies
* Copy summary to clipboard

### Modern Architecture

* React Context for global state
* Custom hooks (`useTilt`, `useDraggable`)
* Component-based structure
* Clean separation of concerns
* Mobile detection handling
* Accessible keyboard interactions

---

## 🛠 Tech Stack

* React (Hooks + Context API)
* Vite
* Tailwind CSS
* SVG path rendering
* Custom animation logic
* Modern CSS gradients and transforms

---

## 🏗 Project Structure

```
src/
 ├─ components/
 │   ├─ CVPanel.jsx
 │   ├─ FloatingCard.jsx
 │   ├─ ArrowLayer.jsx
 │   ├─ RecruiterPanel.jsx
 │   └─ ModeToggle.jsx
 │
 ├─ hooks/
 │   ├─ useTilt.js
 │   └─ useDraggable.js
 │
 ├─ context/
 │   └─ PortfolioContext.jsx
 │
 ├─ data/
 │   └─ sections.js
 │
 └─ App.jsx
```

---

## 🚀 Getting Started

### 1. Create Vite project

```bash
npm create vite@latest
```

Choose:

* React
* JavaScript (or TypeScript if preferred)

### 2. Install dependencies

```bash
npm install
```

If using Tailwind:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Run development server

```bash
npm run dev
```
# Ribbon — Business Registration Form

A polished, multi-step sole proprietorship registration flow built with **React**, **TypeScript**, and **Tailwind CSS v4**. Features animated step transitions, touch-based form validation, a mock payment step, and a simulated server rejection/recovery flow.

---

## Features

- **4-step wizard** — Business Info → Payment → Review → Confirmation
- **Inline validation** — errors appear only after a field is touched (blurred), not on load
- **Animated transitions** — smooth slide animations between steps using Framer Motion
- **Simulated rejection flow** — first submission always fails with an error, mimicking real async API behavior
- **Payment confirmation** — mock $50 CAD registration fee step
- **Fully typed** — TypeScript interfaces and union types throughout
- **Responsive** — works on mobile and desktop

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Framer Motion | Step animations |
| Vite | Dev server & bundler |
| Lucide React | Icons |

---

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ribbon-onboarding-form.git
   cd ribbon-onboarding-form
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

---

## Project Structure

```
ribbon-onboarding-form/
├── src/
│   ├── App.tsx        # Entire multi-step form logic and UI
│   ├── main.tsx       # React entry point
│   └── index.css      # Tailwind v4 import
├── index.html         # HTML shell with #root div
├── vite.config.ts     # Vite + React plugin config
├── tsconfig.json      # TypeScript compiler config
└── package.json       # Dependencies and scripts
```

---

## How the Form Works

```
Step 1 — Business Info
  └─ Validates all fields on blur
  └─ Force-shows all errors if Next is clicked early

Step 2 — Payment
  └─ Next is disabled until "Confirm Payment" is clicked

Step 3 — Review & Submit
  └─ First submission → rejection error (simulated)
  └─ Second submission → success

Step 4 — Confirmation
  └─ Shows registered business name and next steps
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production (outputs to `/dist`) |
| `npm run preview` | Preview the production build locally |

---

## License

© 2026 Ribbon Business Services. All rights reserved.

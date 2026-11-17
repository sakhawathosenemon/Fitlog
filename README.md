<div align="center">

# 💪 FitLog

**Train with intent. Log every set.**

A dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.

[Live Demo](https://fitlog-taupe-psi.vercel.app/) · [Report a Bug](../../issues)

</div>

---

> 🔗 **Live link:**(https://fitlog-taupe-psi.vercel.app/)
> 📦 **Repository:**(https://github.com/sakhawathosenemon/Fitlog)

## 📖 About

FitLog is a workout-library and daily-planner app built for the **B14 Assignment 6** challenge. Browse twelve lifts covering every major muscle group, open any workout for full details and step-by-step instructions, then add it to **Today's Plan** or save it for later. Your plan lives in the browser, so it's still there after a refresh.

## ✨ Key Features

1. **Workout Library** — a responsive 3 × 4 grid of workout cards (image, muscle-group tags, equipment, duration, calories and rating) fetched from a REST API, with a loading animation and a retry option if the request fails.
2. **Workout Details** — a two-column page with a large illustration, key-specs panel and numbered instructions, reached through a dynamic `/workout/[id]` route.
3. **Today's Plan & Saved lists** — add a lift to today's plan (capped at **5**, duplicates blocked) or save it for later, with live **Plan / Saved** counters in the navbar and toast notifications for every action.
4. **My Plan dashboard** — live Exercises / Minutes / Calories metrics, Today's Plan / Saved tabs, a **Sort By** dropdown (Duration, Calories, Rating), **Mark as Done** and remove actions, and a friendly empty state.
5. **Persistent & resilient** — plan and saved lists survive a page reload via `localStorage` (hydration-safe), the app falls back to a backup API if the primary one is down, and unknown URLs land on a custom **404** page.
6. **Fully responsive** — the layout adapts across mobile, tablet and desktop (the navbar links drop to their own row on small screens).

## 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| [Next.js 15](https://nextjs.org/) (App Router) | Framework, file-based routing, dynamic routes, custom 404 |
| [React 19](https://react.dev/) + Context API | UI and shared Plan / Saved state |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe components, API helpers and context |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling and responsive design |
| [react-hot-toast](https://react-hot-toast.com/) | Toast notifications |
| [lucide-react](https://lucide.dev/) | Icons |
| [Fontsource](https://fontsource.org/) — Inter & Oswald | Self-hosted fonts |

## 🌐 API

| Endpoint | Description |
| --- | --- |
| `GET https://api.abcz.workers.dev/api/fitlog` | All workouts |
| `GET https://api.abcz.workers.dev/api/fitlog/:id` | A single workout |

A backup API (`api.api-store.workers.dev`) is tried automatically if the primary request fails.

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Provider + Navbar + Footer + Toaster
│   ├── page.tsx              # Home  →  /
│   ├── not-found.tsx         # Custom 404
│   ├── workout/[id]/page.tsx # Workout details  →  /workout/:id
│   └── my-plan/page.tsx      # My Plan  →  /my-plan
├── components/               # Navbar, Hero, LibrarySection, WorkoutCard, Footer …
├── context/PlanContext.tsx   # Plan / Saved state, metrics, localStorage
├── types/index.ts            # Workout & PlanWorkout types
└── utils/api.ts              # API helpers with fallback
```

## 🚀 Getting Started

```bash
# 1. Clone
git clone <your-repo-url>
cd <your-repo-folder>

# 2. Install
npm install

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint the code
```

## ☁️ Deployment

Push to GitHub, import the repository on [Vercel](https://vercel.com/new) and click **Deploy** — Next.js is detected automatically and no extra configuration is needed. Reloading any page works out of the box.

---

<div align="center">© 2026 FitLog — Workout Library. Train hard, log honest.</div>

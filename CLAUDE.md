# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev

```bash
cd server && npm run dev   # nodemon
cd server && npm start     # production
```

`.env` in `server/`: `MONGO_URI=...`, `PORT=5000`

## Stack

**Server:** Node.js + Express + MongoDB (Mongoose). Routes → Controllers → Models pattern.

- `GET/POST /api/products`, `PUT/DELETE /api/products/:id`
- `POST /api/products/:id/movement`, `GET /api/products/:id/movements`, `GET /api/movements`, `GET /api/products/:id/reconcile`
- `POST /auth/register`, `POST /auth/login`, `GET/DELETE /auth/me`

**Auth (implemented):** passwords hashed with bcrypt, JWT issued on register/login, `authMiddleware` guards all `/api/*` routes and `/auth/me`. New users always get `role: "user"` — `admin` is only ever set manually in the DB, no self-service path.

**Known gap:** no role-based authorization — any authenticated user can currently create/edit/delete products. Pending: only `admin` should be able to add/edit/delete a product; a regular `user` should only be able to record stock movements (in/out) on existing products. Needs enforcement both server-side (route/controller guard) and client-side (hide/disable UI).

**Client:** React (Vite), plain CSS — no Tailwind, no CSS-in-JS. Organized by feature:

```
client/src/
  index.css              # global reset only (box-sizing, body font/background)
  features/<feature>/
    css/
      X.css              # one file per component, imported as "./css/X.css"
    X.jsx
```

Components with identical markup (e.g. Add/Edit modals of the same entity) share one CSS file instead of duplicating it.

## Project Guidelines

זהו פרויקט גמר להנדסאי/מהנדס (מה"ט) — **מינימליות היא עדיפות עליונה**, גם בקוד וגם בפונקציונליות.

- **מינימלי בקוד.** קוד פשוט ככל האפשר, ברמת סטודנט ג'וניור. אין design patterns, אין אופטימיזציות מורכבות, אין ספריות נוספות אלא אם ממש הכרחי.
- **מינימלי בפונקציונליות.** לממש רק בדיוק את מה שהתבקש — בלי תכונות נוספות, בלי שיפורי UI, בלי "יהיה נחמד אם". אם יש ספק אם פיצ'ר נדרש — לשאול לפני שמוסיפים.
- **בלי over-engineering.** לא להוסיף הפשטות, קונפיגורביליות, טיפול בשגיאות או ולידציות למקרים שלא קיימים בפועל בפרויקט.
- **הערות בעברית** ליד כל פונקציה/קומפוננטה ארוכה או "רצינית" (לוגיקה לא טריוויאלית, לא רק CRUD חד-שורתי) — שורה או שתיים שמסבירות מה היא עושה, כדי שהסטודנט יוכל להסביר את הקוד.

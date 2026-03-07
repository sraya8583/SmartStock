# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev

```bash
cd server && npm run dev   # nodemon
cd server && npm start     # production
```

`.env` in `server/`: `MONGO_URI=...`, `PORT=5000`

## Stack

Node.js + Express + MongoDB (Mongoose). Backend only, no frontend yet.

Routes → Controllers → Models pattern.

- `GET/POST /api/products`, `PATCH/DELETE /api/products/:id`
- `POST /auth/register`, `POST /auth/login`

**Known gaps:** passwords stored in plaintext, no auth middleware on product routes, no JWT/sessions.

## Project Guidelines

- **Simplicity first.** Junior-friendly code only. No design patterns, no complex optimizations, no extra libraries unless strictly required.
- **No scope creep.** Do not add unrequested features, UI enhancements, or nice-to-haves.
- **Comments in Hebrew or English** on every main function so the student can explain the code.

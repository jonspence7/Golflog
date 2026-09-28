# Course Rankings

A local web app for logging golf courses you've played and ranking them
top-to-bottom. Add courses to the list, then drag them into any order —
everything between the old and new positions shifts automatically.

## Stack

- **Backend:** Node + Express + SQLite (via `better-sqlite3`) — a single
  local file database, no accounts or cloud services required.
- **Frontend:** React + Vite.

This keeps v1 (solo use, no login) dead simple to run, while leaving room
to swap SQLite for Postgres and add accounts later for the friends feature.

## Running it

You need Node.js 18+ installed. Two terminals:

```bash
# Terminal 1 — API server (http://localhost:4000)
cd server
npm install
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client
npm install
npm run dev
```

Open http://localhost:5173. The database file is created automatically at
`server/golf-tracker.db` the first time you add a course.

## How the ranking works

1. Click **+ Log a round** and fill in the course name, date, score, etc.
2. New courses are added at the bottom of the leaderboard.
3. Drag any course row onto another row to move it. The server updates the
   ranks in a single database transaction, so the ordering stays consistent.

Editing a round's score/date/notes doesn't move its rank (that's a
deliberate v1 choice — re-ranking on an edited score would need to re-run
the comparison flow, which felt like more friction than it was worth for
now). Deleting a course closes the gap it leaves behind automatically.

## What's next (not built yet)

- Accounts + login
- Friends: see their rankings and rounds

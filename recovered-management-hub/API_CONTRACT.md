# Management Projects Hub — recovery & rebuild reference

Recovered from Vercel production deployment `dpl_wo6aULKKXK5vJ59qFykayqpYN62v`
(`leaders-dashboard-or9nds9uj-...`), the last working CLI deploy before the Ads
Hub was pushed over `main`. The frontend was retrieved verbatim; the three
`/api/*` serverless functions run server-side and were NOT downloadable, so they
must be rebuilt from the contract below.

## ClickUp structure (verified via ClickUp MCP)
- Workspace `36877134`, Space **LEADERS** `90152286934`
- Folder **📊 פרויקטים — הנהלה** = `901516138381` (holds the project lists)
- Lists (= projects):
  - `901523533861` 🌍 פרויקט חברה  ← **company project** (special)
  - `901523533862` CRM - Leaders #1
  - `901523533864` BestieAi
  - `901523533865` Agent Leaders
  - `901523533866` עמלות סוכנים
  - `901523533867` שיווק לידרס
- The folder's custom fields are generic (Priority Value, People, Customers, …)
  and are NOT used for project metadata. Per-project metadata (goal/dim/priority/
  owner/status/dates) round-trips through the **list description/content**
  (`rawContent`), parsed by GET and written by PATCH. All currently empty.

## Team (hardcoded in frontend; ClickUp member IDs)
60682280 יואב · 94556915 איתמר · 94589634 שרון · 94556216 נועה · 88703216 אלית ·
106507992 עדי · 94556277 ראובן · 94556360 יונתן · 94556229 עודי

## Dimensions / categories (match the new Claude design)
הכנסות 💰 · מוצר 🛠 · אנשים 👥 · תפעול ⚙️ · לקוחות 🌍

## Project status values
planning · on-track (On Track) · blocked · done

## API contract (same-origin; CORS `*`)
### GET /api/lists  → `{ lists: [ { id, name, rawContent, goal, dim, priority, ownerId, ownerName, startDate, dueDate, updateDue, status } ] }`
Reads lists in folder 901516138381. Company = id `901523533861`.
### PATCH /api/lists  body `{ listId, goal, dim, priority, ownerId, ownerName, status, startDate, dueDate, updateDue }` → `{ ok: true }`
Persists project metadata (into the list description, in a parseable format).
### GET /api/tasks?listId=ID  → `{ tasks: [ ClickUp task ] }`
Task fields used: name, status.status, assignees[] (username/email), due_date,
start_date (epoch ms strings), description. Task metadata parsed from description:
`📌 מטרה: …`, `📊 ממד: …`, `🔄 מועד עדכון סטטוס: …`.
### POST /api/tasks  body `{ listId, name, goal, dim, ownerId, teamIds[], startDate, dueDate, updateDue, status }` → created task `{ id, linkedLists? }`
Creates the task, writes the 📌/📊/🔄 markers into the description, sets assignees
(owner + teamIds), tags it **"הנהלה"**, and links it into each assignee's personal
list (the `linkedLists` count). Statuses: `to do`/`in progress`/`blocked`/`complete`.
### GET /api/comments?listId=ID  → `{ comments: [ { comment_text, user.username, date } ] }`
### POST /api/comments  body `{ listId, text, authorName, type }` → `{ id }`
`type` → prefix emoji: general=📋, block=🔴, good=✅, status=🔄; body stored as
`<emoji> [authorName]\n<text>`.

## Backend secret
The deployed functions use a ClickUp API token from a Vercel **project env var**
(name unknown — not readable here). A redeploy of the same project inherits it.
Rebuilt functions should read it under several common names and fail gracefully:
`CLICKUP_API_KEY || CLICKUP_TOKEN || CLICKUP_PERSONAL_TOKEN || CLICKUP_PK`.

## Branches
- `ads-hub` / `claude/busy-pasteur-Im7MR` — preserved Ads Hub (React/Vite) + the
  earlier sample-data Projects Hub page. Do not delete.
- `main` — to become the restored Management Hub (static HTML + /api) with the new design.

# LeadConnect

Call or message a lead directly from a leads table, in one click. A single,
polished feature built on top of a lead-gen product —,not a rebuild of it.

## The idea

Lead-gen tools are only useful if they turn into outreach. This adds the
missing last step: instead of just viewing a lead's phone number, a
salesperson can call or text them straight from the table, with real
feedback on whether it worked.


## Architecture

```
Next.js (leads table, App Router)
   │
   ├── POST /api/calls     ──▶  Express  ──▶  Twilio REST (calls.create)
   │                                             │
   │                             rings you first, then <Dial> bridges the lead
   │
   └── POST /api/messages  ──▶  Express  ──▶  Twilio REST (messages.create)
```



### Why click-to-call instead of a browser softphone

The reference implementation used Twilio's Voice SDK — a full in-browser
softphone (WebRTC, `Device`, a TwiML App, microphone permissions), plus a
separate transcription/CRM pipeline. That's a lot of moving parts for a
scoped, no-auth demo.

Click-to-call gets the same real outcome — the salesperson ends up on a live
call with the lead — using only the plain Twilio REST API and one small
TwiML endpoint:

1. `POST /api/calls` triggers `client.calls.create()`, ringing the agent's
   own phone.
2. When the agent answers, Twilio requests `POST /api/calls/twiml`.
3. That endpoint returns TwiML with a `<Dial>` to the lead's number,
   bridging the two legs.

No browser mic, no TwiML App configuration, no WebRTC — just two REST calls
and a webhook.

## Tech stack

| | |
|---|---|
| Frontend | Next.js (App Router) · TypeScript · Tailwind CSS |
| Backend | Node.js · Express · TypeScript |
| Calling/SMS | Twilio (REST API — `calls.create`, `messages.create`) |
| Data | Static in-memory mock leads (no DB) |

## Project structure

```
backend/
  src/
    index.ts           Express app + route mounting
    env.ts              Env var access + readiness checks
    validate.ts          Phone number validation/normalization
    twilioClient.ts       Twilio client init
    routes/
      calls.ts            POST /api/calls, POST /api/calls/twiml
      messages.ts          POST /api/messages
  .env.example

frontend/
  app/
    page.tsx             Leads page
    layout.tsx, globals.css
  components/
    LeadsTable.tsx, LeadRow.tsx, ScoreBadge.tsx
    CallButton.tsx, MessageModal.tsx, ToastProvider.tsx
  lib/
    leads.ts              Mock lead dataset
    types.ts, api.ts
  .env.local.example
```

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | What it is |
|---|---|
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | From the Twilio console |
| `TWILIO_PHONE_NUMBER` | A Twilio number you own we can buy on twilio console(E.164, e.g. `+15551234567`) |
| `AGENT_PHONE_NUMBER` | Your own phone — Twilio rings this first on every call |
| `PUBLIC_BASE_URL` | A URL Twilio can reach for the TwiML webhook. Locally, run `ngrok http 4000` and use that URL |
| `PORT` | Defaults to `4000` |
| `CORS_ORIGIN` | Defaults to `http://localhost:3000` |

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## API reference

**`POST /api/calls`**
```json
{ "phoneNumber": "+15551234567" }
```
→ `{ "success": true, "callSid": "...", "status": "queued" }`

**`POST /api/messages`**
```json
{ "phoneNumber": "+15551234567", "message": "Hi, following up on..." }
```
→ `{ "success": true, "messageSid": "...", "status": "queued" }`

Both return `{ "success": false, "error": "..." }` on failure — invalid
phone number, missing message, missing server config, or a Twilio-side
error all surface here with a real message.

## Testing

```bash
cd backend && npm run typecheck
cd frontend && npm run build   # typechecks + lints + builds
```

With `.env` filled in but before wiring up real Twilio credentials, the
validation layer can be exercised directly:

```bash
curl -X POST http://localhost:4000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"notaphone","message":"hi"}'
# → 400, "A valid phoneNumber is required"
```

## Out of scope

By design, not by oversight: authentication, lead import/scraping, CRM
integrations, call/message history, analytics dashboards, and multiple
pages. The goal is one clean, working, end-to-end sales action — see a
lead, reach them — not a rebuild of the underlying product.

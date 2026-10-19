# LinguistBridge — Architecture Overview

## System Design

```
┌────────────────────────────────────────────────────────┐
│                    Client (Browser / Mobile)            │
│               Next.js 14 — App Router (port 3000)       │
└─────────────────────────┬──────────────────────────────┘
                          │ HTTP + WebSocket
┌─────────────────────────▼──────────────────────────────┐
│               Express API (port 4000)                   │
│  routes → controllers → services → repositories         │
│                                                         │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐ │
│  │ Auth     │  │ Sessions  │  │ Escrow / Ledger       │ │
│  │ JWT      │  │ Booking   │  │ Double-entry txns     │ │
│  └──────────┘  └───────────┘  └──────────────────────┘ │
│                                                         │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │ Socket.io rooms  │  │ BullMQ workers              │ │
│  │ Real-time events │  │ Emails, PDFs, payouts       │ │
│  └──────────────────┘  └─────────────────────────────┘ │
└──────────┬─────────────────────┬───────────────────────┘
           │                     │
  ┌────────▼──────┐    ┌─────────▼────────┐
  │  PostgreSQL   │    │     Redis         │
  │  Prisma ORM   │    │  Pub/Sub + Locks  │
  └───────────────┘    └──────────────────┘
```

## Layering Rules

| Layer | Responsibility |
|---|---|
| **Routes** | Map HTTP verbs to controllers. No logic. |
| **Controllers** | Parse/validate input, call service, return response. |
| **Services** | All business logic. Calls repositories. Throws `AppError`. |
| **Repositories** | Prisma queries only. No business logic. |

## Money Rules

- Stored as **integer minor units** (e.g. 1000 = $10.00 USD).
- Moved only via **double-entry ledger transactions** inside Prisma `$transaction`.
- Payment + payout endpoints require `x-idempotency-key` headers.

## Concurrency

- Interpreter acceptance: **atomic Redis `SET NX PX`** lock + Prisma `$transaction` guard.
- No two interpreters can win the same session request.

## Background Jobs (BullMQ)

| Queue | Job |
|---|---|
| `notifications` | Email + in-app alerts |
| `documents` | PDF receipt generation (PDFKit) |
| `payouts` | Trigger payout to interpreter |
| `escalation` | Re-alert if no interpreter responds in N seconds |

## i18n

Supported locales: `en`, `fr`, `rw` (Kinyarwanda). Handled by `next-intl`.

# LinguistBridge

> On-demand remote interpreting and escrow-protected booking platform for rare-language interpreters.

Starting with **Kinyarwanda ↔ English**, LinguistBridge connects clients (hospitals, schools, courts, NGOs) with verified interpreters in real time. Sessions are timed per minute, funds are held in an escrow ledger, and released upon session confirmation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, next-intl |
| **Backend** | Node.js 20, Express, TypeScript (strict), Prisma + PostgreSQL, Redis, BullMQ, Socket.io |
| **Package manager** | pnpm 9 (monorepo via pnpm workspaces) |
| **Containerisation** | Docker Compose (PostgreSQL 16, Redis 7) |
| **CI** | GitHub Actions |

---

## Monorepo Layout

```
LinguistBridge/
├── backend/        Express API (port 4000)
├── frontend/       Next.js app (port 3000)
├── packages/       Shared code (future: shared Zod schemas, types)
├── docs/           Architecture decision records
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- Docker & Docker Compose

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Ingabirechadia/LinguistBridge.git
cd LinguistBridge

# 2. Copy env files
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Start infrastructure
docker compose up -d

# 4. Install all workspace dependencies
pnpm install

# 5. Start the backend dev server
pnpm dev
# → http://localhost:4000/health
```

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start backend in watch mode |
| `pnpm dev:frontend` | Start Next.js dev server |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm typecheck` | TypeScript type-check all packages |
| `pnpm test` | Run all Jest tests |
| `pnpm build` | Production build all packages |

---

## Environment Variables

Copy `.env.example` → `.env` and fill in real values. **Never commit `.env`.**

See [`.env.example`](.env.example) for the full list.

---

## Git Workflow

- `main` is the protected default branch.
- Every feature lives in its own branch: `feat/<scope>`, `fix/<scope>`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
- PR → review → merge into `main`.

---

## Supported Languages

English · Français · Ikinyarwanda

---

## License

MIT © LinguistBridge

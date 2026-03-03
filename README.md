# User Agent Interface Demo

User Agent Interface (UAI) is an AI-powered interface pattern where you tell your app what you need in plain words and it shows you the right UI at the right time—rather than hunting for buttons and menus.  
This repository contains a logistics management demo for UAI: a chat-first app where you can ask to see shipments, inspect details on a map, update their status, switch languages, or sign out, all by typing natural-language requests.

> “What if you could simply tell your app what you need — in plain words — and it showed you the right thing?”  
> This demo is a concrete answer to that question. Learn more at [futuristic.digital](https://www.futuristic.digital/#our-work) and try the live demo at [uai.futuristic.digital](https://uai.futuristic.digital/).

## What this demo shows

- Natural-language UX: type what you want to do (“show delayed shipments”, “update this shipment to delivered”, “change the interface language”) and the app responds with the right UI components.
- AI-driven UI selection: an AI agent chooses from the set of predefined UI components (tools) and wires them up with the appropriate parameters.
- Domain-focused example: a small logistics app with shipments, statuses, maps, and updates, backed by an in-memory API.
- Production-style architecture: a split frontend, AI “UAI Server”, and API/DB service, close to how a real app would be structured.

The initial chat message in the demo describes this experience to users and sets the scene for how to interact with the app.

## Architecture overview

This repo is a small monorepo managed with npm workspaces and Turbo, and it is split into:

- **Open‑source UAI libraries**
  - **`@uai/server`** – the UAI backend service that wraps the [Vercel AI SDK](https://github.com/vercel/ai) `ToolLoopAgent`. It:
    - Accepts chat messages and a component map from the client.
    - Turns components into AI tools and streams back UI messages describing what to render.
    - Uses `openai/gpt-4o-mini` by default (api key is configured via `OPENAI_API_KEY`).
  - **`@uai/client`** – a small client-side helper (exposed here via the `useUai` hook) that:
    - Sends messages and the component map to `@uai/server`.
    - Converts between the AI SDK’s message format and UAI-specific messages.
    - Handles tool-call/output semantics so the host app can focus on rendering.
  - **`@uai/shared`** – shared TypeScript types and schemas, used by both client and server.

- **Demo applications in this repo**
  - **`@uai-demo/frontend`** – React + Vite + Tailwind frontend that renders the chat experience and defines the set of UAI-driven components (lists, forms, map, language switcher, sign-out, etc.), integrating `@uai/client` as a third‑party dependency.
  - **`@uai-demo/api-db`** – an Express API that exposes shipment data and stores everything in‑memory for the purposes of the demo. It is called only by `@uai-demo/frontend`; `@uai/server` never talks to it.

Conceptually, the architecture looks like this:

```text
            (app's users)
                  │
                  ▼
    ┌────────────────────────────────────────────────────────┐
    │                   Demo logistics app                   │
    ├────────────────────────────────────────────────────────┤
    │    ┌──────────────────────┐                            │
    │    │  @uai-demo/api-db    │   ← demo backend API       |
    │    └──────────────────────┘                            │
    │              ▲                                         │
    │              │  HTTP API (shipments)                   │
    │              ▼                                         │
    │    ┌──────────────────────┐                            │
    │    │  @uai-demo/frontend  │   ← demo frontend app      |
    │    └──────────────────────┘                            │
    │              │  uses internally as dependency          │
    │    ┌──────────────────────┐                            │
    │    │      @uai/client     │   ← UAI client library     |
    │    └──────────────────────┘                            │
    └────────────  ▲  ───────────────────────────────────────┘
                   |
                   │  HTTP API (chat + component map)
                   │
                   ▼
    ┌──────────────────────┐
    │      @uai/server     │   ← hosted UAI backend service (AI agent)
    └──────────────────────┘
```

## Project structure

At a glance:

- `apps/frontend` – UAI demo UI (chat, map, forms, shipments list, etc.).
- `apps/api-db` – fake shipments demo API + in-memory DB (`/api/shipments`).

- `apps/uai-server` – the AI-backed UAI Server (`/api/uai-server`).
- `packages/uai-client` – `useUai` React hook and component-map helpers.
- `packages/uai-shared` – shared UAI domain models and component-map types.

## Getting started

### Prerequisites for running the demo locally

> You can also try the live demo at [uai.futuristic.digital](https://uai.futuristic.digital/).

- Node.js ≥ 18
- npm ≥ 9
- An OpenAI-compatible API key for the model used by the UAI Server (`OPENAI_API_KEY` environment variable).
- A Mapbox access token (`VITE_MAPBOX_ACCESS_TOKEN` environment variable).

### Install dependencies

```bash
npm install
```

## Configuration

The demo expects a few environment variables:

### Frontend (`apps/frontend`)

Create `apps/frontend/.env.local` with:

```bash
VITE_UAI_SERVER_HOST_URL=http://localhost:3001
VITE_UAI_DB_API_HOST_URL=http://localhost:3002/api
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

- `VITE_UAI_SERVER_HOST_URL` – base URL of the UAI Server.
- `VITE_UAI_DB_API_HOST_URL` – base URL of the API-DB service (the app appends `/shipments` etc.).
- `VITE_MAPBOX_ACCESS_TOKEN` – Mapbox token from your Mapbox account; without it, map-based views will not work.

### UAI Server (`apps/uai-server`)

Create `apps/uai-server/.env.local` with at least your AI provider configuration, for example:

```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

The agent configuration (model, instructions) lives in `apps/uai-server/src/agent.ts`.

### API-DB (`apps/api-db`)

Optionally, create `apps/api-db/.env.local` to override the default port:

```bash
PORT=3002
```

The database is an in-memory store seeded from static shipment data and is wiped on server restart.

## Running the demo locally

From the repo root:

```bash
# Start all apps in dev mode via Turbo
npm run dev
```

By default this will run:

- Frontend dev server (Vite) – usually on `http://localhost:5173`.
- UAI Server – `http://localhost:3001` (see `/health` and `/api/uai-server`).
- API-DB server – `http://localhost:3002` (see `/health` and `/api/shipments`).

Open the frontend in your browser, read the initial assistant message, and start typing natural-language requests to explore shipments and the UI.

## Other scripts

From the repo root:

- `npm run build` – build all apps and packages.
- `npm run build:frontend` – build only the frontend.
- `npm run build:uai-server` – build only the UAI Server.
- `npm run build:api-db` – build only the API-DB.
- `npm run lint` – run ESLint across the workspace.
- `npm run type-check` – run TypeScript type checking.

## Learn more

- Product and concept overview: [futuristic.digital – User Agent Interface](https://www.futuristic.digital/#our-work)
- Live demo: [uai.futuristic.digital](https://uai.futuristic.digital/)

# UAI Demo Monorepo

A monorepo containing a React frontend (UAI client) and two Node.js backend APIs (UAI server and a database API).

## Structure

```
uai-demo/
├── apps/
│   ├── frontend/      # React frontend app (UAI client)
│   ├── uai-server/    # LLM + MCP server API (UAI server)
│   └── api-db/        # Database API (API-DB)
└── packages/          # Shared packages (if needed)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Development

Run all apps in development mode:

```bash
npm run dev
```

This will start:

- Frontend: http://localhost:5173 (or configured port)
- UAI-Server: http://localhost:3001
- API-DB: http://localhost:3002

### Build

Build all apps:

```bash
npm run build
```

### Environment Variables

1. Copy `.env.example` to `.env` in the root directory
2. Configure environment variables for each app as needed
3. Each app can also have its own `.env` file

## Deployment

This monorepo is configured for Vercel deployment. Each app will be deployed as a separate service.

### Vercel Setup

1. Connect your repository to Vercel
2. Vercel will automatically detect the monorepo structure
3. Configure each app in `vercel.json` or through Vercel dashboard

## Apps

### Frontend (`apps/frontend`)

React application built with UAI Client. Connects to both backend APIs.

**Tech Stack:**

- React 18
- Vite
- TypeScript

**Endpoints:**

- Development: http://localhost:5173

### UAI-Server (`apps/uai-server`)

Node.js API for interacting with LLMs using Vercel AI SDK and MCP servers.

**Tech Stack:**

- Express
- Vercel AI SDK
- TypeScript

**Endpoints:**

- Health: `GET /health`
- LLM Chat: `POST /api/llm/chat`
- MCP Execute: `POST /api/mcp/execute`
- MCP Tools: `GET /api/mcp/tools`

**Development:** http://localhost:3001

### API-DB (`apps/api-db`)

Node.js API for database operations.

**Tech Stack:**

- Express
- TypeScript
- (Database ORM to be added - Prisma/Drizzle recommended)

**Endpoints:**

- Health: `GET /health`
- Users: `GET /api/users`
- Create User: `POST /api/users`
- Get User: `GET /api/users/:id`
- Update User: `PUT /api/users/:id`
- Delete User: `DELETE /api/users/:id`

**Development:** http://localhost:3002

## Project Structure

```
uai-demo/
├── apps/
│   ├── frontend/          # React frontend
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── vercel.json
│   ├── uai-server/        # LLM + MCP API
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── routes/
│   │   │       ├── llm.ts
│   │   │       └── mcp.ts
│   │   ├── package.json
│   │   └── vercel.json
│   └── api-db/            # Database API
│       ├── src/
│       │   ├── index.ts
│       │   └── routes/
│       │       └── db.ts
│       ├── package.json
│       └── vercel.json
├── packages/              # Shared packages (future)
├── package.json          # Root workspace config
├── turbo.json            # Turborepo config
├── tsconfig.json         # Root TypeScript config
├── vercel.json           # Vercel monorepo config
└── README.md
```

## Next Steps

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables:**

   - Create `.env` files in each app directory
   - See `.env.example` for reference (create this file if needed)

3. **Configure APIs:**

   - **UAI-Server**: Add your LLM provider SDK (e.g., `@ai-sdk/openai`)
   - **API-DB**: Add your database ORM (e.g., Prisma, Drizzle)

4. **Start Development:**

   ```bash
   npm run dev
   ```

5. **Deploy to Vercel:**
   - See `DEPLOYMENT.md` for detailed instructions

## Available Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps
- `npm run lint` - Lint all apps
- `npm run type-check` - Type check all apps
- `npm run clean` - Clean build artifacts

# Deployment Guide - Vercel

This monorepo is configured for deployment on Vercel. Each app will be deployed as a separate service.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (optional, for local testing): `npm i -g vercel`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**

   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will detect the monorepo structure

2. **Configure Each App**

   - Vercel will prompt you to configure each app separately
   - For each app, set:
     - **Root Directory**: Select the app directory (e.g., `apps/frontend`)
     - **Build Command**: Use the Turbo filter so dependencies are built first:
       - **Frontend**: `cd ../.. && npx turbo run build --filter=@uai-demo/frontend`
       - **UAI-Server**: `cd ../.. && npx turbo run build --filter=@uai-demo/uai-server`
       - **API-DB**: `cd ../.. && npx turbo run build --filter=@uai-demo/api-db`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install` (Vercel runs this from the repo root for monorepos, so workspace dependencies like `@uai/client` are installed)

3. **Set Environment Variables**

   - For each app, add the required environment variables:

   **Frontend:**

   - `VITE_UAI_SERVER_URL` - URL of your deployed UAI Server
   - `VITE_API_DB_URL` - URL of your deployed DB API

   **UAI-Server:**

   - `OPENAI_API_KEY` (or your LLM provider key)
   - `MCP_SERVER_URL` (if needed)
   - Any other LLM-related secrets

   **API-DB:**

   - `DATABASE_URL` - Your database connection string
   - Any other database credentials

4. **Deploy**
   - Click "Deploy" for each app
   - Vercel will build and deploy each service

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login**

   ```bash
   vercel login
   ```

3. **Deploy Each App**

   ```bash
   # Deploy frontend
   cd apps/frontend
   vercel

   # Deploy UAI-Server
   cd ../uai-server
   vercel

   # Deploy API-DB
   cd ../api-db
   vercel
   ```

## Post-Deployment Configuration

### Update Frontend Environment Variables

After deploying the APIs, update the frontend environment variables with the actual API URLs:

- `VITE_UAI_SERVER_URL=https://uai-server.vercel.app` (or your custom domain)
- `VITE_API_DB_URL=https://api-db.vercel.app` (or your custom domain)

### Custom Domains

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS as instructed by Vercel

## Project Structure on Vercel

Each app will be deployed as a separate Vercel project:

- `frontend` → `frontend.vercel.app` (or your custom domain)
- `uai-server` → `uai-server.vercel.app` (or your custom domain)
- `api-db` → `api-db.vercel.app` (or your custom domain)

## Continuous Deployment

Vercel automatically deploys on:

- Push to main/master branch (production)
- Push to other branches (preview deployments)
- Pull requests (preview deployments)

## Environment Variables

### Development

Create `.env` files in each app directory or use Vercel CLI:

```bash
vercel env add VARIABLE_NAME
```

### Production

Set environment variables in Vercel dashboard for each project.

## Troubleshooting

### Build Failures

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation passes locally: `npm run build`

### API Connection Issues

1. Verify CORS is configured correctly in your APIs
2. Check that environment variables are set correctly
3. Ensure API URLs in frontend match deployed API URLs

### Monorepo Detection

If Vercel doesn't detect the monorepo structure:

1. Manually configure each app in Vercel dashboard
2. Set the root directory for each project
3. Ensure `package.json` workspaces are configured correctly

## Local Testing with Vercel

Test your Vercel deployment locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run development server
vercel dev
```

This will simulate the Vercel environment locally.

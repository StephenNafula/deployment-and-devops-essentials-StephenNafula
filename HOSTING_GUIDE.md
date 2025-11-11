# Complete Hosting Guide — Backend (Render) & Frontend (Vercel)

This guide walks you through hosting both the backend API and frontend in production using Render and Vercel. Expect this to take 20-30 minutes total.

---

## Part 1: Prepare MongoDB Atlas (Database)

The backend needs a MongoDB database. Create one on MongoDB Atlas (free tier available).

### Step 1.1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create an account (or sign in if you have one)
3. Create an organization (or use the default) and a new project

### Step 1.2: Create a Cluster
1. Click "Create Deployment" → Choose "Free" tier (M0 is free and sufficient)
2. Select your region (pick closest to you or us-east-1 for US)
3. Click "Create Cluster" and wait ~5 minutes for it to initialize

### Step 1.3: Create a Database User
1. Open the cluster → click "Security" → "Database Access"
2. Click "Add New Database User"
   - Username: `mern-app-user` (or any name)
   - Password: Generate a strong password (copy and save it in a safe place)
   - Built-in Role: Select "Read and write to any database"
3. Click "Add User"

### Step 1.4: Add IP Whitelist
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
   - For development: Click "Add Current IP Address"
   - For production: Add the IP of your Render server (you'll get this after creating the Render service, or just use "0.0.0.0/0" to allow all — NOT recommended for production, but fine for this assignment)
3. Click "Confirm"

### Step 1.5: Get the Connection String
1. Open your cluster → Click "Connect"
2. Choose "Drivers" → Select "Node.js" and version "4.x or higher"
3. Copy the connection string:

```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Replace:
- `<username>` with your database user (e.g., `mern-app-user`)
- `<password>` with your database user password
- `<cluster-name>` with your cluster name (shown in Atlas)
- `<database-name>` with a database name (e.g., `mern-app`)

**Save this connection string — you'll paste it into Render and GitHub Secrets.**

---

## Part 2: Create Render Web Service (Backend)

### Step 2.1: Sign Up for Render
1. Go to https://render.com
2. Click "Get Started" → Sign up with GitHub (recommend using GitHub auth for easier deployment linking)
3. Authorize Render to access your GitHub account

### Step 2.2: Create a Web Service
1. From the Render dashboard, click "New +" → "Web Service"
2. Select "Build and deploy from a Git repository"
3. Click "Connect Account" (if not already connected) and authorize your GitHub
4. Find and select your repository: `deployment-and-devops-essentials-StephenNafula`

### Step 2.3: Configure the Service

Fill in the form with these values:

| Field | Value |
|-------|-------|
| Name | `mern-backend` (or any name) |
| Branch | `main` |
| Root Directory | `backend` |
| Environment | `Node` |
| Build Command | `npm ci` |
| Start Command | `node server.js` |
| Instance Type | Free |
| Plan | Free |

### Step 2.4: Add Environment Variables
1. Scroll down to "Environment"
2. Click "Add Environment Variable" and add these:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Paste your MongoDB Atlas connection string from Step 1.5 |
| `NODE_ENV` | `production` |
| `MONGO_MAX_POOL_SIZE` | `50` |
| `PORT` | (Leave empty — Render will set this automatically) |

3. Click "Create Web Service"

Render will now build and deploy your backend. Wait ~2-3 minutes. You'll see the URL of your backend in the top-left of the service page (e.g., `https://mern-backend-abc123.onrender.com`).

### Step 2.5: Test Your Backend

Once deployed, test the health endpoint:

```bash
curl https://mern-backend-abc123.onrender.com/api/health
```

You should see a JSON response like:
```json
{"status":"ok","time":"2025-11-11T10:30:00Z","db":"connected"}
```

If you see errors, check the Render Logs (click "Logs" in the service dashboard).

### Step 2.6: Get Your Render API Key & Service ID (for CI/CD)

**For continuous deployment via GitHub Actions:**

1. Go to https://dashboard.render.com/account/api-keys
2. Click "Create API Key" and copy the key (you'll add this to GitHub Secrets as `RENDER_API_KEY`)
3. Get your service ID:
   - Open your Web Service → Top-left corner shows the URL, service ID is in the URL or in Settings
   - Or run this command (replace with your actual API key and backend URL):

```bash
curl -X GET "https://api.render.com/v1/services" \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY"
```

Look for your service name and copy the `id` field (you'll add this to GitHub Secrets as `RENDER_SERVICE_ID`).

---

## Part 3: Add GitHub Secrets (for CI/CD)

### Step 3.1: Add Render Secrets
1. Go to your GitHub repository → Settings → Secrets & variables → Actions
2. Click "New repository secret"
3. Add these secrets:

| Name | Value |
|------|-------|
| `RENDER_API_KEY` | Your API key from Step 2.6 |
| `RENDER_SERVICE_ID` | Your service ID from Step 2.6 |
| `MONGO_URI` | Your MongoDB connection string (optional, for CI use) |

### Step 3.2: Add Vercel Secrets (we'll fill these after creating the Vercel project)

For now, just know you'll need:
- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`

---

## Part 4: Create Vercel Frontend

### Step 4.1: Sign Up for Vercel
1. Go to https://vercel.com
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### Step 4.2: Create a New Project
1. From the Vercel dashboard, click "Add New..." → "Project"
2. Under "Import Git Repository", search for and select `deployment-and-devops-essentials-StephenNafula`

### Step 4.3: Configure the Project

You'll see a form. Fill in or confirm these:

| Field | Value |
|-------|-------|
| Project Name | `mern-frontend` (or any name) |
| Framework Preset | `Vite` (Vercel should auto-detect) |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

### Step 4.4: Add Environment Variables
1. Scroll down to "Environment Variables"
2. Add this variable:

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_API_BASE_URL` | `https://mern-backend-abc123.onrender.com/api` (replace with your actual backend URL from Step 2.5) | Production |

3. Click "Deploy"

Vercel will build and deploy your frontend. Wait ~2-3 minutes. You'll see a success message with a link to your deployed site (e.g., `https://mern-frontend-xyz.vercel.app`).

### Step 4.5: Test Your Frontend

1. Visit your Vercel URL (e.g., `https://mern-frontend-xyz.vercel.app`)
2. You should see the React app load
3. Check the browser console for any errors
4. If there's a health check section in your app, it should show the backend status

---

## Part 5: Add Vercel Secrets to GitHub (for CI/CD)

### Step 5.1: Get Vercel Token
1. Go to https://vercel.com/account/tokens
2. Click "Create" under "Tokens"
3. Name: `github-actions` (or any name)
4. Copy the token (you'll only see it once)

### Step 5.2: Get Vercel Project ID
1. Open your Vercel project (the frontend)
2. Go to Settings → General
3. Copy "Project ID"

### Step 5.3: Get Vercel Org ID
1. Go to https://vercel.com/account/settings
2. Copy "Team ID" (this is your org ID)

### Step 5.4: Add to GitHub Secrets
1. Go to your GitHub repository → Settings → Secrets & variables → Actions
2. Click "New repository secret" and add:

| Name | Value |
|------|-------|
| `VERCEL_TOKEN` | Your token from Step 5.1 |
| `VERCEL_PROJECT_ID` | Your project ID from Step 5.2 |
| `VERCEL_ORG_ID` | Your org/team ID from Step 5.3 |

---

## Part 6: Test CI/CD Pipelines

### Step 6.1: Trigger a Deploy
1. Make a small change to your code (e.g., update `README.md`)
2. Commit and push to `main`:

```bash
git add README.md
git commit -m "test: trigger CI/CD pipeline"
git push origin main
```

### Step 6.2: Monitor GitHub Actions
1. Go to your GitHub repo → Actions tab
2. You should see workflows running:
   - Backend CI, Frontend CI (linting/tests/build)
   - Backend CD, Frontend CD (deployments)
3. Watch the logs to confirm everything passes

### Step 6.3: Verify Deployments
1. Once CI/CD completes, check your Render backend:
   - Visit `https://mern-backend-abc123.onrender.com/api/health`
   - Should return status `ok`
2. Check your Vercel frontend:
   - Visit your Vercel URL
   - Page should load and show the latest code

---

## Part 7: Custom Domains (Optional)

### Add Custom Domain to Render (Backend)
1. Open your Render service → Settings → Custom Domains
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `api.myapp.com`)
4. Follow DNS instructions (add CNAME record to your domain registrar)
5. Render will issue an SSL certificate automatically

### Add Custom Domain to Vercel (Frontend)
1. Open your Vercel project → Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., `myapp.com`)
4. Follow DNS instructions
5. Vercel will issue an SSL certificate automatically

---

## Part 8: Verify Everything is Working

### Checklist
- [ ] Backend deploys successfully on Render
- [ ] `/api/health` returns `ok` and shows DB connected
- [ ] Frontend deploys successfully on Vercel
- [ ] Frontend page loads and displays content
- [ ] Frontend can call backend API (check browser Network tab)
- [ ] GitHub Actions workflows run on push and deploy automatically
- [ ] Environment variables are set correctly on both platforms

---

## Troubleshooting

### Backend won't start on Render
- Check Render Logs for error messages
- Ensure `MONGO_URI` is correct and your IP is whitelisted in MongoDB Atlas
- Make sure `backend/server.js` exists and has the right `start` command

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_BASE_URL` points to correct backend URL
- Check Vercel deployment logs

### CI/CD workflow fails
- Check GitHub Actions logs (Actions tab → workflow run → logs)
- Verify all GitHub Secrets are set correctly
- Make sure your repo has read/write permissions for Render and Vercel APIs

### API calls from frontend fail
- Check browser Network tab to see exact error
- Verify backend URL in frontend environment variables
- Check CORS headers on backend (backend should accept requests from frontend domain)

---

## Next Steps

1. **Monitor your deployments**: Use Render and Vercel dashboards to check uptime and errors
2. **Set up monitoring**: Add Sentry (see `monitoring/SENTRY.md`) to catch production errors
3. **Add custom domain**: Follow Part 7 for branded URLs
4. **Scale if needed**: Upgrade from free tier to paid if traffic increases

For more details on individual steps, see:
- `DEPLOYMENT.md` — deployment strategies and alternatives
- `RENDER_CHECKLIST.md` — copy/paste Render configuration values
- `README.md` — project overview and local development

Good luck with your deployment! 🚀

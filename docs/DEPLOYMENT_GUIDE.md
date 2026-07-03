# Deployment Guide - Aalto Engineers Admin Panel

This guide covers deploying the Aalto Engineers Admin Panel to production.

## Prerequisites

- GitHub account with repository access
- Render account (for backend) or alternative (Railway, Fly.io)
- Vercel account (for frontend)
- MySQL database (can use Render's managed MySQL or external provider)

## Backend Deployment (Render)

### Step 1: Prepare Database

**Option A: Use Render's Managed MySQL**
1. Go to Render Dashboard → New → PostgreSQL (or MySQL if available)
2. Create database instance
3. Note the connection details (host, port, user, password, database name)

**Option B: Use External MySQL**
1. Ensure your MySQL database is accessible from the internet
2. Note the connection details

### Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure build settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Runtime**: Node 18+

5. Configure Environment Variables (from `backend/.env.example`):
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=<your-db-host>
   DB_PORT=3306
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_NAME=aalto_admin
   JWT_SECRET=<generate-secure-random-string>
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=<generate-secure-random-string>
   JWT_REFRESH_EXPIRES_IN=30d
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png
   ```

6. Click **Deploy Web Service**

7. After deployment, note your backend URL (e.g., `https://aalto-backend.onrender.com`)

### Step 3: Run Database Migrations

1. SSH into your Render service or use Render's shell
2. Run seed scripts if needed:
   ```bash
   node src/scripts/seedAdmin.js
   ```

## Frontend Deployment (Vercel)

### Step 1: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Configure Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api/v1
   VITE_API_TIMEOUT=30000
   VITE_APP_NAME=Aalto Engineers Admin
   VITE_APP_VERSION=1.0.0
   VITE_ENABLE_MOCK_API=false
   VITE_ENABLE_DEBUG_MODE=false
   ```

6. Click **Deploy**

7. After deployment, note your frontend URL (e.g., `https://aalto-admin.vercel.app`)

### Step 2: Update Backend CORS

1. Go to Render Dashboard → Your Backend Service
2. Update `CORS_ORIGIN` environment variable to your Vercel URL
3. Redeploy the service

## Alternative Deployment Platforms

### Railway

1. Create Railway account
2. New Project → Deploy from GitHub
3. Select repository
4. Configure environment variables
5. Railway automatically detects Node.js and builds

### Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Initialize: `fly launch --remote-only` (in backend directory)
4. Configure environment variables
5. Deploy: `fly deploy`

## Post-Deployment Checklist

- [ ] Backend is accessible and returns 200 on health check
- [ ] Frontend loads without errors
- [ ] Login functionality works
- [ ] All CRUD operations function correctly
- [ ] File uploads work properly
- [ ] Database connections are stable
- [ ] CORS is configured correctly
- [ ] Environment variables are set (not using defaults)
- [ ] SSL/HTTPS is enabled
- [ ] Error logging is configured

## Troubleshooting

### Backend Issues

**Database Connection Failed**
- Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- Check if database allows external connections
- Verify firewall settings

**Port Already in Use**
- Render automatically assigns ports, ensure you're using `process.env.PORT`

**File Upload Issues**
- Verify MAX_FILE_SIZE is set correctly
- Check ALLOWED_FILE_TYPES
- Ensure uploads directory exists and is writable

### Frontend Issues

**API Connection Failed**
- Verify VITE_API_BASE_URL is correct
- Check backend CORS configuration
- Ensure backend is deployed and accessible

**Build Errors**
- Clear Vercel cache and redeploy
- Check Node.js version compatibility
- Verify all dependencies are installed

## Security Recommendations

1. **Generate strong JWT secrets** (minimum 32 characters)
2. **Use environment-specific values** (never commit secrets)
3. **Enable HTTPS** (automatic on Vercel and Render)
4. **Configure rate limiting** (already in backend)
5. **Use managed database** with automatic backups
6. **Regularly update dependencies**
7. **Monitor logs for suspicious activity**

## Monitoring

### Render
- Automatic monitoring in dashboard
- Log streaming available
- Metrics for CPU, memory, response time

### Vercel
- Analytics dashboard
- Real-time logs
- Performance metrics
- Error tracking

## Cost Estimates

**Render (Free Tier)**
- 750 hours/month
- Limited resources
- Suitable for development/testing

**Render (Paid)**
- Starts at $7/month
- Better performance
- More resources

**Vercel (Hobby)**
- Free for personal projects
- 100GB bandwidth/month
- Unlimited deployments

**Database**
- Render PostgreSQL: Free tier available
- External MySQL: Varies by provider

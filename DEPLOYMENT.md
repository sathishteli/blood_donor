# LifeLink Deployment Guide

## Quick Deploy to Render

### Step 1: Prepare Your MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Create a database user with password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Whitelist all IP addresses (0.0.0.0/0) for Render access

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 3: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `lifelink-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Add Environment Variables:
   ```
   MONGO_URI = mongodb+srv://your_connection_string
   JWT_SECRET = your_random_secret_key_here
   NODE_ENV = production
   PORT = 5000
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://lifelink-backend.onrender.com`)

### Step 4: Deploy Frontend on Render

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `lifelink-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://lifelink-backend.onrender.com
   ```
   (Use the URL from Step 3)

5. Click **"Create Static Site"**
6. Wait for deployment (5-10 minutes)

### Step 5: Update Backend CORS

1. Go back to your backend service on Render
2. Add environment variable:
   ```
   FRONTEND_URL = https://your-frontend-url.onrender.com
   ```
3. The backend will automatically redeploy

### Step 6: Test Your Application

1. Open your frontend URL
2. Register a new user
3. Login
4. Test all features

## Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Ensure JWT_SECRET is set
- Check Render logs for errors

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is set correctly
- Check CORS settings on backend
- Clear browser cache

### Database connection issues
- Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access
- Verify MongoDB connection string format
- Check database user credentials

## Free Tier Limitations

- Backend service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for 24/7 with one service)

## Updating Your App

```bash
# Make changes to code
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically redeploy when you push to GitHub!

# Heroku Backend Deployment Guide

## Prerequisites
Before deploying, you need:
1. A MongoDB database (MongoDB Atlas - free tier)
2. A Heroku account
3. This GitHub repository

---

## Step 1: Set Up MongoDB

### 1a. Create MongoDB Atlas Account
- Visit: https://www.mongodb.com/cloud/atlas
- Click **"Sign Up"** (or login if you have account)
- Complete the signup process

### 1b. Create a Free Cluster
- After login, click **"+ Create"** to create new project
- Name your project: `WorkSphere`
- Click **"Create Project"**
- Click **"Build a Database"**
- Choose **"FREE"** (M0 Sandbox)
- Select your cloud provider and region
- Click **"Create"**
- Wait for cluster to initialize (2-3 minutes)

### 1c. Get Connection String
- In MongoDB Atlas, go to your cluster
- Click **"Connect"**
- Choose **"Drivers"**
- Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/worksphere?retryWrites=true&w=majority`)
- **Save this** - you'll need it for Heroku

---

## Step 2: Create Heroku App

### 2a. Create Heroku Account
- Visit: https://www.heroku.com
- Click **"Sign up"**
- Complete signup

### 2b. Create New App
- Go to: https://dashboard.heroku.com/apps
- Click **"New"** → **"Create new app"**
- **App name:** `office-management-system-123` (choose unique name - no spaces, lowercase)
  - Example: `office-mgmt-surendra123` or similar
- **Region:** Choose closest to you (e.g., US or Europe)
- Click **"Create app"**

### 2c. Add Environment Variables
- In your app dashboard, click **"Settings"** tab
- Click **"Reveal Config Vars"**
- Add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string (from Step 1c) |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production-12345` |
| `PORT` | `5000` |

**SAVE each one as you add it**

---

## Step 3: Deploy from GitHub

### 3a. Connect GitHub
- In your Heroku app, go to **"Deploy"** tab
- Under **"Deployment method"**, click **"Connect to GitHub"**
- Search for: `Office-Management-System`
- Click **"Connect"**

### 3b. Enable Automatic Deploys
- Under **"Automatic deploys"**, click **"Enable Automatic Deploys"**
- Make sure branch is set to `main`

### 3c. Manual Deploy (First Time)
- Under **"Manual deploy"**, click **"Deploy Branch"**
- Wait for deployment to complete (2-3 minutes)
- You should see: **"Your app was successfully deployed"**

### 3d. Get Your App URL
- Click **"Open app"** button at top right
- Your backend URL is shown in the browser
- **Example:** `https://office-management-system-123.herokuapp.com`
- **SAVE THIS** - you need it for the next step

---

## Step 4: Update Frontend Config

### 4a. Update public/config.js
- Replace the placeholder URL with your Heroku app URL
- The file should look like:

```javascript
const API_BASE_URL = "https://office-management-system-123.herokuapp.com"; // Your Heroku URL
const API_URL = `${API_BASE_URL}/api`;
```

### 4b. Push to GitHub
- The change will auto-deploy to GitHub Pages
- Wait ~2 minutes for GitHub Pages to update

---

## Step 5: Test the Full Application

### ✅ Test Signup
- Go to: https://surendra1028.github.io/Office-Management-System/signup
- Create a new account (e.g., email: `test@example.com`, password: `Test@123`)
- Should succeed ✓

### ✅ Test Login
- Go to: https://surendra1028.github.io/Office-Management-System/login
- Login with created account
- Should show employee dashboard ✓

### ✅ Test Admin
- Login with: 
  - Email: `admin@worksphere.com`
  - Password: `Admin@123`
- Should show admin dashboard ✓

---

## Troubleshooting

### Signup/Login Not Working
- Check that `MONGODB_URI` is correct in Heroku Config Vars
- Check that `public/config.js` has the correct Heroku URL
- Check Heroku app logs: **"More"** → **"View logs"**

### Connection Timeout
- Wait 5 minutes after Heroku deployment
- Heroku apps go to sleep on free tier - first request takes longer

### MongoDB Connection Error
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist includes: `0.0.0.0/0` (allow all IPs)
  - In MongoDB Atlas: **Network Access** → Make sure `0.0.0.0/0` is added

### Heroku App Won't Deploy
- Check GitHub Actions to ensure frontend deployed successfully
- Check Heroku app deployment logs for errors
- Verify `Procfile` exists in repository root

---

## Your Live URLs (After Deployment)
- **Frontend:** https://surendra1028.github.io/Office-Management-System/
- **Backend API:** https://your-app-name.herokuapp.com
- **Admin Dashboard:** https://surendra1028.github.io/Office-Management-System/admin-dashboard.html

---

## Next Steps (Optional)
- Add more employees via admin dashboard
- Configure leave policies, salary details, etc.
- Customize the application theme/branding

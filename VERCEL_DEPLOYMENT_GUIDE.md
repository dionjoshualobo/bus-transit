# 🚀 Vercel Deployment Guide - Bus Transit App

## ✅ Prerequisites Checklist
- [x] GitHub repository: `dionjoshualobo/bus-transit` (public repo)
- [x] All code committed and pushed to `main` branch
- [x] Vercel configuration file (`vercel.json`) present
- [x] Environment-aware API calls configured

---

## 📋 EXACT DEPLOYMENT STEPS

### **Step 1: Go to Vercel**
1. Open your browser and go to: **https://vercel.com**
2. Click **"Sign Up"** or **"Login"** (top-right corner)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

### **Step 2: Import the GitHub Repository**
1. After logging in, you'll see the Vercel Dashboard
2. Click the **"Add New..."** button (top-right)
3. Select **"Project"** from the dropdown menu
4. You'll see a list of your GitHub repositories
5. Find **`dionjoshualobo/bus-transit`** in the list
6. Click the **"Import"** button next to it

---

### **Step 3: Configure Project Settings**

#### **Framework Preset:**
- Vercel should auto-detect: **"Other"** or **"Vite"** 
- ✅ **Leave it as detected** (don't change)

#### **Root Directory:**
- ✅ **Leave BLANK** (root of repository)
- Do NOT set to `frontend` or `backend`

#### **Build and Output Settings:**
Click **"Edit"** next to Build and Output Settings (if needed):

| Setting | Value |
|---------|-------|
| **Build Command** | Leave empty or use: `npm run vercel-build` |
| **Output Directory** | Leave empty (vercel.json handles this) |
| **Install Command** | Leave as default: `npm install` |

⚠️ **IMPORTANT:** Because we have `vercel.json` with custom builds, these settings will be ignored anyway. Just leave them as default.

#### **Environment Variables:**
✅ **NO ENVIRONMENT VARIABLES NEEDED!** 
- The Gemini API key is already in the code (as requested)
- Skip this section entirely

---

### **Step 4: Deploy**
1. Review the settings (everything should be default)
2. Click the big **"Deploy"** button
3. ⏳ Wait 2-3 minutes for the build to complete
4. You'll see a progress screen with build logs

**Build Process:**
- ✅ Installing dependencies (frontend + backend)
- ✅ Building frontend (Vite)
- ✅ Packaging backend (Node.js serverless)
- ✅ Deploying to Vercel edge network

---

### **Step 5: Access Your Deployed App**
Once deployment is complete:

1. You'll see a **"Congratulations"** screen with confetti 🎉
2. You'll get **3 URLs** (all point to the same app):
   - `https://bus-<hash>.vercel.app` (deployment-specific)
   - `https://bus-<username>.vercel.app` (user-specific)
   - `https://bus.vercel.app` (project domain - may need to be set)

3. Click **"Visit"** or copy the URL

---

### **Step 6: Make Project Public (CRITICAL!)**

⚠️ **By default, the project might be set to private. Here's how to make it public:**

1. After deployment, click **"Go to Dashboard"**
2. Click on your project name: **"bus"**
3. Go to **"Settings"** (top navigation bar)
4. Click **"Deployment Protection"** in the left sidebar
5. You'll see **"Vercel Authentication"** toggle
6. Make sure it's **OFF** (disabled)
7. If there's a **"Password Protection"** toggle, turn it **OFF** too
8. Click **"Save"** if prompted

**Now your app is publicly accessible!** 🌐

---

## 🧪 Testing Your Deployment

### **Test Checklist:**

1. **Home Page:**
   - Open: `https://your-app.vercel.app/`
   - Should see the home page with bus image and navigation

2. **Login:**
   - Go to: `/login`
   - Test with existing user (from `users.json`)
   - Should successfully log in

3. **Routes Page:**
   - Go to: `/routes`
   - Select "From: KSRTC Bus Stand Mangalore"
   - Select "To: Udupi Bus Stand"
   - Click "Search Routes"
   - Should show bus routes with timings

4. **Trips Page:**
   - Go to: `/trips`
   - Select source and destination
   - Click "Calculate Fare"
   - Should show fare comparison

5. **Places Page:**
   - Go to: `/places`
   - Should see tabs: Lodges, Hospitals, Banks, Restaurants
   - Each tab should show 5-6 places with details

6. **Chatbot:**
   - Click the floating chat icon (bottom-right)
   - Type: "What buses go to Udupi?"
   - Should get AI-powered response

7. **API Health:**
   - Visit: `/api/health` (should return JSON)
   - If you get 404, wait a few minutes and try again

---

## ⚙️ Project Configuration Summary

Your project uses:
- **Frontend:** React + Vite + TypeScript (port 8080 locally, serverless on Vercel)
- **Backend:** Node.js + Express (port 5000 locally, serverless on Vercel)
- **Routing:** `/api/*` → backend serverless functions
- **Routing:** `/*` → frontend static files
- **Database:** JSON files (stops.json, buses.json, routes.json, users.json)
- **AI:** Google Gemini 1.5 Flash (API key in code)

**Project Structure:**
```
bus/
├── package.json          # Root (only has concurrently for local dev)
├── vercel.json           # Vercel configuration
├── frontend/
│   ├── package.json      # Frontend dependencies (React, Vite, etc.)
│   └── dist/             # Build output (generated by Vite)
└── backend/
    ├── package.json      # Backend dependencies (Express, Gemini, etc.)
    └── server.js         # Main backend file
```

**Important:** 
- Root `package.json` is minimal (only for local development scripts)
- Backend dependencies are in `backend/package.json`
- Frontend dependencies are in `frontend/package.json`
- Vercel installs each separately during build

---

## 🔧 Troubleshooting

### **Problem: 404 Error on Home Page**
**Solution:**
- Go to Settings → Deployment Protection
- Turn OFF "Vercel Authentication"
- Redeploy if needed: Settings → Deployments → Click "..." → "Redeploy"

### **Problem: API Routes Return 404**
**Cause:** Backend serverless functions not deployed
**Solution:**
1. Check build logs: Settings → Deployments → Click on latest deployment
2. Look for errors in the build logs
3. Ensure `backend/server.js` exists and is committed
4. Redeploy from GitHub: Settings → Git → Click "Redeploy" button

### **Problem: Frontend Shows White Screen**
**Cause:** Frontend build failed
**Solution:**
1. Check build logs for errors
2. Ensure `frontend/dist` is generated during build
3. Verify `frontend/package.json` has `"vercel-build": "vite build"`
4. Redeploy

### **Problem: Chatbot Not Working**
**Cause:** Gemini API key issue
**Solution:**
1. The API key is already in `backend/utils/chatbotAPI.js`
2. Check that the key is valid: `AIzaSyCTVsq-vJU2tAX7OupUiAtmThuERCLmHk4`
3. Test chatbot locally first: `npm run dev`
4. If key expired, update it in the code and push

### **Problem: "builds" Warning Message**
This is **NORMAL** and expected:
```
Due to `builds` existing in your configuration file, 
the Build and Development Settings defined in your 
Project Settings will not apply.
```
✅ This means `vercel.json` is controlling the build (which is what we want!)

---

## 📊 What Works on Vercel

✅ **Working Features:**
- All routes (/, /login, /register, /routes, /trips, /places)
- Authentication (JWT tokens)
- Route finding with transfers
- Fare calculator
- Places discovery
- AI Chatbot (Gemini)
- API endpoints (/api/*)

⚠️ **Limitations:**
- **New User Registration:** User data is stored in JSON files, which are read-only on Vercel. New registrations won't persist between deployments.
  - **Solution:** Pre-populate `backend/data/users.json` with test accounts
- **SQLite Database:** Read-only on Vercel, but JSON fallback works
- **File Uploads:** Not supported (not used in this app anyway)

---

## 🎯 Post-Deployment

### **Share Your App:**
1. Copy your production URL: `https://bus-<username>.vercel.app`
2. Share it with your team/teachers
3. Everyone can access it without login to Vercel

### **Custom Domain (Optional):**
If you want a custom domain like `bus.yourdomain.com`:
1. Go to Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-10 minutes)

### **View Analytics:**
- Go to your project dashboard
- Click "Analytics" tab
- See visitor count, popular pages, response times

### **Redeploy After Changes:**
Vercel auto-deploys on every push to `main` branch:
1. Make changes locally
2. `git add .`
3. `git commit -m "your message"`
4. `git push origin main`
5. Vercel automatically rebuilds and deploys (check Dashboard)

---

## 📞 Support

**Vercel Documentation:** https://vercel.com/docs
**This Project on GitHub:** https://github.com/dionjoshualobo/bus-transit

---

## ✅ Final Checklist Before Sharing

- [ ] App deployed successfully
- [ ] Vercel Authentication is OFF (public access)
- [ ] Home page loads
- [ ] Login works
- [ ] Routes page shows bus routes
- [ ] Trips page calculates fares
- [ ] Places page shows all places
- [ ] Chatbot responds to questions
- [ ] Production URL copied and ready to share

---

🎉 **Your Bus Transit App is Now Live on Vercel!** 🚌

Share your production URL with your team:
```
https://bus-<your-username>.vercel.app
```

**Good luck with your school project!** 🎓✨

# Frontend Deployment Guide for Render

## Overview
This guide will help you deploy your React frontend to Render, configured to work with your deployed backend API.

## Prerequisites
- ✅ Backend deployed successfully on Render
- ✅ Backend API URL available (e.g., `https://your-backend-app.onrender.com`)

## Step 1: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** and select **"Static Site"**
3. Connect your GitHub repository: `JJE_RTGS_GENERATOR_NEW`
4. Configure the service:

### Build Settings
```
Name: rtgs-frontend (or your preferred name)
Branch: main
Root Directory: frontend
Build Command: npm run build
Publish Directory: frontend/dist
```

## Step 2: Environment Variables

Set these environment variables in Render:

### Required Environment Variables
```
VITE_API_URL=https://your-backend-app.onrender.com/api
```

**Replace** `your-backend-app.onrender.com` with your actual backend URL from Step 1.

## Step 3: Build Configuration

The frontend is already configured with:
- ✅ Vite build optimization
- ✅ Code splitting for better performance  
- ✅ Environment variable support
- ✅ Static file serving

## Step 4: Deploy

1. Click **"Create Static Site"**
2. Render will automatically:
   - Install dependencies (`npm install`)
   - Build the application (`npm run build`)
   - Deploy the static files

## Step 5: Update Backend CORS

Once your frontend is deployed, update your backend's CORS settings:

1. Get your frontend URL (e.g., `https://your-frontend-app.onrender.com`)
2. Add it to the CORS origins in your backend environment variables:

```
# In your backend Render service environment variables
CORS_ORIGINS=https://your-frontend-app.onrender.com,http://localhost:3000
```

## Step 6: Test the Deployment

1. Visit your deployed frontend URL
2. Test the login functionality
3. Verify API calls are working correctly
4. Check browser console for any errors

## Troubleshooting

### Common Issues:

#### 1. API Calls Failing (CORS Error)
- **Solution**: Make sure your frontend URL is added to backend CORS settings
- **Check**: Browser console for CORS error messages

#### 2. Environment Variables Not Working
- **Solution**: Ensure variables start with `VITE_` prefix
- **Check**: Build logs show the correct `VITE_API_URL`

#### 3. Build Failures
- **Solution**: Check that all dependencies are in `package.json`
- **Check**: Build logs for specific error messages

#### 4. 404 on Page Refresh
- **Solution**: Add `_redirects` file to public directory with:
  ```
  /*    /index.html   200
  ```

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend built and deployed successfully  
- [ ] Environment variables configured correctly
- [ ] CORS settings updated on backend
- [ ] Login/authentication working
- [ ] All API calls successful
- [ ] No console errors in browser
- [ ] Mobile responsive design working

## Automatic Deployments

Render will automatically redeploy when you:
- Push changes to the `main` branch
- The build will only trigger for changes in the `frontend/` directory

## Files Modified for Deployment

- ✅ `frontend/.env` - Environment variables
- ✅ `frontend/vite.config.js` - Build configuration  
- ✅ `frontend/src/components/BankDetails.jsx` - Removed hardcoded URLs
- ✅ `frontend/src/pages/Dashboard.jsx` - Uses API service

## Next Steps

After successful deployment:
1. Test all application features
2. Set up monitoring (optional)
3. Configure custom domain (optional)
4. Set up SSL certificate (automatic with Render)

Your RTGS Automation app should now be fully deployed and accessible! 🚀
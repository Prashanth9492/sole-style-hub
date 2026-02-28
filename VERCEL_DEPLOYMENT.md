# Vercel Deployment Guide

## Backend Deployment Fixed! 🚀

Your backend is now configured to deploy on Vercel as serverless functions.

## Changes Made

1. **Created `vercel.json`** - Configured Vercel to:
   - Deploy backend as serverless function
   - Route `/api/*` requests to backend
   - Serve frontend static files
   - Set up environment variables

2. **Updated `server/index.ts`** - Modified to:
   - Export Express app for Vercel
   - Only start server in development mode
   - Work with serverless architecture

3. **Updated `package.json`** - Added:
   - `vercel-build` script for deployment

## Next Steps

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Configure backend for Vercel deployment"
git push origin main
```

### 2. Configure Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

**For All Environments (Production, Preview, Development):**

- `MONGODB_URI` = `mongodb+srv://prashanth:prashanth@cluster0.mcuwliu.mongodb.net/?appName=Cluster0`
- `CLOUDINARY_CLOUD_NAME` = `djbvamtcx`
- `CLOUDINARY_API_KEY` = `292935288999799`
- `CLOUDINARY_API_SECRET` = `ZpsUPnFNAE_e8cO9rU0wUKmrPjs`
- `RAZORPAY_KEY_ID` = `rzp_test_SBkFF4ycVcZJRl`
- `RAZORPAY_KEY_SECRET` = `YOdYFi75V1BWQmeZb4d2qr0I`
- `NODE_ENV` = `production`

**How to add environment variables:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable one by one
5. Make sure to check all environments (Production, Preview, Development)

### 3. Update Frontend API URL

After deployment, update the `VITE_API_URL` in your environment variables to point to your Vercel deployment URL:

In Vercel Environment Variables, add:
- `VITE_API_URL` = `https://your-domain.vercel.app/api`

Or update your frontend code to use relative URLs (`/api/...` instead of `http://localhost:3001/api/...`)

### 4. Redeploy

Once you've:
- ✅ Pushed the code changes
- ✅ Added all environment variables in Vercel

Trigger a new deployment:
- Either push a new commit
- Or go to Vercel dashboard → Deployments → Redeploy

## Testing

After deployment, test these endpoints:

1. **Health Check**: `https://your-domain.vercel.app/api/health`
2. **Products**: `https://your-domain.vercel.app/api/products`
3. **Categories**: `https://your-domain.vercel.app/api/categories`

## Important Notes

⚠️ **MongoDB Atlas Network Access**: Make sure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0`) since Vercel's serverless functions use dynamic IPs.

To configure this:
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Select "Allow Access from Anywhere" (0.0.0.0/0)

## Troubleshooting

### Backend still not working?
- Check Vercel deployment logs for errors
- Verify all environment variables are set correctly
- Check MongoDB Atlas network access settings
- Look at the Function Logs in Vercel dashboard

### API requests failing?
- Make sure `VITE_API_URL` points to your Vercel domain
- Check browser console for CORS errors
- Verify routes are correctly configured

## Architecture

- **Frontend**: Static files served by Vercel CDN
- **Backend**: Serverless functions (each API route runs as a separate function)
- **Database**: MongoDB Atlas (external)
- **File Storage**: Cloudinary (external)
- **Payments**: Razorpay (external)


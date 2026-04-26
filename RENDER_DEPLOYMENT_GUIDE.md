# Render Deployment Guide

## Issues Fixed ✅

1. **Added build script** - Render requires a `build` script in package.json
2. **Fixed security vulnerability** - Updated nodemailer to latest secure version

## Render Configuration

### Build & Deploy Settings

When setting up your backend on Render, use these settings:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

### Environment Variables

Make sure to add all these environment variables in Render Dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
OTP_EXPIRES_IN=10
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
BREVO_SENDER_NAME=NHIS Booking
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Important Notes

1. **MongoDB Connection**: Make sure your MongoDB Atlas allows connections from Render's IP addresses (or use `0.0.0.0/0` for all IPs)

2. **CORS Configuration**: The backend is configured to accept requests from your CLIENT_URL. Make sure this matches your frontend deployment URL.

3. **Health Check**: Render will ping your service. The root endpoint `/` returns a health check response.

4. **Logs**: Check Render logs if deployment fails. Common issues:
   - Missing environment variables
   - MongoDB connection failures
   - Port binding issues (Render provides PORT automatically)

### Testing Your Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-app.onrender.com/

# API health
curl https://your-app.onrender.com/api/health
```

### Connecting Frontend to Backend

Update your frontend's `.env` file:

```
VITE_API_URL=https://your-app.onrender.com
```

Then redeploy your frontend on Vercel.

## Troubleshooting

### Build Fails
- Check that all dependencies are in `dependencies` not `devDependencies`
- Verify Node version compatibility (Render uses Node 20 by default)

### App Crashes After Deploy
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check Render logs for specific error messages

### CORS Errors
- Ensure CLIENT_URL environment variable matches your frontend URL exactly
- Check that frontend is using the correct backend URL

## Next Steps

1. Push these changes to your Git repository
2. Trigger a new deploy on Render (or it will auto-deploy if connected to Git)
3. Verify deployment succeeds
4. Test API endpoints
5. Update frontend environment variables
6. Redeploy frontend

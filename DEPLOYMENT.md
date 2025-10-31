# Deployment Guide for Synchronicity Go™

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Supabase project credentials (already configured in `.env`)

## Step 1: Push to GitHub

1. Initialize Git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Synchronicity Go ready for deployment"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it `synchronicity-go`
   - Do NOT initialize with README (your project already has files)
   - Click "Create repository"

3. Push your code:
```bash
git remote add origin https://github.com/YOUR-USERNAME/synchronicity-go.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub

2. Click "Add New..." → "Project"

3. Import your `synchronicity-go` repository

4. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Add Environment Variables:
   Click "Environment Variables" and add these exact values:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://vbkgivdhiskwbbtajbvs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZia2dpdmRoaXNrd2JidGFqYnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTQyMjgsImV4cCI6MjA3NzQzMDIyOH0.1EwMDQtw9dXOKkkXRTjtWal9A8QYsP5XdtzMWWE1Idk
   ```

6. Click "Deploy"

## Step 3: Custom Domain (Optional)

### Using Vercel's Free Domain
Your app will be available at: `https://synchronicity-go.vercel.app`

### Using Your Custom Domain (Bookcrk.com)
1. In Vercel project settings, go to "Domains"
2. Add your domain: `bookcrk.com` or `app.bookcrk.com`
3. Follow Vercel's DNS instructions:
   - Log into your Square domain settings
   - Add the DNS records Vercel provides
   - Common setup:
     - Type: A Record
     - Name: @ (or subdomain like `app`)
     - Value: `76.76.21.21` (Vercel's IP)
     - Or use CNAME: `cname.vercel-dns.com`

4. Wait for DNS propagation (can take 1-48 hours)

## Step 4: Update Supabase Settings

After deployment, update your Supabase project with the production URL:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your production URL to:
   - **Site URL**: `https://your-vercel-url.vercel.app` or `https://bookcrk.com`
   - **Redirect URLs**: Add both URLs with `/auth/callback` appended

## Step 5: Verify Deployment

1. Visit your deployed app
2. Test user registration and login
3. Create a test synchronicity
4. Verify map and community features work

## Step 6: Add to Phone Home Screen

### iPhone (Safari)
1. Open your deployed URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Synchronicity Go"
5. Tap "Add"

### Android (Chrome)
1. Open your deployed URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Name it "Synchronicity Go"
5. Tap "Add"

Now the app works just like a native mobile app!

## Environment Variables Reference

Your `.env` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://vbkgivdhiskwbbtajbvs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These MUST be added to Vercel's environment variables for the app to work.

## Troubleshooting

### Build Fails
- Check that all environment variables are set in Vercel
- Verify your code builds locally with `npm run build`

### Authentication Not Working
- Verify Supabase URL configuration includes your production domain
- Check that environment variables in Vercel match your `.env` file

### Database Connection Issues
- Confirm Supabase credentials are correct
- Check Supabase dashboard for any service issues

## Continuous Deployment

Once connected to GitHub, Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request gets a preview URL

## Support

For issues or questions:
- Email: cpkotz@gmail.com
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

---

**Agency Astrology**
Synchronicity Go™
Jasper County, Missouri

# Deploy to syncgo.one

Your app is built and ready. Here's how to deploy it to your domain:

## Option 1: Vercel (Recommended - Best for Next.js)

1. Go to https://vercel.com and sign up/login
2. Click "Add New..." → "Project"
3. Import this repository (or upload the folder)
4. Vercel will auto-detect Next.js settings
5. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"
7. Once deployed, go to your project settings → Domains
8. Add `syncgo.one` and `www.syncgo.one`
9. Update your domain's DNS records (Vercel will show you exactly what to add)

## Option 2: Netlify

1. Go to https://netlify.com and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Upload this folder or connect your repo
4. Build settings are already configured in `netlify.toml`
5. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"
7. Go to Site settings → Domain management
8. Add `syncgo.one` as custom domain
9. Update your DNS records as shown by Netlify

## Your Environment Variables

Check your `.env` file for:
```
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

Copy these exact values when setting up environment variables in Vercel/Netlify.

## DNS Settings

For your domain `syncgo.one`, you'll need to add these records at your domain registrar:

**For Vercel:**
- Type: A, Name: @, Value: 76.76.21.21
- Type: CNAME, Name: www, Value: cname.vercel-dns.com

**For Netlify:**
- They'll provide you specific DNS records after you add the domain

## Build Already Complete

Your production build is ready in the `.next` folder. Both platforms will detect this automatically.

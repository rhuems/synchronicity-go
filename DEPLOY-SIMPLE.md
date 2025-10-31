# How to Put Your App Online

## Step 1: Install Netlify
Open your terminal and type:
```
npm install -g netlify-cli
```
Press Enter. Wait for it to finish.

## Step 2: Go to Your Project
Type:
```
cd /tmp/cc-agent/59478056/project
```
Press Enter.

## Step 3: Deploy
Type:
```
netlify deploy --prod
```
Press Enter.

## What Happens Next:
1. It will open your web browser
2. Click "Authorize" to let Netlify work
3. Come back to the terminal
4. It will ask: "Create & configure a new site"
5. Press Enter to say yes
6. It will ask for a team - just press Enter
7. It will ask for a site name - just press Enter (or type a name you want)
8. It will ask "What's your publish directory?" - type: `.next` and press Enter

## Done!
You'll see a URL like: `https://your-site-name.netlify.app`

That's your live website. Copy that link and open it in your browser.

## If It Doesn't Work:
The site needs your Supabase info. Go to:
1. https://app.netlify.com
2. Click on your site
3. Click "Site configuration" → "Environment variables"
4. Add these:
   - `NEXT_PUBLIC_SUPABASE_URL` = (your Supabase URL from .env file)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your Supabase key from .env file)
5. Click "Deploy" → "Trigger deploy" → "Deploy site"

Wait 1 minute and your site will work.

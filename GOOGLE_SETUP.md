# Google Sign-In Setup — 5 Minutes

## Step 1: Google Cloud Console
Open: https://console.cloud.google.com

## Step 2: Create Project
- Click "Select a project" (top bar) → "New Project"
- Name: WishStone → Create

## Step 3: OAuth Consent Screen
- Left menu → APIs & Services → OAuth consent screen
- User Type: External → Create
- App name: WishStone
- User support email: (your email)
- Developer contact email: (your email)
- Save and Continue → Save and Continue → Save and Continue → Back to Dashboard

## Step 4: Create Credentials
- Left menu → Credentials
- + CREATE CREDENTIALS → OAuth 2.0 Client ID
- Application type: Web application
- Name: WishStone
- Authorized JavaScript origins → + ADD URI → http://localhost:3000
- CREATE

## Step 5: Copy Client ID
A popup shows your Client ID like:
  382749123456-abcdefghijklmnop.apps.googleusercontent.com

## Step 6: Add to .env
Open: Wishstone-website/wishstone-frontend/.env
Replace the line with your actual Client ID:
  REACT_APP_GOOGLE_CLIENT_ID=382749123456-abcdefghijklmnop.apps.googleusercontent.com

## Step 7: Restart
Stop npm start and run it again.
Done! Google Sign-In will work.

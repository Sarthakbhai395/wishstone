# Cloudinary Setup for Image Uploads (Production)

## Problem
Render (and most PaaS platforms) have **ephemeral filesystems**. This means:
- Images uploaded to `uploads/` folder get deleted on every deploy/server restart
- Your product images disappear after deployment!

## Solution: Cloudinary (FREE)
Cloudinary stores images permanently in the cloud and serves them via CDN.

---

## Step 1: Create Cloudinary Account (FREE)

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a FREE account (no credit card required)
3. Verify your email

---

## Step 2: Get Your Credentials

1. In Cloudinary Dashboard, find **Account Details**:
   - **Cloud Name**: `xxxxxxxxx`
   - **API Key**: `123456789012345`
   - **API Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. Copy these 3 values

---

## Step 3: Add Environment Variables to Render

1. Go to your Render Dashboard → Select your backend service
2. Click **Environment** tab
3. Add these 3 variables:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Click **Save Changes**
5. Your service will redeploy automatically

---

## Step 4: Test Image Upload

1. Open your Admin Panel
2. Add a new product with images
3. Check the product on Shop/Product pages
4. Images should now show correctly!

---

## How It Works

```
Admin uploads image
        ↓
Backend receives image
        ↓
IF Cloudinary configured:  →  Upload to Cloudinary  →  Get permanent URL
ELSE:                      →  Save to local uploads  →  URL may break on redeploy
        ↓
Store URL in database
        ↓
Frontend displays from Cloudinary CDN (fast & reliable)
```

---

## Benefits of Cloudinary

- ✅ **Permanent storage** - Images never disappear
- ✅ **Global CDN** - Images load fast worldwide
- ✅ **Auto-optimization** - Images compressed automatically
- ✅ **Free tier** - 25GB storage + 25GB bandwidth/month
- ✅ **Backup** - Your images are safe even if server crashes

---

## Local Development

Without Cloudinary credentials, the system falls back to local file storage:
- Images saved to `uploads/images/` folder
- Works fine for local testing
- ⚠️ Won't persist on Render/Heroku deployments

---

## Troubleshooting

### Images still not showing?
1. Check Render Environment variables are set correctly
2. Redeploy the backend service
3. Check server logs for Cloudinary errors

### "Cloudinary is not configured" error?
- Environment variables missing or incorrect
- Double-check Cloud Name, API Key, and API Secret

### Upload fails?
- Check file size (max 10MB for images)
- Allowed formats: jpg, jpeg, png, webp, gif

---

## Need Help?

- Cloudinary Docs: https://cloudinary.com/documentation
- Or contact me for assistance

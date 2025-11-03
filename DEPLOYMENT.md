# Vercel Deployment Guide

Complete guide to deploy the Beer Expiry Alert System to Vercel.

---

## Prerequisites

- Node.js installed locally
- Vercel account (free account works)
- Excel file ready (`Bar_Inventory_Sample_125.xlsx`)

---

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

---

## Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to sign in with:
- GitHub
- GitLab
- Bitbucket
- Email

---

## Step 3: Deploy Project

From your project directory:

```bash
cd /home/paramhans/basicProject
vercel
```

**Follow the prompts:**
1. **Set up and deploy?** → Type `Y` (Yes)
2. **Which scope?** → Select your account
3. **Link to existing project?** → Type `N` (No)
4. **Project name?** → Press Enter (uses default) or type custom name
5. **Directory?** → Press Enter (uses `./`)
6. **Override settings?** → Type `N` (No)

**After deployment, you'll get:**
- Production URL: `https://your-project-name.vercel.app`
- Preview URL: (if applicable)

---

## Step 4: Configure Environment Variables

### Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add these variables:

```
Name: EMAIL_USER
Value: your-email@gmail.com
Environment: Production, Preview, Development (select all)

Name: EMAIL_PASS
Value: your-gmail-app-password
Environment: Production, Preview, Development (select all)

Name: BAR_MANAGER_EMAIL
Value: bar-manager@example.com
Environment: Production, Preview, Development (select all)
```

6. Click **Save** for each variable

### Via CLI (Alternative)

```bash
vercel env add EMAIL_USER
# Paste: your-email@gmail.com
# Select: Production, Preview, Development (all)

vercel env add EMAIL_PASS
# Paste: your-app-password

vercel env add BAR_MANAGER_EMAIL
# Paste: bar-manager@example.com
```

---

## Step 5: Redeploy

After adding environment variables, redeploy:

```bash
vercel --prod
```

This deploys to production with new environment variables.

---

## Step 6: Verify Deployment

### Test API Endpoints

**1. Get Expiring Beers:**
```bash
curl https://your-project.vercel.app/api/expiring-beers?days=5
```

**2. Check Expiry and Send Email:**
```bash
curl https://your-project.vercel.app/api/check-expiry
```

### Check Logs

```bash
vercel logs
```

Or in Vercel Dashboard:
- Go to your project
- Click **Functions** tab
- View logs for each function

---

## Excel File on Vercel

### Option 1: Include in Deployment (Recommended for small files)

1. Ensure `Bar_Inventory_Sample_125.xlsx` is in root directory
2. Commit to git (if using version control)
3. Deploy normally - file will be included

**File size limit:** ~50MB total deployment

### Option 2: Cloud Storage (For large files)

If your Excel file is large:

1. **Upload to cloud storage:**
   - AWS S3
   - Google Cloud Storage
   - Vercel Blob Storage (Pro)

2. **Update `utils/excelReader.js`** to fetch from storage:
   ```javascript
   // Example for AWS S3
   const AWS = require('aws-sdk');
   const s3 = new AWS.S3();
   
   async function readBeerInventoryFromS3() {
     const params = {
       Bucket: process.env.S3_BUCKET,
       Key: 'Bar_Inventory_Sample_125.xlsx'
     };
     const data = await s3.getObject(params).promise();
     const workbook = XLSX.read(data.Body);
     // ... rest of code
   }
   ```

---

## Automatic Daily Checks

### Option 1: External Cron Service (Free - Recommended)

**Using cron-job.org:**

1. Sign up: https://cron-job.org
2. Create cron job:
   - **Title**: Beer Expiry Check
   - **URL**: `https://your-project.vercel.app/api/check-expiry`
   - **Schedule**: Daily at 9:00 AM
   - **Method**: GET
3. Activate

**Other free services:**
- EasyCron
- Cronitor
- GitHub Actions (free)

### Option 2: Vercel Cron Jobs (Vercel Pro Required)

If you have Vercel Pro, update `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/check-expiry",
      "dest": "/api/check-expiry.js"
    },
    {
      "src": "/api/expiring-beers",
      "dest": "/api/expiring-beers.js"
    }
  ],
  "crons": [
    {
      "path": "/api/check-expiry",
      "schedule": "0 9 * * *"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

Then redeploy: `vercel --prod`

**Cron Schedule Examples:**
- Daily at 9 AM UTC: `0 9 * * *`
- Daily at 9:30 AM: `30 9 * * *`
- Every 6 hours: `0 */6 * * *`

---

## Troubleshooting

### Error: Environment variables not found

**Solution:**
1. Verify variables in Vercel Dashboard → Settings → Environment Variables
2. Ensure all environments selected (Production, Preview, Development)
3. Redeploy after adding: `vercel --prod`

### Error: Excel file not found

**Solution:**
1. Verify file is in root directory
2. Check file name matches exactly: `Bar_Inventory_Sample_125.xlsx`
3. Ensure file is committed to git (if using version control)
4. Check deployment logs in Vercel Dashboard

### Error: Email not sending

**Solution:**
1. Verify environment variables are set correctly
2. Check Vercel logs: `vercel logs`
3. Test locally first: `npm run cron`
4. Verify Gmail App Password is correct

### Error: Function timeout

**Solution:**
1. Vercel free tier has 10-second timeout
2. Optimize Excel file reading
3. Consider upgrading to Pro for longer timeouts

### API returns 404

**Solution:**
1. Verify `vercel.json` routes are correct
2. Check API files are in `api/` directory
3. Ensure deployment completed successfully
4. Check URL matches your project name

---

## Project URLs

After deployment, your endpoints are:

- **Production:** `https://your-project.vercel.app`
- **API Check Expiry:** `https://your-project.vercel.app/api/check-expiry`
- **API Expiring Beers:** `https://your-project.vercel.app/api/expiring-beers`

---

## Updating Deployment

### Redeploy after changes:

```bash
vercel --prod
```

### Update environment variables:

1. Edit in Vercel Dashboard
2. Redeploy: `vercel --prod`

### Update Excel file:

1. Replace file in root directory
2. Commit (if using git)
3. Redeploy: `vercel --prod`

---

## Quick Deployment Checklist

- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Project deployed
- [ ] Environment variables added
- [ ] Redeployed with env vars
- [ ] API endpoints tested
- [ ] Excel file included in deployment
- [ ] Automatic checking configured (optional)

---

## Need Help?

- Check Vercel Dashboard → Functions → Logs
- Run `vercel logs` in terminal
- Test locally first: `npm run cron`
- Verify all environment variables are set

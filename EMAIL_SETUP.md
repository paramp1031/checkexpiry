# Email Setup Guide

Complete guide to configure email alerts for the Beer Expiry Alert System.

## Quick Setup

1. **Create `.env` file** in the root directory
2. **Add email configuration** (see below)
3. **For Gmail**: Generate App Password (see Gmail Setup section)
4. **Test configuration**: Run `npm run cron`

---

## Environment Variables

Create a `.env` file in the root directory with:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BAR_MANAGER_EMAIL=bar-manager@example.com

# Optional SMTP Configuration (defaults to Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

---

## Gmail Setup

### Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Click on **"2-Step Verification"**
3. Follow the prompts to enable it
4. You'll need your phone for verification

### Step 2: Generate App Password

**After enabling 2-Step Verification:**

1. Go to: https://myaccount.google.com/apppasswords

   - Or: Google Account → Security → 2-Step Verification → App passwords

2. Select:

   - **App**: Choose "Mail" or "Other (Custom name)"
   - Type: `Beer Alert System`
   - **Device**: Choose "Other (Custom name)"
   - Type: `Server`

3. Click **"Generate"**

4. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

5. **Use this in your `.env` file:**
   ```env
   EMAIL_PASS=abcd efgh ijkl mnop
   ```
   _(Remove spaces or keep them - both work)_

### Step 3: Update .env File

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
BAR_MANAGER_EMAIL=recipient@example.com
```

### Important Notes

- ❌ **DO NOT** use your regular Gmail password
- ✅ **MUST** use App Password
- ✅ **MUST** have 2-Step Verification enabled
- ✅ App Password is 16 characters (with or without spaces)

---

## Other Email Providers

### Outlook/Hotmail

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
BAR_MANAGER_EMAIL=bar-manager@example.com
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Setup:**

1. Use your regular Outlook password (usually works)
2. If not, enable App Password: Microsoft Account → Security → Advanced security options → App passwords

### Yahoo

```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
BAR_MANAGER_EMAIL=bar-manager@example.com
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Setup:**

1. Enable "Less secure app access" or generate App Password
2. Yahoo Account → Security → Generate app password

### Custom SMTP Server

```env
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
BAR_MANAGER_EMAIL=bar-manager@example.com
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
```

---

## Testing Email Configuration

### Test the Setup

Run the cron service to test:

```bash
npm run cron
```

It will:

- Check for expiring beers
- Send test email if beers are found
- Show error messages if configuration is wrong

### Common Errors

#### Error: "Invalid login: Username and Password not accepted"

**Causes:**

- Using regular Gmail password instead of App Password
- 2-Step Verification not enabled
- App Password copied incorrectly
- Wrong email address

**Solutions:**

1. ✅ Enable 2-Step Verification
2. ✅ Generate new App Password
3. ✅ Copy password carefully (no extra spaces)
4. ✅ Verify EMAIL_USER is full email address

#### Error: "Connection timeout"

**Causes:**

- Wrong SMTP_HOST
- Firewall blocking port
- Network issues

**Solutions:**

1. ✅ Check SMTP_HOST is correct
2. ✅ Verify SMTP_PORT (587 for TLS, 465 for SSL)
3. ✅ Check internet connection

---

## Email Template

The system sends emails in this format:

**Subject:** ⚠️ Upcoming Beer Stock Expiry Alert — Action Required

**Content:**

- Header with alert message
- Table with expiring beer details:
  - Product Name
  - Brand
  - Volume (ml)
  - Batch No.
  - Stock Date
  - Expiry Date
  - Storage Location
- Action suggestions
- Footer

---

## Troubleshooting

### Email not sending

1. **Check environment variables:**

   ```bash
   # Verify .env file exists and has correct values
   cat .env
   ```

2. **Verify email credentials:**

   - Gmail: Use App Password (not regular password)
   - Other: Check SMTP settings

3. **Test connection:**
   ```bash
   npm run cron
   ```
   Check console output for errors

### App Password not found option

**If you can't find "App passwords" option:**

1. ✅ Enable 2-Step Verification first
2. ✅ Wait 5-10 minutes after enabling
3. ✅ Try direct link: https://myaccount.google.com/apppasswords
4. ✅ Check you're using personal Gmail (not Workspace)

### Still having issues?

1. **Verify all variables in .env:**

   - EMAIL_USER ✅
   - EMAIL_PASS ✅
   - BAR_MANAGER_EMAIL ✅

2. **Check .env file format:**

   - No quotes around values
   - No spaces around `=`
   - Each variable on new line

3. **Generate new App Password:**
   - Sometimes old passwords expire
   - Generate fresh one and update .env

---

## Security Notes

- ✅ **Never commit `.env` file to git**
- ✅ **Keep App Passwords secure**
- ✅ **Use different App Password for each project**
- ✅ **Rotate App Passwords regularly**

---

## Quick Reference

**Minimum .env configuration:**

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BAR_MANAGER_EMAIL=recipient@example.com
```

**For Gmail:**

1. Enable 2-Step Verification
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password (16 characters)

**Test:**

```bash
npm run cron
```

---

## Need Help?

- Check console output for specific error messages
- Verify all environment variables are set
- Ensure App Password is generated correctly
- Test with `npm run cron`

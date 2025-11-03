# GitHub Setup Guide

Complete guide to push your project to GitHub.

---

## Step 1: Initialize Git Repository

```bash
cd /home/paramhans/basicProject
git init
```

---

## Step 2: Add All Files

```bash
git add .
```

This will add all files except those in `.gitignore` (like `.env` and `node_modules/`).

---

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Beer Expiry Alert System"
```

---

## Step 4: Create GitHub Repository

### Option A: Via GitHub Website

1. Go to: https://github.com/new
2. **Repository name:** `beer-expiry-alert-system` (or your choice)
3. **Description:** `Automated beer inventory expiry alert system with email notifications`
4. **Visibility:** Choose Public or Private
5. **DON'T** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### Option B: Via GitHub CLI (if installed)

```bash
gh repo create beer-expiry-alert-system --public --source=. --remote=origin --push
```

---

## Step 5: Add Remote and Push

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/beer-expiry-alert-system.git

# Verify remote is added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username.**

---

## Alternative: If You Already Have a GitHub Repo

If you already created a repository on GitHub:

```bash
# Add remote (replace URL with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/beer-expiry-alert-system.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 6: Verify Push

1. Go to your GitHub repository
2. Check that all files are present
3. Verify `.env` file is **NOT** in the repository (it should be ignored)

---

## Important Notes

### ✅ Files That WILL Be Pushed:
- All source code (`api/`, `utils/`)
- Documentation (`.md` files)
- Configuration files (`package.json`, `vercel.json`)
- Excel file (`Bar_Inventory_Sample_125.xlsx`)
- `.gitignore`

### ❌ Files That Will NOT Be Pushed:
- `.env` (contains sensitive credentials)
- `node_modules/` (dependencies)
- Log files
- IDE settings

---

## Future Updates

When you make changes:

```bash
# Stage changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## Setting Up on a New Machine

If someone clones your repository:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/beer-expiry-alert-system.git
cd beer-expiry-alert-system

# Install dependencies
npm install

# Create .env file (copy from .env.example or create new)
# Add your email credentials

# Run
npm run cron
```

---

## Troubleshooting

### Error: "repository not found"

**Solution:**
- Check repository URL is correct
- Verify you have access to the repository
- Check if repository exists on GitHub

### Error: "permission denied"

**Solution:**
- Use Personal Access Token instead of password
- Generate token: GitHub → Settings → Developer settings → Personal access tokens
- Use token as password when pushing

### Error: "failed to push"

**Solution:**
- Pull first: `git pull origin main`
- Resolve conflicts if any
- Push again: `git push`

---

## Quick Command Summary

```bash
# Initialize
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace URL)
git remote add origin https://github.com/YOUR_USERNAME/beer-expiry-alert-system.git

# Push
git branch -M main
git push -u origin main
```

---

## GitHub Repository Settings

After pushing, configure these in GitHub:

1. **Repository Settings → Secrets**
   - Add environment variables if using GitHub Actions
   - Or document that users need to set up `.env` locally

2. **Add README badges** (optional)
   - Build status
   - License
   - Deployment status

3. **Add Topics/Tags**
   - `beer-inventory`
   - `expiry-alert`
   - `email-notifications`
   - `nodejs`
   - `vercel`

---

## Next Steps

After pushing to GitHub:

1. ✅ Share repository URL with others
2. ✅ Set up GitHub Actions (if needed)
3. ✅ Add project description and tags
4. ✅ Document how to contribute
5. ✅ Keep `.env` file local (never commit it!)

---

## Security Reminder

**⚠️ NEVER commit `.env` file to GitHub!**

The `.gitignore` file is configured to exclude `.env`. Always verify it's not in the repository:

```bash
git status
# .env should NOT appear in the list
```

If `.env` was accidentally committed:
```bash
git rm --cached .env
git commit -m "Remove .env file"
git push
```

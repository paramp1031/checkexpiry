# Beer Expiry Alert System

An automated Node.js system that reads beer inventory from an Excel file, checks for products expiring within 5 days, and sends email alerts to the bar manager.

## Features

- 📊 Automatically reads beer inventory from Excel file
- ⚠️ Checks for beers expiring within 5 days
- 📧 Sends formatted email alerts to bar manager
- ⏰ Automatic cron service (checks every 1 minute)
- 🌐 RESTful API endpoints for Vercel deployment
- ☁️ Deployed on Vercel

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BAR_MANAGER_EMAIL=bar-manager@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

**📖 Detailed email setup instructions:** See [EMAIL_SETUP.md](./EMAIL_SETUP.md)

### 3. Excel File Format

Ensure your Excel file (`Bar_Inventory_Sample_125.xlsx`) has the following columns:
- Product Name
- Brand
- Volume (ml)
- Batch No.
- Stock Date
- Expiry Date
- Storage Location

## API Endpoints

### 1. Check Expiry and Send Email
```
GET/POST /api/check-expiry
```
Checks for beers expiring within 5 days and sends email alert.

**Response:**
```json
{
  "success": true,
  "message": "Expiry check completed successfully",
  "emailSent": true,
  "beersCount": 2,
  "beers": [...],
  "emailDetails": {...}
}
```

### 2. Get Expiring Beers
```
GET /api/expiring-beers?days=5
```
Returns list of beers expiring within specified days (default: 5).

**Response:**
```json
{
  "success": true,
  "days": 5,
  "beersCount": 2,
  "beers": [...]
}
```

## Deployment on Vercel

**📖 Complete deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel Dashboard
# Then redeploy
vercel --prod
```

## Running Cron Service Locally

Start the automatic expiry checking service:

```bash
npm run cron
```

This will:
- Check for beers expiring within 5 days every 1 minute
- Automatically send email alerts when beers are found
- Log all activity to console

Press `Ctrl+C` to stop the service.

### Configure Check Interval

Edit `cron-service.js` to change the interval:
- Every 1 minute: `*/1 * * * *`
- Every 5 minutes: `*/5 * * * *`
- Every 30 minutes: `*/30 * * * *`
- Daily at 9 AM: `0 9 * * *`

## Testing

Test the cron service:
```bash
npm run cron
```

For Vercel deployment, test API endpoints:
```bash
# Check expiry and send email
curl https://your-project.vercel.app/api/check-expiry

# Get expiring beers
curl https://your-project.vercel.app/api/expiring-beers?days=5
```

## Project Structure

```
.
├── api/
│   ├── check-expiry.js      # API endpoint: Check expiry & send email
│   └── expiring-beers.js    # API endpoint: Get expiring beers
├── utils/
│   ├── excelReader.js       # Excel file reading logic
│   └── emailService.js      # Email sending logic
├── cron-service.js          # Automatic expiry checking service
├── Bar_Inventory_Sample_125.xlsx  # Beer inventory data
├── package.json
├── vercel.json              # Vercel configuration
└── README.md
```

## Troubleshooting

### Email not sending
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- For Gmail, use App Password (not regular password)
- Check SMTP settings

### Excel file not found
- Ensure Excel file is in root directory
- Check file name matches exactly: `Bar_Inventory_Sample_125.xlsx`
- For Vercel, ensure file is included in deployment

### Date parsing issues
- Ensure dates in Excel are in format: YYYY-MM-DD or standard Excel date format
- Check date column names match expected format

## License

ISC

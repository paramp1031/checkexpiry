require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const { getExpiringBeers } = require("./utils/excelReader");
const { sendExpiryAlert } = require("./utils/emailService");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const EXPIRY_DAYS = 5; // Check for beers expiring within 5 days

// Serve static files if needed
app.use(express.static("public"));

// Attractive homepage route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Stock Expiry Checker - Server Running</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 60px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 600px;
          width: 100%;
          animation: fadeIn 0.8s ease-in;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        h1 {
          color: #333;
          font-size: 2.5em;
          margin-bottom: 15px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .message {
          color: #666;
          font-size: 1.2em;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        
        .status {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1.1em;
          margin-top: 20px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .status-dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: #4ade80;
          border-radius: 50%;
          margin-right: 8px;
          animation: blink 2s ease-in-out infinite;
        }
        
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          color: #999;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📦</div>
        <h1>Stock Expiry Checker</h1>
        <p class="message">
          Your server is running and ready to check the expiry of your stocks!
        </p>
        <div class="status">
          <span class="status-dot"></span>
          Server is Active
        </div>
        <div class="footer">
          Monitoring stock expiry status in real-time
        </div>
      </div>
    </body>
    </html>
  `);
});

// Cron job function - checks for expiring stocks
async function performExpiryCheck() {
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "short",
    timeStyle: "medium",
  });

  console.log(
    `[${timestamp}] Checking for stocks expiring within ${EXPIRY_DAYS} days...`
  );

  try {
    const expiringBeers = getExpiringBeers(EXPIRY_DAYS);

    if (expiringBeers.length === 0) {
      console.log(
        `[${timestamp}] No stocks expiring within ${EXPIRY_DAYS} days`
      );
      return;
    }

    console.log(
      `[${timestamp}] Found ${expiringBeers.length} stock(s) expiring soon`
    );

    // Send email alert
    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.BAR_MANAGER_EMAIL
    ) {
      try {
        console.log(`[${timestamp}] Sending email alert...`);
        await sendExpiryAlert(expiringBeers);
        console.log(
          `[${timestamp}] Email sent successfully to ${process.env.BAR_MANAGER_EMAIL}`
        );
      } catch (emailError) {
        console.error(
          `[${timestamp}] Error sending email: ${emailError.message}`
        );
      }
    } else {
      console.log(`[${timestamp}] Email not configured. Skipping email alert.`);
    }
  } catch (error) {
    console.error(`[${timestamp}] Error during expiry check: ${error.message}`);
  }
}

// Start cron job - runs every minute
console.log("Starting cron service...");
// cron.schedule(
//   "* * * * *",
//   () => {
//     performExpiryCheck();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );
cron.schedule(
  "*/10 * * * *",
  () => {
    performExpiryCheck();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
// Perform initial check immediately
performExpiryCheck();

// Start server
app.listen(PORT, () => {
  console.log("Server is running for checking expiry of your stocks");
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log("Cron service is running - checking every minute");
});

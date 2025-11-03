/**
 * Cron Service - Automatically checks beer expiry every 1 minute
 * Run: node cron-service.js
 * 
 * This service runs continuously and checks for expiring beers every minute.
 * It directly calls the functions (not HTTP API) for better performance.
 */

require('dotenv').config();
const cron = require('node-cron');
const { getExpiringBeers } = require('./utils/excelReader');
const { sendExpiryAlert } = require('./utils/emailService');

// Configuration
const CHECK_INTERVAL_MINUTES = 1; // Check every 1 minute
const EXPIRY_DAYS = 5; // Check for beers expiring within 5 days

/**
 * Performs expiry check and sends email if needed
 */
async function performExpiryCheck() {
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', { 
    timeZone: 'Asia/Kolkata',
    dateStyle: 'short',
    timeStyle: 'medium'
  });

  console.log(`\n[${timestamp}] 🔍 Checking for beers expiring within ${EXPIRY_DAYS} days...`);

  try {
    // Get expiring beers
    const expiringBeers = getExpiringBeers(EXPIRY_DAYS);

    if (expiringBeers.length === 0) {
      console.log(`   ✅ No beers expiring within ${EXPIRY_DAYS} days`);
      return;
    }

    console.log(`   ⚠️  Found ${expiringBeers.length} beer(s) expiring soon:`);
    expiringBeers.forEach((beer, index) => {
      console.log(`      ${index + 1}. ${beer.productName || 'N/A'} (Expires: ${beer.expiryDate || 'N/A'})`);
    });

    // Send email alert
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.BAR_MANAGER_EMAIL) {
      console.log(`   📧 Sending email alert...`);
      
      try {
        const emailResult = await sendExpiryAlert(expiringBeers);
        
        if (emailResult.success) {
          console.log(`   ✅ Email sent successfully!`);
          console.log(`      Message ID: ${emailResult.messageId}`);
          console.log(`      Sent to: ${process.env.BAR_MANAGER_EMAIL}`);
        } else {
          console.log(`   ⚠️  Email result: ${emailResult.message}`);
        }
      } catch (emailError) {
        console.error(`   ❌ Error sending email: ${emailError.message}`);
      }
    } else {
      console.log(`   ⚠️  Email not configured. Skipping email alert.`);
      console.log(`      Set EMAIL_USER, EMAIL_PASS, and BAR_MANAGER_EMAIL in .env file`);
    }

  } catch (error) {
    console.error(`   ❌ Error during expiry check: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
  }
}

// Main execution
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     Beer Expiry Alert System - Cron Service              ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');
console.log(`📋 Configuration:`);
console.log(`   • Check interval: Every ${CHECK_INTERVAL_MINUTES} minute(s)`);
console.log(`   • Expiry threshold: ${EXPIRY_DAYS} days`);
console.log(`   • Email configured: ${process.env.EMAIL_USER ? '✅ Yes' : '❌ No'}`);
console.log(`   • Bar Manager: ${process.env.BAR_MANAGER_EMAIL || 'Not configured'}`);
console.log('');
console.log('🚀 Starting cron service...');
console.log('   Press Ctrl+C to stop');
console.log('');

// Schedule the task to run every 1 minute
// Cron format: '*/1 * * * *' means every minute
// Format: second minute hour day month day-of-week
cron.schedule('*/1 * * * *', () => {
  performExpiryCheck();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

// Perform initial check immediately
console.log('⏰ Performing initial check...');
performExpiryCheck();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n');
  console.log('🛑 Stopping cron service...');
  console.log('✅ Cron service stopped gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n');
  console.log('🛑 Stopping cron service...');
  console.log('✅ Cron service stopped gracefully');
  process.exit(0);
});

// Keep the process alive
console.log('✅ Cron service is running. Waiting for scheduled checks...');
console.log('');

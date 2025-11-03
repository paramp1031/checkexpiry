// Load environment variables
require("dotenv").config();

const { getExpiringBeers } = require("../utils/excelReader");
const { sendExpiryAlert } = require("../utils/emailService");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const timestamp = new Date().toISOString();
  const clientIP =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  console.log(`[${timestamp}] 🔍 Check Expiry API called from ${clientIP}`);
  console.log(`[${timestamp}] 📋 Starting expiry check...`);

  try {
    // Get expiring beers (within 5 days)
    const expiringBeers = getExpiringBeers(5);

    console.log(
      `[${timestamp}] 📊 Found ${expiringBeers.length} beer(s) expiring within 5 days`
    );

    if (expiringBeers.length === 0) {
      console.log(
        `[${timestamp}] ✅ No expiring beers found - no action needed`
      );
      return res.status(200).json({
        success: true,
        message: "No beers expiring within 5 days",
        beersCount: 0,
        beers: [],
      });
    }

    // Send email alert
    console.log(
      `[${timestamp}] 📧 Sending email alert for ${expiringBeers.length} beer(s)...`
    );
    const emailResult = await sendExpiryAlert(expiringBeers);

    if (emailResult.success) {
      console.log(
        `[${timestamp}] ✅ Email sent successfully to ${
          process.env.BAR_MANAGER_EMAIL || "bar manager"
        }`
      );
      console.log(`[${timestamp}] 📨 Email ID: ${emailResult.messageId}`);
    } else {
      console.log(
        `[${timestamp}] ⚠️  Email sending failed: ${emailResult.message}`
      );
    }

    console.log(`[${timestamp}] ✅ Expiry check completed successfully`);

    res.status(200).json({
      success: true,
      message: "Expiry check completed successfully",
      emailSent: emailResult.success,
      beersCount: expiringBeers.length,
      beers: expiringBeers,
      emailDetails: emailResult,
    });
  } catch (error) {
    console.error(`[${timestamp}] ❌ Error in check-expiry:`, error.message);
    console.error(`[${timestamp}] 📍 Stack trace:`, error.stack);
    res.status(500).json({
      success: false,
      message: "Error checking expiry dates",
      error: error.message,
    });
  }
};

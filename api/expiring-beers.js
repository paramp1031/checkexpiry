// Load environment variables
require("dotenv").config();

const { getExpiringBeers } = require("../utils/excelReader");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const timestamp = new Date().toISOString();
  const clientIP =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Get days parameter from query (default: 5)
    const days = parseInt(req.query.days || "5", 10);

    console.log(`[${timestamp}] 📋 Expiring Beers API called from ${clientIP}`);
    console.log(
      `[${timestamp}] 🔍 Checking for beers expiring within ${days} days...`
    );

    // Get expiring beers
    const expiringBeers = getExpiringBeers(days);

    console.log(
      `[${timestamp}] 📊 Found ${expiringBeers.length} beer(s) expiring within ${days} days`
    );

    console.log(`[${timestamp}] ✅ Request completed successfully`);

    res.status(200).json({
      success: true,
      days: days,
      beersCount: expiringBeers.length,
      beers: expiringBeers,
    });
  } catch (error) {
    console.error(
      `[${timestamp}] ❌ Error fetching expiring beers:`,
      error.message
    );
    console.error(`[${timestamp}] 📍 Stack trace:`, error.stack);
    res.status(500).json({
      success: false,
      message: "Error fetching expiring beers",
      error: error.message,
    });
  }
};

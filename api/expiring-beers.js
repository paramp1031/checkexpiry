// Load environment variables
require("dotenv").config();

const { getExpiringBeers } = require("../utils/excelReader");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Get days parameter from query (default: 5)
    const days = parseInt(req.query.days || "5", 10);

    // Get expiring beers
    const expiringBeers = getExpiringBeers(days);

    res.status(200).json({
      success: true,
      days: days,
      beersCount: expiringBeers.length,
      beers: expiringBeers,
    });
  } catch (error) {
    console.error("Error fetching expiring beers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching expiring beers",
      error: error.message,
    });
  }
};

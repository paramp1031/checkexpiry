// Load environment variables
require('dotenv').config();

const { getExpiringBeers } = require('../utils/excelReader');
const { sendExpiryAlert } = require('../utils/emailService');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get expiring beers (within 5 days)
    const expiringBeers = getExpiringBeers(5);

    if (expiringBeers.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No beers expiring within 5 days',
        beersCount: 0,
        beers: []
      });
    }

    // Send email alert
    const emailResult = await sendExpiryAlert(expiringBeers);

    res.status(200).json({
      success: true,
      message: 'Expiry check completed successfully',
      emailSent: emailResult.success,
      beersCount: expiringBeers.length,
      beers: expiringBeers,
      emailDetails: emailResult
    });
  } catch (error) {
    console.error('Error in check-expiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking expiry dates',
      error: error.message
    });
  }
};

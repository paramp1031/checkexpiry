const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Creates and configures the email transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // App password for Gmail
    }
  });
}

/**
 * Generates HTML email content for expiring beers
 * @param {Array} expiringBeers - Array of beer objects expiring soon
 * @returns {string} HTML email content
 */
function generateEmailHTML(expiringBeers) {
  const tableRows = expiringBeers.map(beer => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${beer.productName || '-'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${beer.brand || '-'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${beer.volume || '-'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${beer.batchNo || '-'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${beer.stockDate || '-'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${beer.expiryDate || '-'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${beer.storageLocation || '-'}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background-color: #f2f2f2; font-weight: bold; border: 1px solid #ddd; padding: 8px; text-align: left; }
    td { border: 1px solid #ddd; padding: 8px; }
    .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h2>⚠️ Upcoming Beer Stock Expiry Alert — Action Required</h2>
    <p>Hi Bar Manager,</p>
    <p>This is an automated reminder that the following beer stock(s) in your inventory are approaching expiry within 5 days.</p>
    <p>Please review the details below and take appropriate action (e.g., priority sale, removal, or replacement).</p>
    
    <h3>📦 Stock Details</h3>
    <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Brand</th>
          <th>Volume (ml)</th>
          <th>Batch No.</th>
          <th>Stock Date</th>
          <th>Expiry Date</th>
          <th>Storage Location</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <div class="alert">
      <strong>🕒 Suggested Action</strong><br>
      Move these products to the front shelf for quicker sale
    </div>
    
    <p>Regards,<br>
    <strong>Inventory Monitoring System</strong></p>
  </div>
</body>
</html>
  `;
}

/**
 * Generates plain text email content for expiring beers
 * @param {Array} expiringBeers - Array of beer objects expiring soon
 * @returns {string} Plain text email content
 */
function generateEmailText(expiringBeers) {
  let text = `⚠️ Upcoming Beer Stock Expiry Alert — Action Required\n\n`;
  text += `Hi Bar Manager,\n\n`;
  text += `This is an automated reminder that the following beer stock(s) in your inventory are approaching expiry within 5 days.\n`;
  text += `Please review the details below and take appropriate action (e.g., priority sale, removal, or replacement).\n\n`;
  text += `📦 Stock Details\n\n`;
  text += `Product Name\tBrand\tVolume (ml)\tBatch No.\tStock Date\tExpiry Date\tStorage Location\n`;
  
  expiringBeers.forEach(beer => {
    text += `${beer.productName || '-'}\t${beer.brand || '-'}\t${beer.volume || '-'}\t${beer.batchNo || '-'}\t${beer.stockDate || '-'}\t${beer.expiryDate || '-'}\t${beer.storageLocation || '-'}\n`;
  });
  
  text += `\n🕒 Suggested Action\n`;
  text += `Move these products to the front shelf for quicker sale\n\n`;
  text += `Regards,\n`;
  text += `Inventory Monitoring System\n`;
  
  return text;
}

/**
 * Sends email alert for expiring beers
 * @param {Array} expiringBeers - Array of beer objects expiring soon
 * @returns {Promise} Promise that resolves when email is sent
 */
async function sendExpiryAlert(expiringBeers) {
  if (!expiringBeers || expiringBeers.length === 0) {
    return {
      success: false,
      message: 'No beers expiring within 5 days'
    };
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in environment variables.');
  }

  if (!process.env.BAR_MANAGER_EMAIL) {
    throw new Error('Bar manager email not configured. Please set BAR_MANAGER_EMAIL in environment variables.');
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Inventory Monitoring System" <${process.env.EMAIL_USER}>`,
    to: process.env.BAR_MANAGER_EMAIL,
    subject: '⚠️ Upcoming Beer Stock Expiry Alert — Action Required',
    text: generateEmailText(expiringBeers),
    html: generateEmailHTML(expiringBeers)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      beersCount: expiringBeers.length
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
}

module.exports = {
  sendExpiryAlert,
  generateEmailHTML,
  generateEmailText
};

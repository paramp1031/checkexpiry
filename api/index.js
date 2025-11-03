// Load environment variables
require('dotenv').config();

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'text/html');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log request
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🌐 Homepage request from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);

  // HTML page with project description
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beer Expiry Alert System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            padding: 40px;
            margin-top: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }
        .header h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 1.2em;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #764ba2;
            font-size: 1.8em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section ul {
            list-style: none;
            padding-left: 0;
        }
        .section li {
            padding: 10px 0;
            padding-left: 30px;
            position: relative;
        }
        .section li:before {
            content: "✅";
            position: absolute;
            left: 0;
        }
        .endpoints {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .endpoint {
            background: white;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        .endpoint code {
            background: #667eea;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        .badge {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            margin: 5px 5px 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
        }
        .status {
            display: inline-block;
            padding: 8px 16px;
            background: #10b981;
            color: white;
            border-radius: 20px;
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍺 Beer Expiry Alert System</h1>
            <p>Automated Inventory Monitoring with Email Notifications</p>
            <div class="status">🟢 System Online</div>
        </div>

        <div class="section">
            <h2>📋 About This Project</h2>
            <p>
                An automated Node.js system that monitors beer inventory from Excel files, 
                detects products expiring within 5 days, and sends formatted email alerts 
                to bar managers. Perfect for bars, restaurants, and inventory management systems 
                that need automated expiry monitoring.
            </p>
        </div>

        <div class="section">
            <h2>✨ Features</h2>
            <ul>
                <li>Automatic Excel file reading and parsing</li>
                <li>Smart expiry detection (configurable days threshold)</li>
                <li>Automated email alerts with formatted HTML templates</li>
                <li>Cron service for automatic checking (configurable intervals)</li>
                <li>RESTful API endpoints for serverless deployment</li>
                <li>Vercel serverless function support</li>
                <li>Multiple email provider support (Gmail, Outlook, Yahoo, Custom SMTP)</li>
                <li>Real-time console logging and monitoring</li>
            </ul>
        </div>

        <div class="section">
            <h2>🔧 Tech Stack</h2>
            <div>
                <span class="badge">Node.js</span>
                <span class="badge">Excel.js (xlsx)</span>
                <span class="badge">Nodemailer</span>
                <span class="badge">Node-cron</span>
                <span class="badge">Vercel</span>
                <span class="badge">Serverless</span>
            </div>
        </div>

        <div class="section">
            <h2>🌐 API Endpoints</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <strong>GET/POST</strong> <code>/api/check-expiry</code>
                    <p>Checks for beers expiring within 5 days and sends email alert</p>
                </div>
                <div class="endpoint">
                    <strong>GET</strong> <code>/api/expiring-beers?days=5</code>
                    <p>Returns list of beers expiring within specified days (default: 5)</p>
                </div>
                <div class="endpoint">
                    <strong>GET</strong> <code>/</code>
                    <p>Shows project information page (this page)</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>📊 System Status</h2>
            <p><strong>Status:</strong> <span class="status">🟢 Operational</span></p>
            <p><strong>Last Check:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Server Time:</strong> ${new Date().toISOString()}</p>
        </div>

        <div class="footer">
            <p><strong>Beer Expiry Alert System</strong></p>
            <p>Built with ❤️ using Node.js and deployed on Vercel</p>
        </div>
    </div>
</body>
</html>
  `;

  res.status(200).send(html);
};

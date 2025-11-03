/**
 * Local Development Server
 * Run: npm run dev or npm start
 * Access: http://localhost:3000
 */

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Import API handlers
const checkExpiry = require("./api/check-expiry");
const expiringBeers = require("./api/expiring-beers");
const indexPage = require("./api/index");

// Routes
app.get("/", async (req, res) => {
  console.log(
    `[${new Date().toISOString()}] 🌐 Homepage request from ${req.ip}`
  );
  await indexPage(req, res);
});

app.get("/api/check-expiry", async (req, res) => {
  await checkExpiry(req, res);
});

app.post("/api/check-expiry", async (req, res) => {
  await checkExpiry(req, res);
});

app.get("/api/expiring-beers", async (req, res) => {
  await expiringBeers(req, res);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ❌ Server Error:`, err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║     Beer Expiry Alert System - Local Server              ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log("");
  console.log("📍 Available endpoints:");
  console.log(`   • Homepage:        http://localhost:${PORT}/`);
  console.log(
    `   • Check Expiry:     http://localhost:${PORT}/api/check-expiry`
  );
  console.log(
    `   • Expiring Beers:  http://localhost:${PORT}/api/expiring-beers?days=5`
  );
  console.log("");
  console.log("✅ Press Ctrl+C to stop");
  console.log("");
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down server...");
  process.exit(0);
});

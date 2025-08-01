const express = require("express");
const cors = require("cors");
const path = require("path");

// Import configuration
const { config, validateConfig } = require("./src/config");

// Import database and routes
const { initDatabase } = require("./src/models");
const adminRoutes = require("./src/routes/admin");
const projectRoutes = require("./src/routes/projects");
const skillRoutes = require("./src/routes/skills");
const experienceRoutes = require("./src/routes/experience");
const uploadRoutes = require("./src/routes/upload");
const contactRoutes = require("./src/routes/contact");

const app = express();

// Validate configuration
validateConfig();

// Initialize database
initDatabase();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Portfolio API is running!" });
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/profile", require("./src/routes/profile"));
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server with automatic port finding
const { startServerWithPortFinding } = require("./src/utils/port");

const startServer = async () => {
  try {
    const { server, port } = await startServerWithPortFinding(
      app,
      config.server.port,
      () => {
        console.log(`🚀 Server is running on port ${port}`);
        console.log(`🌍 Environment: ${config.server.env}`);
        console.log(
          `📡 API available at: http://${config.server.host}:${port}${config.api.prefix}`
        );
      }
    );

    // Handle server errors
    server.on("error", (error) => {
      console.error(`❌ Server error:`, error);
      process.exit(1);
    });

    return server;
  } catch (error) {
    console.error(`❌ Failed to start server:`, error.message);
    process.exit(1);
  }
};

// Start the server
let serverInstance;

startServer().then((server) => {
  serverInstance = server;
  console.log("✅ Server initialization completed");
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`🔄 ${signal} received, shutting down gracefully`);

  if (serverInstance) {
    serverInstance.close(() => {
      console.log("🔌 Server closed");
      process.exit(0);
    });
  } else {
    console.log("🔌 No server instance to close");
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

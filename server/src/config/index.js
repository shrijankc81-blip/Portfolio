require("dotenv").config();

const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT) || 5000,
    env: process.env.NODE_ENV || "development",
    host: process.env.HOST || "localhost",
  },

  // Database Configuration
  database: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: process.env.DB_SSL === "true",
    testDatabase: process.env.DB_NAME_TEST,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    algorithm: "HS256",
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:5174",
        ],
    credentials: true,
    optionsSuccessStatus: 200,
  },

  // Security Configuration
  security: {
    bcryptRounds: 10,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100, // limit each IP to 100 requests per windowMs
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    uploadDir: "uploads/",
  },

  // Email Configuration (if needed)
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || "noreply@portfolio.com",
  },

  // API Configuration
  api: {
    prefix: "/api",
    version: "v1",
    timeout: 30000, // 30 seconds
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
    file: process.env.LOG_FILE || "logs/app.log",
  },

  // Cache Configuration
  cache: {
    ttl: process.env.CACHE_TTL || 3600, // 1 hour
    checkPeriod: process.env.CACHE_CHECK_PERIOD || 600, // 10 minutes
  },

  // Pagination Configuration
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};

// Validation function
const validateConfig = () => {
  const required = [
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "DB_HOST",
    "JWT_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate JWT secret length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }

  console.log("✅ Configuration validation passed");
};

// Get configuration for specific environment
const getConfig = (env = process.env.NODE_ENV) => {
  return {
    ...config,
    isDevelopment: env === "development",
    isProduction: env === "production",
    isTest: env === "test",
  };
};

module.exports = {
  config,
  validateConfig,
  getConfig,
};

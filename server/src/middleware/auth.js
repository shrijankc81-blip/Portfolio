const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const { config } = require("../config");

// Generate JWT token
const generateToken = (adminId) => {
  return jwt.sign({ adminId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    algorithm: config.jwt.algorithm,
  });
};

// Verify JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const admin = await Admin.findByPk(decoded.adminId, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  generateToken,
  authenticateToken,
};

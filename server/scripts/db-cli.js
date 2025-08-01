#!/usr/bin/env node

const { program } = require("commander");
require("dotenv").config();

// Import database functions
const { sequelize, testConnection, closeConnection } = require("../src/config/database");
const { runMigrations, rollbackLastMigration } = require("../src/config/migrations");
const { runSeeders, clearAllData } = require("../src/config/seeders");
const { initDatabase } = require("../src/models");

// CLI Commands
program
  .name("db-cli")
  .description("Database management CLI for Portfolio API")
  .version("1.0.0");

// Test database connection
program
  .command("test")
  .description("Test database connection")
  .action(async () => {
    console.log("🔍 Testing database connection...");
    const isConnected = await testConnection();
    if (isConnected) {
      console.log("✅ Database connection successful");
    } else {
      console.log("❌ Database connection failed");
      process.exit(1);
    }
    await closeConnection();
  });

// Initialize database
program
  .command("init")
  .description("Initialize database with tables and default data")
  .action(async () => {
    console.log("🚀 Initializing database...");
    try {
      await initDatabase();
      console.log("✅ Database initialization completed");
    } catch (error) {
      console.error("❌ Database initialization failed:", error.message);
      process.exit(1);
    }
    await closeConnection();
  });

// Run migrations
program
  .command("migrate")
  .description("Run database migrations")
  .action(async () => {
    console.log("🔄 Running migrations...");
    try {
      await testConnection();
      await runMigrations();
      console.log("✅ Migrations completed");
    } catch (error) {
      console.error("❌ Migration failed:", error.message);
      process.exit(1);
    }
    await closeConnection();
  });

// Rollback last migration
program
  .command("rollback")
  .description("Rollback the last migration")
  .action(async () => {
    console.log("🔄 Rolling back last migration...");
    try {
      await testConnection();
      await rollbackLastMigration();
      console.log("✅ Rollback completed");
    } catch (error) {
      console.error("❌ Rollback failed:", error.message);
      process.exit(1);
    }
    await closeConnection();
  });

// Seed database
program
  .command("seed")
  .description("Seed database with sample data")
  .action(async () => {
    console.log("🌱 Seeding database...");
    try {
      await testConnection();
      await runSeeders();
      console.log("✅ Database seeding completed");
    } catch (error) {
      console.error("❌ Database seeding failed:", error.message);
      process.exit(1);
    }
    await closeConnection();
  });

// Reset database
program
  .command("reset")
  .description("Reset database (clear all data and reseed)")
  .option("-f, --force", "Force reset without confirmation")
  .action(async (options) => {
    if (!options.force) {
      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise((resolve) => {
        rl.question("⚠️  This will delete all data. Are you sure? (y/N): ", resolve);
      });

      rl.close();

      if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
        console.log("❌ Reset cancelled");
        return;
      }
    }

    console.log("🗑️ Resetting database...");
    try {
      await testConnection();
      await clearAllData();
      await runSeeders();
      console.log("✅ Database reset completed");
    } catch (error) {
      console.error("❌ Database reset failed:", error.message);
      process.exit(1);
    }
    await closeConnection();
  });

// Drop all tables
program
  .command("drop")
  .description("Drop all database tables")
  .option("-f, --force", "Force drop without confirmation")
  .action(async (options) => {
    if (!options.force) {
      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise((resolve) => {
        rl.question("⚠️  This will drop all tables. Are you sure? (y/N): ", resolve);
      });

      rl.close();

      if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
        console.log("❌ Drop cancelled");
        return;
      }
    }

    console.log("🗑️ Dropping all tables...");
    try {
      await testConnection();
      await sequelize.drop();
      console.log("✅ All tables dropped");
    } catch (error) {
      console.error("❌ Drop tables failed:", error.message);
      process.exit(1);
    }
    await closeConnection();
  });

// Show database status
program
  .command("status")
  .description("Show database status and table information")
  .action(async () => {
    console.log("📊 Database Status");
    console.log("==================");
    
    try {
      const isConnected = await testConnection();
      if (!isConnected) {
        console.log("❌ Database connection failed");
        return;
      }

      // Get table information
      const tables = await sequelize.getQueryInterface().showAllTables();
      console.log(`📋 Tables: ${tables.length}`);
      
      for (const table of tables) {
        try {
          const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${table}"`);
          console.log(`  - ${table}: ${results[0].count} records`);
        } catch (error) {
          console.log(`  - ${table}: Error getting count`);
        }
      }

      console.log(`\n🗄️  Database: ${process.env.DB_NAME}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT || 5432}`);
      
    } catch (error) {
      console.error("❌ Error getting database status:", error.message);
    }
    
    await closeConnection();
  });

// Parse command line arguments
program.parse();

// Handle no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

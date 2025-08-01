const { sequelize } = require("./database");
const { QueryInterface } = require("sequelize");

// Migration helper functions
const createMigrationTable = async () => {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    await queryInterface.createTable("Migrations", {
      id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      executed_at: {
        type: sequelize.Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.NOW,
      },
    });
    console.log("📋 Migration table created");
  } catch (error) {
    // Table might already exist
    if (!error.message.includes("already exists")) {
      console.error("Error creating migration table:", error);
    }
  }
};

// Check if migration has been executed
const isMigrationExecuted = async (migrationName) => {
  try {
    const [results] = await sequelize.query(
      "SELECT * FROM \"Migrations\" WHERE name = ?",
      {
        replacements: [migrationName],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return results.length > 0;
  } catch (error) {
    return false;
  }
};

// Mark migration as executed
const markMigrationExecuted = async (migrationName) => {
  try {
    await sequelize.query(
      "INSERT INTO \"Migrations\" (name, executed_at) VALUES (?, NOW())",
      {
        replacements: [migrationName],
        type: sequelize.QueryTypes.INSERT,
      }
    );
    console.log(`✅ Migration '${migrationName}' marked as executed`);
  } catch (error) {
    console.error(`Error marking migration '${migrationName}' as executed:`, error);
  }
};

// Sample migrations
const migrations = [
  {
    name: "001_create_initial_tables",
    up: async () => {
      const queryInterface = sequelize.getQueryInterface();
      
      // This migration is handled by Sequelize sync
      // Just mark it as executed if tables exist
      console.log("📊 Initial tables migration (handled by Sequelize sync)");
    },
  },
  {
    name: "002_add_project_indexes",
    up: async () => {
      const queryInterface = sequelize.getQueryInterface();
      
      try {
        // Add indexes for better performance
        await queryInterface.addIndex("Projects", ["featured"], {
          name: "idx_projects_featured",
        });
        
        await queryInterface.addIndex("Projects", ["order"], {
          name: "idx_projects_order",
        });
        
        console.log("📈 Added indexes to Projects table");
      } catch (error) {
        if (!error.message.includes("already exists")) {
          throw error;
        }
      }
    },
  },
  {
    name: "003_add_skill_indexes",
    up: async () => {
      const queryInterface = sequelize.getQueryInterface();
      
      try {
        // Add indexes for skills
        await queryInterface.addIndex("Skills", ["category"], {
          name: "idx_skills_category",
        });
        
        await queryInterface.addIndex("Skills", ["level"], {
          name: "idx_skills_level",
        });
        
        console.log("📈 Added indexes to Skills table");
      } catch (error) {
        if (!error.message.includes("already exists")) {
          throw error;
        }
      }
    },
  },
  {
    name: "004_add_experience_indexes",
    up: async () => {
      const queryInterface = sequelize.getQueryInterface();
      
      try {
        // Add indexes for experience
        await queryInterface.addIndex("Experiences", ["type"], {
          name: "idx_experiences_type",
        });
        
        await queryInterface.addIndex("Experiences", ["current"], {
          name: "idx_experiences_current",
        });
        
        await queryInterface.addIndex("Experiences", ["startDate"], {
          name: "idx_experiences_start_date",
        });
        
        console.log("📈 Added indexes to Experiences table");
      } catch (error) {
        if (!error.message.includes("already exists")) {
          throw error;
        }
      }
    },
  },
];

// Run all pending migrations
const runMigrations = async () => {
  try {
    await createMigrationTable();
    
    for (const migration of migrations) {
      const isExecuted = await isMigrationExecuted(migration.name);
      
      if (!isExecuted) {
        console.log(`🔄 Running migration: ${migration.name}`);
        await migration.up();
        await markMigrationExecuted(migration.name);
      } else {
        console.log(`⏭️  Migration '${migration.name}' already executed`);
      }
    }
    
    console.log("✅ All migrations completed");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Rollback last migration (for development)
const rollbackLastMigration = async () => {
  try {
    const [lastMigration] = await sequelize.query(
      "SELECT * FROM \"Migrations\" ORDER BY executed_at DESC LIMIT 1",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    if (lastMigration) {
      await sequelize.query(
        "DELETE FROM \"Migrations\" WHERE name = ?",
        {
          replacements: [lastMigration.name],
          type: sequelize.QueryTypes.DELETE,
        }
      );
      console.log(`🔄 Rolled back migration: ${lastMigration.name}`);
    } else {
      console.log("No migrations to rollback");
    }
  } catch (error) {
    console.error("Error rolling back migration:", error);
  }
};

module.exports = {
  runMigrations,
  rollbackLastMigration,
  migrations,
};

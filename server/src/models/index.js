const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Project Model
const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    technologies: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    liveUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Admin User Model
const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Skills Model
const Skill = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Experience Model
const Experience = sequelize.define(
  "Experience",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("work", "education"),
      allowNull: false,
      defaultValue: "work",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Profile Model
const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Personal Information
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Nirvan Maharjan",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Full Stack Developer",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Contact Information
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "maharjannirvan01@gmail.com",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Kathmandu, Nepal",
    },
    // Social Links
    github: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Professional Information
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    currentPosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // About Section Content
    aboutTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Get to know me!",
    },
    aboutDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Hero Section Content
    heroSubtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heroDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Resume/CV
    resumeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Availability
    isAvailableForWork: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Meta Information
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

// Initialize database
const initDatabase = async () => {
  try {
    const { testConnection } = require("../config/database");

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Database connection failed");
    }

    // Sync database models
    await sequelize.sync({ force: false });
    console.log("📊 Database synchronized successfully");

    // Run migrations
    const { runMigrations } = require("../config/migrations");
    await runMigrations();

    // Create default admin user if none exists
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await Admin.create({
        username: "admin",
        email: "admin@portfolio.com",
        password: hashedPassword,
      });
      console.log("👤 Default admin user created: admin / admin123");
    }

    // Run seeders in development
    if (process.env.NODE_ENV === "development") {
      const { runSeeders } = require("../config/seeders");
      await runSeeders();
    }

    // Log database info
    console.log(`🗄️  Database: ${process.env.DB_NAME}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Project,
  Admin,
  Skill,
  Experience,
  Profile,
  initDatabase,
};

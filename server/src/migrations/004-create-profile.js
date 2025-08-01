'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // Personal Information
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Nirvan Maharjan'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Full Stack Developer'
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // Contact Information
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'maharjannirvan01@gmail.com'
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Kathmandu, Nepal'
      },
      
      // Social Links
      github: {
        type: Sequelize.STRING,
        allowNull: true
      },
      linkedin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      twitter: {
        type: Sequelize.STRING,
        allowNull: true
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // Professional Information
      yearsOfExperience: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      currentPosition: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // About Section Content
      aboutTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Get to know me!'
      },
      aboutDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
      // Hero Section Content
      heroSubtitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      heroDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
      // Resume/CV
      resumeUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // Availability
      isAvailableForWork: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      
      // Meta Information
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profiles');
  }
};

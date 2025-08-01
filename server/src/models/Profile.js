const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Personal Information
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Nirvan Maharjan'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Full Stack Developer'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "I'm a Full Stack Developer passionate about building exceptional digital experiences. I enjoy creating websites and web applications that not only look great but also provide seamless user experiences."
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '/src/assets/profile.jpg'
  },
  
  // Contact Information
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'maharjannirvan01@gmail.com'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '+977 98XXXXXXXX'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Kathmandu, Nepal'
  },
  
  // Social Links
  github: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'https://github.com/Kimi0123'
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  
  // Professional Information
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  currentPosition: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Full Stack Developer'
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  
  // About Section Content
  aboutTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Get to know me!'
  },
  aboutDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "With a background in both design and development, I bring a unique perspective to every project. I love the challenge of turning complex problems into simple, beautiful, and intuitive solutions."
  },
  
  // Hero Section Content
  heroSubtitle: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Building amazing digital experiences'
  },
  heroDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'I create modern, responsive websites and applications that deliver exceptional user experiences.'
  },
  
  // Resume/CV
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  
  // Availability
  isAvailableForWork: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  
  // Meta Information
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'profiles',
  timestamps: true
});

module.exports = Profile;

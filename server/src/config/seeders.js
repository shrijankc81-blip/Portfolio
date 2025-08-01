const { Project, Skill, Experience } = require("../models");

// Sample projects data
const sampleProjects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, and payment integration.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    order: 1,
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["React", "Express.js", "Socket.io", "MongoDB", "Material-UI"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    order: 2,
  },
];

// Sample skills data
const sampleSkills = [
  // Frontend
  { name: "React", category: "Frontend", level: 5, icon: "⚛️", order: 1 },
  { name: "JavaScript", category: "Frontend", level: 5, icon: "🟨", order: 2 },
  { name: "TypeScript", category: "Frontend", level: 4, icon: "🔷", order: 3 },
  { name: "HTML5", category: "Frontend", level: 5, icon: "🌐", order: 4 },
  { name: "CSS3", category: "Frontend", level: 5, icon: "🎨", order: 5 },
  { name: "Tailwind CSS", category: "Frontend", level: 4, icon: "💨", order: 6 },
  
  // Backend
  { name: "Node.js", category: "Backend", level: 5, icon: "🟢", order: 1 },
  { name: "Express.js", category: "Backend", level: 5, icon: "🚂", order: 2 },
  { name: "Python", category: "Backend", level: 4, icon: "🐍", order: 3 },
  { name: "PostgreSQL", category: "Backend", level: 4, icon: "🐘", order: 4 },
  { name: "MongoDB", category: "Backend", level: 3, icon: "🍃", order: 5 },
  
  // Tools
  { name: "Git", category: "Tools", level: 5, icon: "📚", order: 1 },
  { name: "Docker", category: "Tools", level: 3, icon: "🐳", order: 2 },
  { name: "AWS", category: "Tools", level: 3, icon: "☁️", order: 3 },
  { name: "Figma", category: "Tools", level: 4, icon: "🎨", order: 4 },
];

// Sample experience data
const sampleExperiences = [
  {
    title: "Senior Full Stack Developer",
    company: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    startDate: "2022-01-01",
    endDate: null,
    current: true,
    description: "Lead development of web applications using React, Node.js, and PostgreSQL. Mentored junior developers and implemented CI/CD pipelines.",
    type: "work",
    order: 1,
  },
  {
    title: "Full Stack Developer",
    company: "Digital Agency",
    location: "New York, NY",
    startDate: "2020-06-01",
    endDate: "2021-12-31",
    current: false,
    description: "Developed responsive web applications and RESTful APIs. Collaborated with design team to implement pixel-perfect UIs.",
    type: "work",
    order: 2,
  },
  {
    title: "Bachelor of Science in Computer Science",
    company: "University of Technology",
    location: "Boston, MA",
    startDate: "2016-09-01",
    endDate: "2020-05-31",
    current: false,
    description: "Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering.",
    type: "education",
    order: 1,
  },
];

// Seed projects
const seedProjects = async () => {
  try {
    const existingProjects = await Project.count();
    if (existingProjects === 0) {
      await Project.bulkCreate(sampleProjects);
      console.log(`📁 Seeded ${sampleProjects.length} sample projects`);
    } else {
      console.log("📁 Projects already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding projects:", error);
  }
};

// Seed skills
const seedSkills = async () => {
  try {
    const existingSkills = await Skill.count();
    if (existingSkills === 0) {
      await Skill.bulkCreate(sampleSkills);
      console.log(`🛠️ Seeded ${sampleSkills.length} sample skills`);
    } else {
      console.log("🛠️ Skills already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding skills:", error);
  }
};

// Seed experiences
const seedExperiences = async () => {
  try {
    const existingExperiences = await Experience.count();
    if (existingExperiences === 0) {
      await Experience.bulkCreate(sampleExperiences);
      console.log(`💼 Seeded ${sampleExperiences.length} sample experiences`);
    } else {
      console.log("💼 Experiences already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding experiences:", error);
  }
};

// Run all seeders
const runSeeders = async () => {
  try {
    console.log("🌱 Running database seeders...");
    await seedProjects();
    await seedSkills();
    await seedExperiences();
    console.log("✅ Database seeding completed");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
  }
};

// Clear all data (for development)
const clearAllData = async () => {
  try {
    await Experience.destroy({ where: {} });
    await Skill.destroy({ where: {} });
    await Project.destroy({ where: {} });
    console.log("🗑️ All data cleared");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

module.exports = {
  runSeeders,
  seedProjects,
  seedSkills,
  seedExperiences,
  clearAllData,
  sampleProjects,
  sampleSkills,
  sampleExperiences,
};

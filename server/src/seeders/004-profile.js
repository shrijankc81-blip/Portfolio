'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('profiles', [
      {
        id: 1,
        fullName: 'Nirvan Maharjan',
        title: 'Full Stack Developer',
        bio: "I'm a Full Stack Developer passionate about building exceptional digital experiences. I enjoy creating websites and web applications that not only look great but also provide seamless user experiences.",
        profileImage: '/src/assets/profile.jpg',
        email: 'maharjannirvan01@gmail.com',
        phone: '+977 98XXXXXXXX',
        location: 'Kathmandu, Nepal',
        github: 'https://github.com/Kimi0123',
        linkedin: '',
        twitter: '',
        website: '',
        yearsOfExperience: 2,
        currentPosition: 'Full Stack Developer',
        company: '',
        aboutTitle: 'Get to know me!',
        aboutDescription: "With a background in both design and development, I bring a unique perspective to every project. I love the challenge of turning complex problems into simple, beautiful, and intuitive solutions. I'm constantly learning and staying up-to-date with the latest technologies and best practices in web development.",
        heroSubtitle: 'Building amazing digital experiences',
        heroDescription: 'I create modern, responsive websites and applications that deliver exceptional user experiences.',
        resumeUrl: '',
        isAvailableForWork: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('profiles', null, {});
  }
};

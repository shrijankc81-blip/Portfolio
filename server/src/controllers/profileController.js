const { Profile } = require('../models');

// Get profile (there should only be one)
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({
      where: { isActive: true }
    });

    // If no profile exists, create a default one
    if (!profile) {
      profile = await Profile.create({
        fullName: 'Nirvan Maharjan',
        title: 'Full Stack Developer',
        bio: "I'm a Full Stack Developer passionate about building exceptional digital experiences. I enjoy creating websites and web applications that not only look great but also provide seamless user experiences.",
        email: 'maharjannirvan01@gmail.com',
        phone: '+977 98XXXXXXXX',
        location: 'Kathmandu, Nepal',
        github: 'https://github.com/Kimi0123',
        aboutTitle: 'Get to know me!',
        aboutDescription: "With a background in both design and development, I bring a unique perspective to every project. I love the challenge of turning complex problems into simple, beautiful, and intuitive solutions.",
        heroSubtitle: 'Building amazing digital experiences',
        heroDescription: 'I create modern, responsive websites and applications that deliver exceptional user experiences.',
        isAvailableForWork: true,
        isActive: true
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      title,
      bio,
      profileImage,
      email,
      phone,
      location,
      github,
      linkedin,
      twitter,
      website,
      yearsOfExperience,
      currentPosition,
      company,
      aboutTitle,
      aboutDescription,
      heroSubtitle,
      heroDescription,
      resumeUrl,
      isAvailableForWork
    } = req.body;

    // Find existing profile or create new one
    let profile = await Profile.findOne({
      where: { isActive: true }
    });

    if (profile) {
      // Update existing profile
      await profile.update({
        fullName,
        title,
        bio,
        profileImage,
        email,
        phone,
        location,
        github,
        linkedin,
        twitter,
        website,
        yearsOfExperience,
        currentPosition,
        company,
        aboutTitle,
        aboutDescription,
        heroSubtitle,
        heroDescription,
        resumeUrl,
        isAvailableForWork
      });
    } else {
      // Create new profile
      profile = await Profile.create({
        fullName,
        title,
        bio,
        profileImage,
        email,
        phone,
        location,
        github,
        linkedin,
        twitter,
        website,
        yearsOfExperience,
        currentPosition,
        company,
        aboutTitle,
        aboutDescription,
        heroSubtitle,
        heroDescription,
        resumeUrl,
        isAvailableForWork,
        isActive: true
      });
    }

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Update profile with new image
    let profile = await Profile.findOne({
      where: { isActive: true }
    });

    if (profile) {
      await profile.update({ profileImage: imageUrl });
    } else {
      // Create profile if it doesn't exist
      profile = await Profile.create({
        fullName: 'Nirvan Maharjan',
        title: 'Full Stack Developer',
        email: 'maharjannirvan01@gmail.com',
        location: 'Kathmandu, Nepal',
        profileImage: imageUrl,
        isActive: true
      });
    }

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl,
      profile
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ 
      message: 'Error uploading profile image', 
      error: error.message 
    });
  }
};

// Reset profile to defaults
const resetProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({
      where: { isActive: true }
    });

    const defaultData = {
      fullName: 'Nirvan Maharjan',
      title: 'Full Stack Developer',
      bio: "I'm a Full Stack Developer passionate about building exceptional digital experiences. I enjoy creating websites and web applications that not only look great but also provide seamless user experiences.",
      email: 'maharjannirvan01@gmail.com',
      phone: '+977 98XXXXXXXX',
      location: 'Kathmandu, Nepal',
      github: 'https://github.com/Kimi0123',
      linkedin: '',
      twitter: '',
      website: '',
      yearsOfExperience: 0,
      currentPosition: 'Full Stack Developer',
      company: '',
      aboutTitle: 'Get to know me!',
      aboutDescription: "With a background in both design and development, I bring a unique perspective to every project. I love the challenge of turning complex problems into simple, beautiful, and intuitive solutions.",
      heroSubtitle: 'Building amazing digital experiences',
      heroDescription: 'I create modern, responsive websites and applications that deliver exceptional user experiences.',
      resumeUrl: '',
      isAvailableForWork: true,
      isActive: true
    };

    if (profile) {
      await profile.update(defaultData);
    } else {
      profile = await Profile.create(defaultData);
    }

    res.json({
      message: 'Profile reset to defaults successfully',
      profile
    });
  } catch (error) {
    console.error('Error resetting profile:', error);
    res.status(500).json({ 
      message: 'Error resetting profile', 
      error: error.message 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  resetProfile
};

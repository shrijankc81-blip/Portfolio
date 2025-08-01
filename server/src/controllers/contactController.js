const { Contact } = require('../models');

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address",
      });
    }

    // Get client IP and user agent for tracking
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Basic spam detection (simple rate limiting by IP)
    const recentMessages = await Contact.count({
      where: {
        ipAddress: ipAddress,
        createdAt: {
          [require('sequelize').Op.gte]: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    });

    if (recentMessages >= 5) {
      return res.status(429).json({
        error: "Too many messages sent. Please wait before sending another message.",
      });
    }

    // Save to database
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
      status: 'new'
    });

    console.log("📧 New contact message received:", {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      timestamp: contact.createdAt,
    });

    // TODO: Send email notification (Phase 2)
    
    res.json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
      id: contact.id
    });

  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      error: "Failed to send message. Please try again later.",
    });
  }
};

// Get all contact messages (Admin only)
const getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const whereClause = {};
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      whereClause.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      contacts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      error: "Failed to fetch contact messages",
    });
  }
};

// Update contact status (Admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        error: "Invalid status value",
      });
    }

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        error: "Contact message not found",
      });
    }

    const updateData = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    if (status === 'replied') {
      updateData.repliedAt = new Date();
    }

    await contact.update(updateData);

    res.json({
      message: "Contact status updated successfully",
      contact,
    });

  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({
      error: "Failed to update contact status",
    });
  }
};

// Delete contact message (Admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        error: "Contact message not found",
      });
    }

    await contact.destroy();

    res.json({
      message: "Contact message deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      error: "Failed to delete contact message",
    });
  }
};

// Get contact statistics (Admin only)
const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const total = await Contact.count();
    const today = await Contact.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    res.json({
      total,
      today,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = parseInt(stat.count);
        return acc;
      }, {})
    });

  } catch (error) {
    console.error("Error fetching contact stats:", error);
    res.status(500).json({
      error: "Failed to fetch contact statistics",
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
  getContactStats,
};

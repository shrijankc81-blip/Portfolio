const express = require('express')
const { Experience } = require('../models')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// Get all experiences (public route)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query // Filter by type: 'work' or 'education'
    
    const whereClause = type ? { type } : {}
    
    const experiences = await Experience.findAll({
      where: whereClause,
      order: [['order', 'ASC'], ['startDate', 'DESC']]
    })
    
    res.json({ success: true, experiences })
  } catch (error) {
    console.error('Get experiences error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single experience (public route)
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id)
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' })
    }
    res.json({ success: true, experience })
  } catch (error) {
    console.error('Get experience error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new experience (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
      type,
      order
    } = req.body

    if (!title || !company || !startDate) {
      return res.status(400).json({ error: 'Title, company, and start date are required' })
    }

    if (!['work', 'education'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "work" or "education"' })
    }

    // If current is true, endDate should be null
    const finalEndDate = current ? null : endDate

    const experience = await Experience.create({
      title,
      company,
      location,
      startDate,
      endDate: finalEndDate,
      current: current || false,
      description,
      type: type || 'work',
      order: order || 0
    })

    res.status(201).json({ success: true, experience })
  } catch (error) {
    console.error('Create experience error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update experience (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id)
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' })
    }

    const {
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
      type,
      order
    } = req.body

    if (type && !['work', 'education'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "work" or "education"' })
    }

    // If current is true, endDate should be null
    const finalEndDate = current ? null : (endDate !== undefined ? endDate : experience.endDate)

    await experience.update({
      title: title || experience.title,
      company: company || experience.company,
      location: location !== undefined ? location : experience.location,
      startDate: startDate || experience.startDate,
      endDate: finalEndDate,
      current: current !== undefined ? current : experience.current,
      description: description !== undefined ? description : experience.description,
      type: type || experience.type,
      order: order !== undefined ? order : experience.order
    })

    res.json({ success: true, experience })
  } catch (error) {
    console.error('Update experience error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete experience (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id)
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' })
    }

    await experience.destroy()
    res.json({ success: true, message: 'Experience deleted successfully' })
  } catch (error) {
    console.error('Delete experience error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Bulk update experience order (admin only)
router.put('/bulk/reorder', authenticateToken, async (req, res) => {
  try {
    const { experiences } = req.body // Array of { id, order }

    if (!Array.isArray(experiences)) {
      return res.status(400).json({ error: 'Experiences array is required' })
    }

    // Update each experience's order
    for (const expData of experiences) {
      await Experience.update(
        { order: expData.order },
        { where: { id: expData.id } }
      )
    }

    res.json({ success: true, message: 'Experience order updated successfully' })
  } catch (error) {
    console.error('Reorder experiences error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router

const express = require('express')
const { Skill } = require('../models')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// Get all skills (public route)
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [['category', 'ASC'], ['order', 'ASC'], ['name', 'ASC']]
    })
    
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {})
    
    res.json({ success: true, skills: groupedSkills })
  } catch (error) {
    console.error('Get skills error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single skill (public route)
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id)
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }
    res.json({ success: true, skill })
  } catch (error) {
    console.error('Get skill error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new skill (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, level, icon, order } = req.body

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' })
    }

    if (level && (level < 1 || level > 5)) {
      return res.status(400).json({ error: 'Level must be between 1 and 5' })
    }

    const skill = await Skill.create({
      name,
      category,
      level: level || 1,
      icon,
      order: order || 0
    })

    res.status(201).json({ success: true, skill })
  } catch (error) {
    console.error('Create skill error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update skill (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id)
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    const { name, category, level, icon, order } = req.body

    if (level && (level < 1 || level > 5)) {
      return res.status(400).json({ error: 'Level must be between 1 and 5' })
    }

    await skill.update({
      name: name || skill.name,
      category: category || skill.category,
      level: level !== undefined ? level : skill.level,
      icon: icon !== undefined ? icon : skill.icon,
      order: order !== undefined ? order : skill.order
    })

    res.json({ success: true, skill })
  } catch (error) {
    console.error('Update skill error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete skill (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id)
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    await skill.destroy()
    res.json({ success: true, message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('Delete skill error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Bulk update skill order (admin only)
router.put('/bulk/reorder', authenticateToken, async (req, res) => {
  try {
    const { skills } = req.body // Array of { id, order }

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills array is required' })
    }

    // Update each skill's order
    for (const skillData of skills) {
      await Skill.update(
        { order: skillData.order },
        { where: { id: skillData.id } }
      )
    }

    res.json({ success: true, message: 'Skill order updated successfully' })
  } catch (error) {
    console.error('Reorder skills error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router

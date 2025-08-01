const express = require('express')
const { Project } = require('../models')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// Get all projects (public route)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    })
    res.json({ success: true, projects })
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single project (public route)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json({ success: true, project })
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new project (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      technologies,
      liveUrl,
      githubUrl,
      featured,
      order
    } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' })
    }

    const project = await Project.create({
      title,
      description,
      image,
      technologies: technologies || [],
      liveUrl,
      githubUrl,
      featured: featured || false,
      order: order || 0
    })

    res.status(201).json({ success: true, project })
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update project (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const {
      title,
      description,
      image,
      technologies,
      liveUrl,
      githubUrl,
      featured,
      order
    } = req.body

    await project.update({
      title: title || project.title,
      description: description || project.description,
      image: image !== undefined ? image : project.image,
      technologies: technologies !== undefined ? technologies : project.technologies,
      liveUrl: liveUrl !== undefined ? liveUrl : project.liveUrl,
      githubUrl: githubUrl !== undefined ? githubUrl : project.githubUrl,
      featured: featured !== undefined ? featured : project.featured,
      order: order !== undefined ? order : project.order
    })

    res.json({ success: true, project })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete project (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    await project.destroy()
    res.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Bulk update project order (admin only)
router.put('/bulk/reorder', authenticateToken, async (req, res) => {
  try {
    const { projects } = req.body // Array of { id, order }

    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: 'Projects array is required' })
    }

    // Update each project's order
    for (const projectData of projects) {
      await Project.update(
        { order: projectData.order },
        { where: { id: projectData.id } }
      )
    }

    res.json({ success: true, message: 'Project order updated successfully' })
  } catch (error) {
    console.error('Reorder projects error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router

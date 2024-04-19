const express = require('express');
const { createRepo } = require('../utils/codeCollaboration');
const router = express.Router();

// Middleware for parsing JSON request bodies
router.use(express.json());

// Route for creating a GitHub repository
router.post('/createRepo', async (req, res) => {
  try {
    const { repoName } = req.body;
    if (!repoName) {
      console.log('Repository name is required');
      return res.status(400).json({ error: 'Repository name is required' });
    }
    console.log(`Attempting to create repository: ${repoName}`);
    const createdRepo = await createRepo(repoName);
    console.log(`Repository created successfully: ${createdRepo.html_url}`);
    res.status(200).json(createdRepo);
  } catch (error) {
    console.error('Error creating repository:', error.message, error);
    res.status(500).json({ error: 'Failed to create repository' });
  }
});

module.exports = router;
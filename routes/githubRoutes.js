const express = require('express');
const { createRepo } = require('../utils/codeCollaboration');
const router = express.Router();
require('dotenv').config(); // Ensure dotenv is required to access environment variables

// Middleware for parsing JSON request bodies
router.use(express.json());

// Check if CI/CD is enabled before proceeding with the route
const isCiCdEnabled = process.env.ENABLE_CI_CD === 'true';

// Route for creating a GitHub repository
router.post('/createRepo', async (req, res) => {
  if (!isCiCdEnabled) {
    console.log('CI/CD features are disabled. Skipping repository creation.');
    return res.status(403).json({ error: 'CI/CD features are disabled.' });
  }

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
    console.error('Error creating repository:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create repository' });
  }
});

module.exports = router;
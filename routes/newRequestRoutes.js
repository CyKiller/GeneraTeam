const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');

// Route to display the request submission form
router.get('/requests/new', isAuthenticated, (req, res) => {
  try {
    res.render('requestForm');
    console.log('Request form page rendered successfully.');
  } catch (error) {
    console.error('Error rendering request form page:', error.message, error.stack);
    res.status(500).send('Error displaying the request submission form.');
  }
});

module.exports = router;
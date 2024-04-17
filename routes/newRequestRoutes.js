const express = require('express');
const router = express.Router();

// Route to display the request submission form
router.get('/requests/new', (req, res) => {
  try {
    res.render('requestForm');
    console.log('Request form page rendered successfully.');
  } catch (error) {
    console.error('Error rendering request form page:', error.message, error.stack);
    res.status(500).send('Error displaying the request submission form.');
  }
});

module.exports = router;
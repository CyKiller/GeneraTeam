const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/history', isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    console.log('User is not authenticated.');
    return res.redirect('/login');
  }

  Request.find({ userId: userId })
    .then(requests => {
      console.log(`Found ${requests.length} requests for user ${userId}.`);
      res.render('history', { requests: requests });
    })
    .catch(err => {
      console.error('Error fetching user history:', err.message, err.stack);
      res.status(500).send('Error fetching user history');
    });
});

module.exports = router;
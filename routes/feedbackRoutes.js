const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const Feedback = require('../models/Feedback');

router.post('/api/feedback', isAuthenticated, (req, res) => {
  const { requestId, userSatisfaction } = req.body;
  const feedback = new Feedback({
    requestId,
    userSatisfaction,
    sentimentScore: 0, // Placeholder, actual score to be updated by analyzeChatFeedback function
  });

  feedback.save()
    .then(() => {
      console.log('Feedback saved successfully.');
      res.json({ message: 'Feedback saved successfully.' });
    })
    .catch(err => {
      console.error('Error saving feedback:', err);
      res.status(500).json({ error: 'Error saving feedback: ' + err.message });
    });
});

module.exports = router;
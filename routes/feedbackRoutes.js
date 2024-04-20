const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const Feedback = require('../models/Feedback');
const { adjustTaskAssignmentAndTeamGeneration } = require('../utils/feedbackLoop');

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

// Endpoint to submit feedback and trigger adjustments based on feedback
router.post('/api/feedback/adjustment', isAuthenticated, async (req, res) => {
  const { requestId, feedback } = req.body;
  try {
    await adjustTaskAssignmentAndTeamGeneration(requestId, feedback);
    console.log(`Feedback processed and adjustments made for requestId: ${requestId}`);
    res.json({ message: 'Feedback processed and adjustments made.' });
  } catch (err) {
    console.error('Error processing feedback and making adjustments:', err);
    res.status(500).json({ error: 'Error processing feedback and making adjustments: ' + err.message });
  }
});

// Endpoint to retrieve feedback for a specific request
router.get('/api/feedback/:requestId', isAuthenticated, async (req, res) => {
  const { requestId } = req.params;
  try {
    const feedback = await Feedback.find({ requestId: requestId });
    console.log(`Retrieved feedback for requestId: ${requestId}`);
    res.json(feedback);
  } catch (err) {
    console.error('Error retrieving feedback:', err);
    res.status(500).json({ error: 'Error retrieving feedback: ' + err.message });
  }
});

module.exports = router;
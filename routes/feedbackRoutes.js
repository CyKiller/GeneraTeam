const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const Feedback = require('../models/Feedback');
const { adjustTaskAssignmentAndTeamGeneration } = require('../utils/feedbackLoop');
const { refineTeamGeneration } = require('../utils/feedbackRefiner');

router.post('/api/feedback', isAuthenticated, (req, res) => {
  const { requestId, userSatisfaction, comments } = req.body;
  const feedback = new Feedback({
    requestId,
    userSatisfaction,
    sentimentScore: 0, // Placeholder, actual score to be updated by analyzeChatFeedback function
    comments,
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

// Add a new endpoint to manually trigger the refinement process
router.get('/api/refine-team-generation', isAuthenticated, async (req, res) => {
  try {
    await refineTeamGeneration();
    console.log('Team generation refinement process initiated based on feedback.');
    res.json({ message: 'Team generation refinement process initiated based on feedback.' });
  } catch (err) {
    console.error('Error initiating team generation refinement:', err);
    res.status(500).json({ error: 'Error initiating team generation refinement: ' + err.message });
  }
});

module.exports = router;
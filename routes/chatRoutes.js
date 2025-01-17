const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const mongoose = require('mongoose');
const { analyzeChatFeedback } = require('../utils/feedbackLoop'); // Importing the feedback loop utility
const { isAuthenticated } = require('./middleware/authMiddleware'); // Importing the isAuthenticated middleware

// Middleware to ensure that userId and requestId are present
const ensureChatParameters = (req, res, next) => {
  const { userId } = req.session;
  const { requestId } = req.query;

  if (!userId) {
    console.log('Session missing userId');
    return res.redirect('/login'); // Redirecting to login if userId is missing
  }

  if (!requestId) {
    console.log('Missing requestId for chat');
    return res.redirect('/'); // Redirecting to home to select a request
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(requestId)) {
    console.log('Invalid userId or requestId');
    return res.status(400).send('Invalid request parameters');
  }

  next();
};

// Route for chat interface, now protected with isAuthenticated middleware
router.get('/chat', isAuthenticated, ensureChatParameters, (req, res) => {
  const { userId } = req.session;
  const { requestId } = req.query;

  Chat.findOne({ userId: userId, requestId: requestId })
    .then(chat => {
      if (!chat) {
        console.log(`No chat history found for userId: ${userId} and requestId: ${requestId}`);
        return res.render('chat', { chat: [], userId: userId, requestId: requestId });
      }
      res.render('chat', { chat: chat.messages, userId: userId, requestId: requestId });
    })
    .catch(err => {
      console.error('Error fetching chat history:', err);
      res.status(500).send('Error fetching chat history');
    });
});

// Route to save chat messages, now protected with isAuthenticated middleware
router.post('/chat/save', isAuthenticated, ensureChatParameters, (req, res) => {
  const { userId, requestId, messageText, sender } = req.body;

  if (!userId || !requestId || !messageText || !sender) {
    console.log('Missing required fields for saving chat message');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(requestId)) {
    console.log('Invalid userId or requestId for saving chat message');
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  Chat.findOneAndUpdate(
    { userId: req.session.userId, requestId: requestId },
    { $push: { messages: { messageText: messageText, sender: sender, createdAt: new Date() } } },
    { new: true, upsert: true },
    (err, chat) => {
      if (err) {
        console.error('Error saving chat message:', err);
        return res.status(500).json({ error: 'Error saving chat message' });
      }
      // Trigger feedback analysis after saving the chat message
      analyzeChatFeedback(requestId)
        .then(() => console.log('Feedback analysis completed for requestId:', requestId))
        .catch(error => {
          console.error('Error during feedback analysis:', error.message, error.stack);
          res.status(500).send('Error during feedback analysis');
        });
      res.status(200).json(chat);
    }
  );
});

// Corrected route to fetch chat history, ensuring it matches the expected API endpoint
router.get('/api/chat/history', isAuthenticated, ensureChatParameters, (req, res) => {
  const { userId, requestId } = req.query;

  Chat.findOne({ userId: userId, requestId: requestId })
    .select('messages')
    .then(chat => {
      if (!chat) {
        console.log(`No chat history found for userId: ${userId} and requestId: ${requestId}`);
        // Changed to return an empty array instead of a 404 error when no chat history is found
        return res.status(200).json([]);
      }
      res.json(chat.messages);
    })
    .catch(err => {
      console.error('Error fetching chat history:', err);
      res.status(500).json({ error: 'Error fetching chat history', details: err.message });
    });
});

module.exports = router;
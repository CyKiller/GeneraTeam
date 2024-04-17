const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const mongoose = require('mongoose');

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

// Route for chat interface
router.get('/chat', ensureChatParameters, (req, res) => {
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

// Route to save chat messages
router.post('/chat/save', ensureChatParameters, (req, res) => {
  const { userId, requestId, messageText, sender } = req.body;

  // Re-validate userId and requestId to ensure they match the session and query parameters
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
      res.status(200).json(chat);
    }
  );
});

module.exports = router;
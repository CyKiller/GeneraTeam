const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  userSatisfaction: { type: String, required: true }, // 'positive', 'neutral', 'negative'
  sentimentScore: { type: Number, required: true },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
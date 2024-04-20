const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  userSatisfaction: { type: String, required: true }, // 'positive', 'neutral', 'negative'
  sentimentScore: { type: Number, required: true },
  comments: { type: String }, // Optional field for additional comments
}, { timestamps: true });

feedbackSchema.pre('save', function(next) {
  console.log(`Saving feedback for request ID: ${this.requestId}`);
  next();
});

feedbackSchema.post('save', function(doc) {
  console.log(`Feedback saved successfully for request ID: ${doc.requestId}`);
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
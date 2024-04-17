const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestText: { type: String, required: true },
  taskType: String,
  requirements: String,
  urgency: String,
  status: { type: String, default: 'Pending' }, // Pending, Clarified, Completed
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
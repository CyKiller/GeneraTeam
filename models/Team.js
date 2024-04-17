const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  profiles: { type: String, required: true } // Assuming profiles are stored as a JSON string for simplicity
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
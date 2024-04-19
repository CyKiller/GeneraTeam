const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  assignedMemberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Completed'] },
}, { timestamps: true });

taskSchema.pre('save', function(next) {
  console.log(`Saving task: ${this.name} with status: ${this.status}`);
  next();
});

taskSchema.post('save', function(doc, next) {
  console.log(`Task saved: ${doc.name} with ID: ${doc._id}`);
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
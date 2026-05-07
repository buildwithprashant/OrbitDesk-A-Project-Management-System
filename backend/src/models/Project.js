const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1200 },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['planning', 'active', 'completed', 'archived'], default: 'active' },
    color: { type: String, default: '#0f766e' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, name: 1 });
projectSchema.index({ members: 1 });

module.exports = mongoose.model('Project', projectSchema);

const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  juryName: {
    type: String,
    required: true,
    trim: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  criteria: {
    innovation: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    },
    creativity: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    },
    feasibility: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    },
    presentation: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    }
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate marks from same jury for same team
marksSchema.index({ juryName: 1, teamName: 1 }, { unique: true });

module.exports = mongoose.model('Marks', marksSchema);
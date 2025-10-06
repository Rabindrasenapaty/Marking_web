const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  criteriaList: {
    type: [String],
    default: ['Innovation', 'Creativity', 'Feasibility', 'Presentation']
  },
  maxMarksPerCriterion: {
    type: Number,
    default: 20
  },
  competitionName: {
    type: String,
    default: 'College Competition'
  },
  collegeName: {
    type: String,
    default: 'Your College Name'
  },
  clubName: {
    type: String,
    default: 'Your Club Name'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Config', configSchema);
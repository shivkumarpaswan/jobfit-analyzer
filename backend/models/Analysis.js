const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  fileName: String,
  jobRole: String,
  matchScore: Number,
  summary: String,
  matchedSkills: [String],
  missingSkills: [String],
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);
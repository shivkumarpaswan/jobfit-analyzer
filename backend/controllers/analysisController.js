const Analysis = require('../models/Analysis');
const { extractText } = require('../utils/fileParser');
const { analyzeResume } = require('../services/geminiService');

exports.analyze = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Resume file required' });
    if (!req.body.jobDescription || req.body.jobDescription.trim().length < 50) {
      return res.status(400).json({ message: 'Job description required (min 50 chars)' });
    }

    const text = await extractText(req.file.buffer, req.file.mimetype);
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text. Scanned PDF?' });
    }

    const result = await analyzeResume(text, req.body.jobDescription);

    const analysis = await Analysis.create({
      fileName: req.file.originalname,
      jobRole: req.body.jobRole || 'Not specified',
      ...result
    });

    res.json({ success: true, analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const list = await Analysis.find().sort({ createdAt: -1 }).limit(20);
  res.json(list);
};
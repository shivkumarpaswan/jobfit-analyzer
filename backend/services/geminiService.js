const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (resumeText, jobDescription) => {
 const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = 'You are an expert HR professional. Analyze this resume against the job description.\n\nRESUME:\n' + resumeText.substring(0, 6000) + '\n\nJOB DESCRIPTION:\n' + jobDescription.substring(0, 3000) + '\n\nReturn ONLY valid JSON (no markdown):\n{\n  "matchScore": <number 0-100>,\n  "summary": "<2-3 line summary>",\n  "matchedSkills": ["<skill1>"],\n  "missingSkills": ["<skill1>"],\n  "strengths": ["<point1>"],\n  "weaknesses": ["<point1>"],\n  "suggestions": ["<tip1>"]\n}';

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim().replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error('AI response parse failed: ' + text);
  }
};

module.exports = { analyzeResume };
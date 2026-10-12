const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const extractText = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const data = await pdf(buffer);
    return data.text;
  } else if (mimetype.includes('word') || mimetype.includes('document')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error('Unsupported file type. Use PDF or DOCX.');
};

module.exports = { extractText };
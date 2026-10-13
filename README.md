# 🎯 JobFit Analyzer

🔴 **[Live Demo](https://jobfit-analyzer-delta.vercel.app)** | 📂 **[GitHub](https://github.com/shivkumarpaswan/jobfit-analyzer)**

An AI-powered resume analyzer that matches your resume against any job description and gives a match score with skill gap analysis.

## 🚀 Features

- 📄 Upload resume (PDF/DOCX)
- 📋 Paste any job description
- 🎯 AI-powered match score (0-100)
- ✅ Matched & missing skills detection
- 💪 Strengths & weaknesses analysis
- 💡 Actionable suggestions to improve
- 📊 Circular score visualization
- 📱 Fully responsive UI

## 🛠️ Tech Stack

**Frontend:**
- React
- Tailwind CSS
- Axios
- React Dropzone

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer (memory storage)
- pdf-parse + mammoth

**AI:**
- Google Gemini 2.5 Flash API

## 🎯 How It Works

1. User uploads resume + pastes job description
2. Backend extracts text from PDF/DOCX
3. Gemini AI compares resume against JD
4. Returns match score, matched/missing skills, strengths, weaknesses, and suggestions

## 📸 Screenshot

### Home Page
![Home Page](screenshots/home.png)

### Analysis Result
![Analysis Result](screenshots/result.png)

## 🔗 Live Demo

👉 **[Try it live](https://jobfit-analyzer-delta.vercel.app)**

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// MongoDB setup (optional)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doc-scanner';
const documentSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  extractedText: String,
  summaries: { short: String, medium: String, long: String },
  keyPoints: [String],
  createdAt: { type: Date, default: Date.now }
});
const Document = mongoose.model('Document', documentSchema);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

// Extract text from PDF
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Extract text from image
async function extractTextFromImage(filePath) {
  const result = await Tesseract.recognize(filePath, 'eng', { logger: m => console.log(m) });
  return result.data.text;
}

// Gemini Summaries
async function generateGeminiSummaries(text) {
  if (!process.env.GEMINI_API_KEY) throw new Error('Gemini API key missing');

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompts = {
    short: `Summarize the following text in 2-3 sentences:\n\n${text}`,
    medium: `Summarize the following text in 1 paragraph (4-6 sentences):\n\n${text}`,
    long: `Summarize the following text in 2-3 paragraphs:\n\n${text}`,
    keyPoints: `Extract 5-7 key points as a bullet list:\n\n${text}`
  };

  const [short, medium, long, keyPoints] = await Promise.all([
    model.generateContent(prompts.short),
    model.generateContent(prompts.medium),
    model.generateContent(prompts.long),
    model.generateContent(prompts.keyPoints)
  ]);

  return {
    summaries: {
      short: short.response.text(),
      medium: medium.response.text(),
      long: long.response.text()
    },
    keyPoints: keyPoints.response
      .text()
      .split("\n")
      .map(l => l.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean)
  };
}

// Routes
app.post('/api/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    let extractedText = req.file.mimetype === 'application/pdf'
      ? await extractTextFromPDF(filePath)
      : await extractTextFromImage(filePath);

    if (!extractedText.trim()) return res.status(400).json({ error: 'No text found' });

    // Limit text size
    const textToSummarize = extractedText.length > 8000
      ? extractedText.substring(0, 8000) + '...'
      : extractedText;

    const aiResult = await generateGeminiSummaries(textToSummarize);

    const result = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      extractedText,
      summaries: aiResult.summaries,
      keyPoints: aiResult.keyPoints
    };

    if (mongoose.connection.readyState === 1) {
      const document = new Document(result);
      await document.save();
      result.id = document._id;
    }

    fs.unlinkSync(filePath); // cleanup
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
  });
});

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection failed:', err.message));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

Doc_Scanner - AI-Powered Document Analysis

A full-stack MERN app that extracts text from PDFs/images and generates AI summaries using Google Gemini AI.

🔹 Features

Upload PDF or image (JPEG, JPG, PNG) via drag-and-drop or file picker

Extract text (PDF parsing + OCR)

AI-generated summaries: short, medium, long

Copy summaries or key points with a click

Key points extraction

Real-time processing indicators

Optional MongoDB storage

🛠 Tech Stack

Frontend: React 18, TypeScript, Tailwind CSS, Lucide React

Backend: Node.js, Express, Multer, pdf-parse, Tesseract.js, Google Gemini AI

Database: MongoDB with Mongoose (optional)

📁 Project Structure
Doc_Scanner/
│── index.html
│
├── server/
│   ├── .env
│   └── index.js
│
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   │
│   └── components/
│       ├── FileUpload.tsx
│       ├── ProcessingStatus.tsx
│       └── SummaryDisplay.tsx

⚡ Getting Started

Install dependencies:

npm install


Setup .env in server/:

GEMINI_API_KEY=your_gemini_api_key
PORT=5000
MONGODB_URI=your_mongodb_uri (optional)


To Start project run these commands:

cd server
node index.js

Backend will start at: http://localhost:5000

check backend api is running fine: http://localhost:5000/api/health

To start frontend:
cd ..
npm run client
See Frontend on : http://localhost:5173



📄 Supported Files

PDF, JPEG, JPG, PNG (max 10MB)

🔧 Notes

Works with or without MongoDB

AI processing may take a few seconds for large documents

Temporary files deleted after processing

Drag-and-drop interface for easy uploads

Copy button available for summaries and key points
# 📄 Doc_Scanner - AI-Powered Document Analysis

A full-stack **MERN app** that extracts text from PDFs/images and generates AI summaries using **Google Gemini AI**.

---

## 🔹 Features
- 📂 Upload PDF or image (**JPEG, JPG, PNG**) via drag-and-drop or file picker  
- 📑 Extract text (**PDF parsing + OCR**)  
- 🤖 AI-generated summaries: **short, medium, long**  
- 📋 Copy summaries or key points with one click  
- 🔑 Key points extraction  
- ⚡ Real-time processing indicators  
- 🗄 Optional **MongoDB storage**  

---

## 🛠 Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React  
- **Backend:** Node.js, Express, Multer, pdf-parse, Tesseract.js, Google Gemini AI  
- **Database:** MongoDB with Mongoose (optional)  

---

## 📁 Project Structure
Doc_Scanner/
│── index.html
│
├── server/
│ ├── .env
│ └── index.js
│
├── src/
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ │
│ └── components/
│ ├── FileUpload.tsx
│ ├── ProcessingStatus.tsx
│ └── SummaryDisplay.tsx
---


### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Setup Environment Variables
Create a `.env` file inside the `server/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
MONGODB_URI=your_mongodb_uri (optional)
```
###3️⃣ Run the backend
cd server
node index.js

Backend runs at: http://localhost:5000
---
Health check: http://localhost:5000/api/health

---
###4️⃣ Run the frontend

cd ..

npm run client


Frontend runs at: http://localhost:5173
---

###📄 Supported Files
PDF
JPEG, JPG
PNG
(Max size: 10MB)
---

###🔧 Notes
✅ Works with or without MongoDB

⏳ AI processing may take a few seconds for large documents

🧹 Temporary files are deleted after processing

🎯 Drag-and-drop interface for easy uploads

📋 Copy button available for summaries and key points


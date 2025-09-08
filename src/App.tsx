import React, { useState } from 'react';
import { FileText, Brain, Github, AlertCircle, Settings } from 'lucide-react';
import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import ProcessingStatus from './components/ProcessingStatus';

interface DocumentData {
  originalname: string;
  extractedText: string;
  summaries: {
    short: string;
    medium: string;
    long: string;
  };
  keyPoints: string[];
}

type ProcessingStage = 'uploading' | 'extracting' | 'summarizing' | 'complete';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('uploading');
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setError('');
    setDocumentData(null);

    try {
      setProcessingStage('uploading');

      const formData = new FormData();
      formData.append('document', file);

      setTimeout(() => setProcessingStage('extracting'), 800);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      setTimeout(() => setProcessingStage('summarizing'), 1500);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      setTimeout(() => {
        setProcessingStage('complete');
        setDocumentData(result);
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    setDocumentData(null);
    setError('');
    setIsProcessing(false);
    setProcessingStage('uploading');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#343541] via-[#40414F] to-[#343541]">
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                DOC_SCANNER
              </h1>
              <p className="text-sm text-gray-200 font-medium">
                AI-Powered Document Summarizer
              </p>
            </div>
          </div>
          <a
            href="https://github.com/nischalsoni02/DOC_SCANNER"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-2 text-gray-200 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm font-medium">View Code</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Processing Error</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={resetApp}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 underline font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {!documentData && !isProcessing && !error && (
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 shadow-lg">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Summarize Smarter, Not Harder
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              Upload a PDF or image document to get an AI-powered summary. Our system extracts the text, analyzes the content, and generates intelligent summaries with key insights to help you quickly understand your document.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow-md border border-blue-200 hover:scale-105 transform transition-all duration-300">
                <div className="bg-blue-200 p-3 rounded-lg w-12 h-12 mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Smart Extraction</h3>
                <p className="text-sm text-gray-600">PDF parsing and OCR for images with high accuracy</p>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6 shadow-md border border-purple-200 hover:scale-105 transform transition-all duration-300">
                <div className="bg-purple-200 p-3 rounded-lg w-12 h-12 mx-auto mb-4">
                  <Brain className="w-6 h-6 text-purple-700" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">AI-powered intelligent summarization</p>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-6 shadow-md border border-green-200 hover:scale-105 transform transition-all duration-300">
                <div className="bg-green-200 p-3 rounded-lg w-12 h-12 mx-auto mb-4">
                  <Settings className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Multiple Formats</h3>
                <p className="text-sm text-gray-600">Key points, Short, medium, and detailed summary options</p>
              </div>
            </div>
          </div>
        )}

        {isProcessing && <ProcessingStatus stage={processingStage} />}

        {!documentData && !isProcessing && (
          <FileUpload onUpload={handleFileUpload} isProcessing={isProcessing} />
        )}

        {documentData && (
          <div className="space-y-8">
            <SummaryDisplay data={documentData} />
            <div className="text-center">
              <button
                onClick={resetApp}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Upload Another Document
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="font-semibold text-lg mb-2">Project Created by NISCHAL SONI</p>
          <p className="text-sm mb-1">Intelligent Document Analysis & Summaries</p>
          <p className="text-sm">Powered with AI & Modern Web Technologies</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

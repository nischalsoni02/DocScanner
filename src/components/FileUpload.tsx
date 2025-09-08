import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, X, Loader2, Zap } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );
    
    if (validFile) {
      setSelectedFile(validFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />;
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  return (
    //here
    <div className="w-full max-w-2xl mx-auto">
  <div
  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
  ${isDragOver ? 'border-purple-600 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 shadow-lg scale-105' 
               : 'border-purple-300 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 hover:border-purple-600 hover:shadow-xl hover:scale-105'}
  ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}

  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,image/*"
      onChange={handleFileSelect}
      className="hidden"
      disabled={isProcessing}
    />

    {!selectedFile ? (
      <>
        <div className="mb-4">
          <Upload className="w-16 h-16 mx-auto text-gray-500 mb-2" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Upload Your Document Here
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop your PDF or image file here, or click to browse
        </p>
        <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="text-xs text-gray-700 font-semibold">
            Get intelligent summaries with key insights and main points
          </p>
        </div>
        <p className="text-sm text-gray-500">
          Supports: PDF, JPEG, JPG, PNG (max 10MB)
        </p>
      </>
    ) : (
      <div className="flex items-center justify-center space-x-4">
        {getFileIcon(selectedFile.type)}
        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-800">{selectedFile.name}</p>
          <p className="text-sm text-gray-600">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        {!isProcessing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>
    )}
  </div>

  {selectedFile && (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleUpload}
        disabled={isProcessing}
        className={`
          px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform
          ${isProcessing
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
          }
        `}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing with AI...
          </span>
        ) : (
          <span className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Generate AI Summary
          </span>
        )}
      </button>
    </div>
  )}
</div>
//here


  );
};

export default FileUpload;
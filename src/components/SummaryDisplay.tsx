import React, { useState } from 'react';
import { FileText, Copy, Check, Zap, Key, BookOpen } from 'lucide-react';

interface SummaryDisplayProps {
  data: {
    originalname: string;
    extractedText: string;
    summaries: {
      short: string;
      medium: string;
      long: string;
    };
    keyPoints: string[];
  } | null;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ data }) => {
  const [selectedLength, setSelectedLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [copiedText, setCopiedText] = useState<string>('');

  if (!data) return null;

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const summaryLengths = [
    { key: 'short' as const, label: 'Brief', description: '2-3 sentences', icon: '⚡' },
    { key: 'medium' as const, label: 'Standard', description: '1 paragraph', icon: '📄' },
    { key: 'long' as const, label: 'Detailed', description: '2-3 paragraphs', icon: '📚' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Document Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {data.originalname}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Analyzed by OpenAI GPT</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Document Statistics:</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {data.extractedText.length.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Characters</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {data.extractedText.split(/\s+/).length.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Words</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Points Section */}
      {data.keyPoints && data.keyPoints.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Key Points</h3>
            <button
              onClick={() => handleCopy(data.keyPoints.join('\n• '), 'keypoints')}
              className="ml-auto flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copiedText === 'keypoints' ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
            <ul className="space-y-2">
              {data.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Summary Options */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">AI-Generated Summaries</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {summaryLengths.map((length) => (
            <button
              key={length.key}
              onClick={() => setSelectedLength(length.key)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105
                ${selectedLength === length.key
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{length.icon}</span>
                <div className="font-semibold text-gray-800">{length.label}</div>
              </div>
              <div className="text-sm text-gray-600">{length.description}</div>
            </button>
          ))}
        </div>

        {/* Summary Content */}
        <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              {summaryLengths.find(l => l.key === selectedLength)?.label} Summary
            </h4>
            <button
              onClick={() => handleCopy(data.summaries[selectedLength], selectedLength)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              {copiedText === selectedLength ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
              {data.summaries[selectedLength]}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>Summary Length: {data.summaries[selectedLength].length.toLocaleString()} characters</span>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Generated by AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Original Text Preview */}
      <details className="bg-white rounded-xl shadow-lg border border-gray-100">
        <summary className="p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl">
          <span className="text-lg font-semibold text-gray-800">View Original Extracted Text</span>
        </summary>
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800">Extracted Text</h4>
              <button
                onClick={() => handleCopy(data.extractedText, 'original')}
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copiedText === 'original' ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
              {data.extractedText}
            </p>
          </div>
        </div>
      </details>
    </div>
  );
};

export default SummaryDisplay;
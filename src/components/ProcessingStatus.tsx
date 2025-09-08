import React from 'react';
import { Loader2, FileText, Brain, CheckCircle, Zap, Eye } from 'lucide-react';

interface ProcessingStatusProps {
  stage: 'uploading' | 'extracting' | 'summarizing' | 'complete';
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ stage }) => {
  const stages = [
    { key: 'uploading', label: 'Uploading Document', icon: FileText, color: 'blue' },
    { key: 'extracting', label: 'Extracting Text', icon: Eye, color: 'orange' },
    { key: 'summarizing', label: 'AI Analysis & Summary', icon: Brain, color: 'purple' },
    { key: 'complete', label: 'Complete', icon: CheckCircle, color: 'green' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);

  const getColorClasses = (color: string, isActive: boolean, isComplete: boolean) => {
    if (isComplete) {
      return {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600'
      };
    }
    if (isActive) {
      const colorMap = {
        blue: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: 'text-blue-600' },
        orange: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800', icon: 'text-orange-600' },
        purple: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', icon: 'text-purple-600' },
        green: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon: 'text-green-600' }
      };
      return colorMap[color as keyof typeof colorMap];
    }
    return {
      bg: 'bg-gray-50 border-gray-200',
      text: 'text-gray-600',
      icon: 'text-gray-400'
    };
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full w-16 h-16 mx-auto mb-4">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Processing Your Document
        </h3>
        <p className="text-gray-600">
          AI-powered analysis in progress...
        </p>
      </div>
      
      <div className="space-y-4">
        {stages.map((stageItem, index) => {
          const Icon = stageItem.icon;
          const isActive = index === currentStageIndex;
          const isComplete = index < currentStageIndex;
          const colors = getColorClasses(stageItem.color, isActive, isComplete);
          
          return (
            <div
              key={stageItem.key}
              className={`
                flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-500 transform
                ${colors.bg}
                ${isActive ? 'scale-105 shadow-md' : ''}
              `}
            >
              <div className="flex-shrink-0">
                {isActive ? (
                  <div className="relative">
                    <Loader2 className={`w-7 h-7 ${colors.icon} animate-spin`} />
                    <div className="absolute inset-0 rounded-full border-2 border-current opacity-20 animate-pulse"></div>
                  </div>
                ) : isComplete ? (
                  <CheckCircle className={`w-7 h-7 ${colors.icon}`} />
                ) : (
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`font-semibold transition-colors ${colors.text}`}>
                  {stageItem.label}
                </p>
                {stageItem.key === 'summarizing' && isActive && (
                  <p className="text-sm text-purple-600 mt-1">
                    Using OpenAI GPT for intelligent analysis
                  </p>
                )}
              </div>
              
              {isActive && (
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 ${colors.icon.replace('text-', 'bg-')} rounded-full animate-pulse`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span className="font-medium">
            {Math.round(((currentStageIndex + 1) / stages.length) * 100)}%
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
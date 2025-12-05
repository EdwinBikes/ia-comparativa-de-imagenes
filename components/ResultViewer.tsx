import React from 'react';
import { Download, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { UploadedImage, GenerationResult } from '../types';
import ComparisonSlider from './ComparisonSlider';
import Button from './Button';

interface ResultViewerProps {
  result: GenerationResult | null;
  uploadedImages: UploadedImage[];
  isProcessing: boolean;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ 
  result, 
  uploadedImages,
  isProcessing
}) => {
  
  if (isProcessing) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-dark-900/50 rounded-xl border border-dashed border-gray-700 animate-pulse">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-dark-800 border-t-brand-500 animate-spin mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center text-brand-500">
            <RefreshCw size={24} className="animate-pulse-fast" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">AI is Processing...</h3>
        <p className="text-gray-400 text-center max-w-sm">
          Generating your image. This usually takes 5-10 seconds depending on complexity.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-dark-900/50 rounded-xl border-2 border-dashed border-dark-800 text-gray-500">
        <div className="p-6 bg-dark-800 rounded-full mb-4 opacity-50">
          <ZoomIn size={48} />
        </div>
        <p className="text-lg font-medium">Ready to Create</p>
        <p className="text-sm">Upload an image and enter a prompt to start.</p>
      </div>
    );
  }

  // Determine if we can show a 1:1 comparison
  // Valid if we have exactly 1 uploaded image
  const canCompare = uploadedImages.length === 1;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-brand-500 rounded-full"></span>
          Result
        </h2>
        <a 
          href={result.imageUrl} 
          download={`lumina-ai-edit-${Date.now()}.png`}
          className="inline-flex"
        >
          <Button variant="secondary" icon={<Download size={16} />}>
            Download HD
          </Button>
        </a>
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-800 bg-dark-950 shadow-2xl min-h-[400px]">
        {canCompare ? (
          <ComparisonSlider 
            beforeImage={uploadedImages[0].previewUrl} 
            afterImage={result.imageUrl} 
          />
        ) : (
          <img 
            src={result.imageUrl} 
            alt="Generated Result" 
            className="w-full h-full object-contain"
          />
        )}
      </div>

      <div className="mt-4 p-4 bg-dark-800 rounded-lg border border-gray-700">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Applied Prompt</p>
        <p className="text-sm text-gray-100 italic">"{result.prompt}"</p>
      </div>
    </div>
  );
};

export default ResultViewer;
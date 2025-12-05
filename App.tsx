import React, { useState, useCallback } from 'react';
import { Wand2, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ResultViewer from './components/ResultViewer';
import HistoryBar from './components/HistoryBar';
import Button from './components/Button';
import { UploadedImage, GenerationResult, ProcessingStatus } from './types';
import { generateEditedImage } from './services/geminiService';

const SUGGESTED_PROMPTS = [
  "Enhance image quality and lighting",
  "Add a cinematic cyberpunk look",
  "Remove background and place in a studio",
  "Convert to a watercolor painting",
  "Make it look like a vintage 90s photo"
];

function App() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (uploadedImages.length === 0) {
      setErrorMsg("Please upload at least one image.");
      return;
    }
    if (!prompt.trim()) {
      setErrorMsg("Please enter an instruction for the AI.");
      return;
    }

    setErrorMsg(null);
    setStatus('processing');

    try {
      const generatedImageBase64 = await generateEditedImage(prompt, uploadedImages);
      
      const newResult: GenerationResult = {
        id: crypto.randomUUID(),
        imageUrl: generatedImageBase64,
        prompt: prompt,
        timestamp: Date.now(),
        originalImages: uploadedImages.map(img => img.previewUrl)
      };

      setCurrentResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 5)); // Keep last 5
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while communicating with the AI. Please try again.");
      setStatus('error');
    }
  };

  const restoreFromHistory = (item: GenerationResult) => {
    setCurrentResult(item);
    setPrompt(item.prompt);
    // Note: We don't restore the original images to the input here 
    // because we might not have the original Files anymore, only URLs.
    // UX decision: Just show the result.
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-200 selection:bg-brand-500/30">
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Lumina AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
             {/* Nav items could go here */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Upload Section */}
            <section className="bg-dark-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-2 mb-4 text-brand-500">
                <Layers size={20} />
                <h2 className="font-semibold text-white">Input Images</h2>
              </div>
              <ImageUploader 
                images={uploadedImages} 
                onImagesChange={setUploadedImages} 
                maxImages={2}
              />
            </section>

            {/* Prompt Section */}
            <section className="bg-dark-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
               <div className="flex items-center space-x-2 mb-4 text-purple-400">
                <Wand2 size={20} />
                <h2 className="font-semibold text-white">Magic Prompt</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                    Describe your edit
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Make the lighting more dramatic, combine these images into a collage..."
                    className="w-full h-32 bg-dark-800 border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent p-3 resize-none text-sm placeholder-gray-500 transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.slice(0, 3).map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(suggestion)}
                      className="text-[10px] bg-dark-800 hover:bg-dark-700 text-gray-400 px-2 py-1 rounded-md border border-gray-700 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-xs">
                    {errorMsg}
                  </div>
                )}

                <Button 
                  onClick={handleGenerate} 
                  isLoading={status === 'processing'}
                  className="w-full py-3 text-base"
                  icon={<Sparkles size={18} />}
                  disabled={uploadedImages.length === 0 || !prompt.trim()}
                >
                  {status === 'processing' ? 'Generating Magic...' : 'Generate Edit'}
                </Button>
              </div>
            </section>
          </div>

          {/* Right Panel: Preview */}
          <div className="lg:col-span-8 flex flex-col">
             <ResultViewer 
               result={currentResult} 
               uploadedImages={uploadedImages}
               isProcessing={status === 'processing'}
             />
             
             <HistoryBar 
               history={history} 
               onSelect={restoreFromHistory}
               selectedId={currentResult?.id}
             />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
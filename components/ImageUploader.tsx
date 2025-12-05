import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 2 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = [];
    // Only accept up to the remaining slots
    const remainingSlots = maxImages - images.length;
    const limit = Math.min(files.length, remainingSlots);

    for (let i = 0; i < limit; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      newImages.push({
        id: crypto.randomUUID(),
        file: file,
        previewUrl: URL.createObjectURL(file),
        mimeType: file.type
      });
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }

    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    const updated = images.filter(img => img.id !== id);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Source Images ({images.length}/{maxImages})
        </h3>
        {images.length > 0 && (
          <button 
            onClick={() => onImagesChange([])}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Existing Images */}
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-700 bg-dark-800">
            <img 
              src={img.previewUrl} 
              alt="Upload preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => removeImage(img.id)}
                className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Button Placeholder */}
        {images.length < maxImages && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-700 bg-dark-800/50 hover:bg-dark-800 hover:border-brand-500 hover:text-brand-500 text-gray-400 transition-all ${images.length === 0 ? 'col-span-2 aspect-[2/1]' : ''}`}
          >
            <div className="p-3 rounded-full bg-dark-900 mb-2">
              <Upload size={24} />
            </div>
            <span className="text-sm font-medium">Click to Upload</span>
            <span className="text-xs text-gray-500 mt-1">JPG or PNG</span>
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        multiple
        className="hidden"
      />
      
      {images.length === 0 && (
        <div className="text-xs text-gray-500 flex items-start space-x-2 bg-dark-800/50 p-3 rounded-lg">
          <ImageIcon size={14} className="mt-0.5 shrink-0" />
          <p>Upload 1 or 2 images to combine, edit, or enhance them using AI.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
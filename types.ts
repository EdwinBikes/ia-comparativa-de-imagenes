export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  base64?: string;
  mimeType: string;
}

export interface GenerationResult {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
  originalImages: string[]; // URLs of the source images used
}

export interface GeminiError {
  message: string;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

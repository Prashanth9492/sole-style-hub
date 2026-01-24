import { useState, useRef } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, ImagePlus } from 'lucide-react';

interface ImageUploadProps {
  onUploadComplete?: (url: string, publicId: string) => void;
  onMultipleUploadComplete?: (images: { url: string; publicId: string }[]) => void;
  folder?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

export const ImageUpload = ({
  onUploadComplete,
  onMultipleUploadComplete,
  folder = 'products',
  maxSize = 5,
  multiple = true,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate all files
    const validFiles: File[] = [];
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        setError(`${file.name} exceeds ${maxSize}MB limit`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setError(null);
    
    // Create previews for all valid files
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    try {
      setUploading(true);
      setUploadProgress({ current: 0, total: validFiles.length });
      
      const uploadedImages: { url: string; publicId: string }[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress({ current: i + 1, total: validFiles.length });
        
        const result = await uploadToCloudinary(file, folder);
        uploadedImages.push({ url: result.url, publicId: result.publicId });
        
        // Also call single upload callback for each image
        if (onUploadComplete) {
          onUploadComplete(result.url, result.publicId);
        }
      }

      // Call multiple upload callback with all images
      if (onMultipleUploadComplete && uploadedImages.length > 0) {
        onMultipleUploadComplete(uploadedImages);
      }

      // Clear previews after successful upload
      setPreviews([]);
    } catch (err) {
      setError('Failed to upload images. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setUploadProgress(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearPreviews = () => {
    setPreviews([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          uploading 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  Uploading... {uploadProgress?.current}/{uploadProgress?.total}
                </p>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ 
                      width: uploadProgress 
                        ? `${(uploadProgress.current / uploadProgress.total) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <ImagePlus className="w-7 h-7 text-gray-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {multiple ? 'Select multiple images at once' : 'Select an image'}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Choose Files
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {previews.length} image{previews.length > 1 ? 's' : ''} selected
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearPreviews}
              disabled={uploading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Maximum file size: {maxSize}MB. Supported formats: JPG, PNG, WEBP
      </p>
    </div>
  );
};

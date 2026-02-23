import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Upload, X, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  orderId: string;
  productName: string;
  productImage: string;
  onReviewSubmitted: () => void;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  isOpen,
  onClose,
  productId,
  orderId,
  productName,
  productImage,
  onReviewSubmitted
}) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'product_images');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('📸 Uploaded image URLs:', uploadedUrls);
      setImages([...images, ...uploadedUrls]);

      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'product_videos');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'}/video/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setVideos([...videos, ...uploadedUrls]);

      toast({
        title: 'Success',
        description: 'Videos uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload videos',
        variant: 'destructive',
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Error',
        description: 'Please write a review',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId,
        orderId,
        rating,
        title,
        comment,
        images,
        videos
      };
      console.log('📤 Submitting review with data:', reviewData);
      console.log('📸 Images being submitted:', images);
      
      await api.post('/reviews', reviewData);

      toast({
        title: 'Success',
        description: 'Review submitted successfully',
      });

      onReviewSubmitted();
      onClose();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src={productImage} 
              alt={productName}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{productName}</p>
              <p className="text-sm text-gray-600">Verified Purchase</p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label>Rating *</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 self-center">
                {rating > 0 && (
                  <>
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label>Review Title (Optional)</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience in one line"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div>
            <Label>Your Review *</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think about this product..."
              rows={5}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/1000</p>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Add Photos (Optional)</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <Upload className="w-5 h-5 mr-2" />
                <span className="text-sm">Upload Images (Max 5)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={images.length >= 5}
                />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <Label>Add Video (Optional)</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <Video className="w-5 h-5 mr-2" />
                <span className="text-sm">Upload Video (Max 1, up to 50MB)</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                  disabled={videos.length >= 1}
                />
              </label>

              {videos.length > 0 && (
                <div className="space-y-2">
                  {videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={video}
                        controls
                        className="w-full h-40 object-cover rounded"
                      />
                      <button
                        onClick={() => removeVideo(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;

# Cloudinary Integration Guide

## Configuration

Cloudinary has been integrated into your project with the following credentials:

- **Cloud Name**: djbvamtcx
- **API Key**: 292935288999799
- **API Secret**: ZpsUPnFNAE_e8cO9rU0wUKmrPjs

## Important: Create Upload Preset in Cloudinary

Before using the upload functionality, you need to create an **unsigned upload preset** in your Cloudinary dashboard:

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings** → **Upload**
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Set the following:
   - **Preset name**: `sole-style-uploads`
   - **Signing mode**: Unsigned
   - **Folder**: Leave blank or set default folder
   - **Access mode**: Public
6. Click **Save**

## Files Created

### Client-Side (Frontend)
- `src/lib/cloudinary.ts` - Cloudinary utilities and upload functions
- `src/components/ImageUpload.tsx` - Reusable image upload component

### Server-Side (Backend)
- `server/cloudinary.ts` - Server-side Cloudinary configuration
- `server/routes/cloudinary.ts` - API routes for image operations

### Environment Variables
- `.env` - Updated with Cloudinary credentials

## Usage Examples

### 1. Using the ImageUpload Component

```tsx
import { ImageUpload } from '@/components/ImageUpload';

function MyComponent() {
  const handleUploadComplete = (url: string, publicId: string) => {
    console.log('Image uploaded:', url);
    console.log('Public ID:', publicId);
    // Save url to your database or state
  };

  return (
    <div>
      <h2>Upload Product Image</h2>
      <ImageUpload
        onUploadComplete={handleUploadComplete}
        folder="products"
        maxSize={5}
      />
    </div>
  );
}
```

### 2. Direct Upload Function

```tsx
import { uploadToCloudinary } from '@/lib/cloudinary';

async function handleFileUpload(file: File) {
  try {
    const result = await uploadToCloudinary(file, 'products');
    console.log('Uploaded URL:', result.url);
    console.log('Public ID:', result.publicId);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### 3. Get Optimized Image URL

```tsx
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const optimizedUrl = getOptimizedImageUrl('your-public-id', {
  width: 800,
  height: 600,
  quality: 'auto',
  crop: 'fill',
  format: 'auto'
});

// Use in img tag
<img src={optimizedUrl} alt="Product" />
```

### 4. Delete Image (Backend API)

```tsx
import { deleteFromCloudinary } from '@/lib/cloudinary';

async function deleteImage(publicId: string) {
  try {
    await deleteFromCloudinary(publicId);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Delete failed:', error);
  }
}
```

## API Endpoints

### Upload Image
```
POST /api/cloudinary/upload
Body: { image: "base64-string", folder: "products" }
```

### Delete Image
```
POST /api/cloudinary/delete
Body: { publicId: "your-public-id" }
```

### Get Upload Signature
```
POST /api/cloudinary/signature
Body: { folder: "products" }
```

## Folder Structure in Cloudinary

Recommended folder structure:
- `products/` - Product images
- `categories/` - Category images
- `banners/` - Banner/hero images
- `users/` - User avatars/profiles

## Image Transformations

Cloudinary automatically optimizes images. You can add transformations:

```tsx
// Thumbnail (200x200, cropped)
getOptimizedImageUrl(publicId, { width: 200, height: 200, crop: 'thumb' })

// Large display (1200px wide, auto height)
getOptimizedImageUrl(publicId, { width: 1200, quality: 90 })

// WebP format for modern browsers
getOptimizedImageUrl(publicId, { format: 'webp', quality: 'auto' })
```

## Security Notes

⚠️ **Important**: 
- The API Secret is stored in `.env` and used only on the server
- Never expose API Secret in client-side code
- Use unsigned upload presets for client-side uploads
- For production, use signed uploads via your backend API

## Testing

1. Start your development server:
```bash
npm run dev
npm run server:watch
```

2. Use the ImageUpload component in any page
3. Select an image file
4. Check the console for the uploaded image URL
5. Verify the image appears in your Cloudinary dashboard

## Troubleshooting

### Upload fails with "Invalid upload preset"
- Make sure you created the `sole-style-uploads` preset in Cloudinary
- Ensure it's set to "Unsigned" mode

### CORS errors
- Check your Cloudinary dashboard Security settings
- Add your domain to allowed origins if needed

### Large file uploads timing out
- Increase the file size limit in `server/index.ts`
- Consider compressing images client-side before upload

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Presets Guide](https://cloudinary.com/documentation/upload_presets)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

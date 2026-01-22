import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'djbvamtcx',
  api_key: process.env.CLOUDINARY_API_KEY || '292935288999799',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZpsUPnFNAE_e8cO9rU0wUKmrPjs',
});

export default cloudinary;

/**
 * Upload image to Cloudinary from server
 * @param filePath - Path to the file or base64 string
 * @param folder - Folder name in Cloudinary
 */
export async function uploadImage(filePath: string, folder: string = 'products') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of public IDs
 */
export async function deleteMultipleImages(publicIds: string[]) {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Cloudinary bulk delete error:', error);
    throw error;
  }
}

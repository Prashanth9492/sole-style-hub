/**
 * Cloudinary Configuration and Upload Utilities
 */

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djbvamtcx',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '292935288999799',
  uploadPreset: 'sole-style-uploads', // You may need to create this in Cloudinary dashboard
};

/**
 * Upload image to Cloudinary
 * @param file - File object to upload
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with upload result
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'products'
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cloudinary error details:', errorData);
      throw new Error(`Failed to upload image to Cloudinary: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Generate optimized image URL with transformations
 * @param publicId - Public ID of the image in Cloudinary
 * @param transformations - Cloudinary transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformations: {
    width?: number;
    height?: number;
    quality?: string | number;
    crop?: string;
    format?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    crop = 'fill',
    format = 'auto',
  } = transformations;

  let transformString = `q_${quality},f_${format}`;

  if (width || height) {
    transformString += `,c_${crop}`;
    if (width) transformString += `,w_${width}`;
    if (height) transformString += `,h_${height}`;
  }

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Delete image from Cloudinary (requires backend API)
 * @param publicId - Public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // This should be called from your backend API for security
  // The API secret should never be exposed on the client side
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image from Cloudinary');
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Get Cloudinary widget configuration for direct uploads
 */
export function getCloudinaryWidget() {
  return {
    cloudName: cloudinaryConfig.cloudName,
    uploadPreset: cloudinaryConfig.uploadPreset,
    sources: ['local', 'url', 'camera'],
    multiple: false,
    maxFiles: 10,
    maxFileSize: 10000000, // 10MB
    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
    styles: {
      palette: {
        window: '#ffffff',
        sourceBg: '#f4f4f5',
        windowBorder: '#90a0b3',
        tabIcon: '#000000',
        inactiveTabIcon: '#555a5f',
        menuIcons: '#555a5f',
        link: '#0078FF',
        action: '#339933',
        inProgress: '#0078FF',
        complete: '#339933',
        error: '#cc0000',
        textDark: '#000000',
        textLight: '#fcfffd',
      },
    },
  };
}

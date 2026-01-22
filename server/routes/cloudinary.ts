import express from 'express';
import cloudinary, { uploadImage, deleteImage } from '../cloudinary';

const router = express.Router();

/**
 * Upload image endpoint
 * POST /api/cloudinary/upload
 */
router.post('/upload', async (req, res) => {
  try {
    const { image, folder } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const result = await uploadImage(image, folder || 'products');
    res.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

/**
 * Delete image endpoint
 * POST /api/cloudinary/delete
 */
router.post('/delete', async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    const result = await deleteImage(publicId);
    res.json(result);
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

/**
 * Get signature for direct client upload
 * POST /api/cloudinary/signature
 */
router.post('/signature', async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const { folder } = req.body;

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: folder || 'products',
      },
      process.env.CLOUDINARY_API_SECRET || 'ZpsUPnFNAE_e8cO9rU0wUKmrPjs'
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'djbvamtcx',
      apiKey: process.env.CLOUDINARY_API_KEY || '292935288999799',
    });
  } catch (error) {
    console.error('Signature error:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
});

export default router;

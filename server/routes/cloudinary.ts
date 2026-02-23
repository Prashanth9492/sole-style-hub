import express from 'express';
import cloudinary, { uploadImage, deleteImage } from '../cloudinary';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * Get all uploaded media
 * GET /api/cloudinary/media
 */
router.get('/media', authenticateAdmin, async (req, res) => {
  try {
    const { max_results = 100 } = req.query;
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: Number(max_results),
      resource_type: 'image'
    });

    const media = result.resources.map((resource: any) => ({
      _id: resource.public_id,
      url: resource.secure_url,
      publicId: resource.public_id,
      fileName: resource.public_id.split('/').pop() || resource.public_id,
      format: resource.format,
      size: resource.bytes,
      createdAt: resource.created_at
    }));

    res.json(media);
  } catch (error: any) {
    console.error('Error fetching media:', error);
    res.status(500).json({ 
      error: 'Failed to fetch media',
      message: error?.message || 'Unknown error'
    });
  }
});

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

    // Sanitize folder name (replace dashes with underscores for Cloudinary)
    const sanitizedFolder = (folder || 'products').replace(/-/g, '_');
    
    const result = await uploadImage(image, sanitizedFolder);
    res.json(result);
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      message: error?.message || 'Unknown error'
    });
  }
});

/**
 * Delete image endpoint (POST for backward compatibility)
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
 * Delete image endpoint (DELETE method)
 * DELETE /api/cloudinary/delete
 */
router.delete('/delete', async (req, res) => {
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

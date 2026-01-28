import express from 'express';
import { getDatabase } from '../db';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get all hero slides
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const slides = await db.collection('heroSlides').find({}).sort({ order: 1 }).toArray();
    res.json(slides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({ error: 'Failed to fetch hero slides' });
  }
});

// Get single hero slide
router.get('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const slide = await db.collection('heroSlides').findOne({ _id: new ObjectId(req.params.id) });
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }
    res.json(slide);
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    res.status(500).json({ error: 'Failed to fetch hero slide' });
  }
});

// Create hero slide
router.post('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const {
      name,
      tagline,
      description,
      price,
      originalPrice,
      image,
      color,
      accentColor,
      gradient,
      isActive,
      order
    } = req.body;

    const newSlide = {
      name,
      tagline,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice),
      image,
      color,
      accentColor: accentColor || '#f97316',
      gradient: gradient || 'from-orange-500/30 via-amber-400/15 to-transparent',
      isActive: isActive !== false,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('heroSlides').insertOne(newSlide);
    res.status(201).json({ _id: result.insertedId, ...newSlide });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    res.status(500).json({ error: 'Failed to create hero slide' });
  }
});

// Update hero slide
router.put('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const {
      name,
      tagline,
      description,
      price,
      originalPrice,
      image,
      color,
      accentColor,
      gradient,
      isActive,
      order
    } = req.body;

    const updateData = {
      name,
      tagline,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice),
      image,
      color,
      accentColor,
      gradient,
      isActive,
      order,
      updatedAt: new Date()
    };

    const result = await db.collection('heroSlides').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    res.json({ _id: req.params.id, ...updateData });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    res.status(500).json({ error: 'Failed to update hero slide' });
  }
});

// Delete hero slide
router.delete('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const result = await db.collection('heroSlides').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    res.status(500).json({ error: 'Failed to delete hero slide' });
  }
});

// Reorder slides
router.post('/reorder', async (req, res) => {
  try {
    const db = await getDatabase();
    const { slides } = req.body; // Array of { id, order }

    const bulkOps = slides.map((slide: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: new ObjectId(slide.id) },
        update: { $set: { order: slide.order, updatedAt: new Date() } }
      }
    }));

    await db.collection('heroSlides').bulkWrite(bulkOps);
    res.json({ message: 'Slides reordered successfully' });
  } catch (error) {
    console.error('Error reordering slides:', error);
    res.status(500).json({ error: 'Failed to reorder slides' });
  }
});

export default router;

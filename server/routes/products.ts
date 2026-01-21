import { Router, Request, Response } from 'express';
import { getDatabase } from '../db';
import { ObjectId } from 'mongodb';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const products = await db.collection('products').find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { id } = req.params;
    
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const product = req.body;
    
    const result = await db.collection('products').insertOne({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'Product created', 
      productId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { id } = req.params;
    const updates = req.body;
    
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { id } = req.params;
    
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { getDatabase } from '../db';
import { ObjectId } from 'mongodb';

const router = Router();

// Get all products with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { category, subcategory, search, inStock, isNew, isBestseller } = req.query;
    
    const query: any = {};
    
    if (category) query.category = category;
    if (subcategory) query.subCategory = subcategory;
    if (inStock === 'true') query.inStock = true;
    if (isNew === 'true') query.isNew = true;
    if (isBestseller === 'true') query.isBestseller = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await db.collection('products').find(query).toArray();
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
    const id = req.params.id as string;
    
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
    
    // Validate required fields
    if (!product.name || !product.category || !product.price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
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
    const id = req.params.id as string;
    const updates = req.body;
    
    delete updates._id; // Remove _id if present in updates
    
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
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const id = req.params.id as string;
    
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Bulk operations
router.post('/bulk/delete', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid product IDs' });
    }
    
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await db.collection('products').deleteMany({ 
      _id: { $in: objectIds } 
    });
    
    res.json({ 
      message: 'Products deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting products:', error);
    res.status(500).json({ error: 'Failed to delete products' });
  }
});

export default router;

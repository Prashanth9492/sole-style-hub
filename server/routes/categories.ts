import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db';
import { ICategory, collectionName } from '../models/Category';
import { authenticateAdmin } from '../middleware/auth';
import { generateSlug } from '../utils/helpers';

const router = express.Router();

// Get all categories (Public)
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { parent, active } = req.query;

    const filter: any = {};
    if (parent) filter.parentCategory = parent;
    if (active === 'true') filter.isActive = true;

    const categories = await db.collection(collectionName)
      .find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .toArray();

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by ID or slug (Public)
router.get('/categories/:identifier', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { identifier } = req.params;

    let category;
    if (ObjectId.isValid(identifier)) {
      category = await db.collection(collectionName).findOne({ _id: new ObjectId(identifier) });
    } else {
      category = await db.collection(collectionName).findOne({ slug: identifier });
    }

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create category (Admin)
router.post('/admin/categories', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { name, description, parentCategory, image, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = generateSlug(name);

    // Check if category with same slug already exists
    const existing = await db.collection(collectionName).findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    const category: ICategory = {
      name,
      slug,
      description,
      parentCategory,
      image,
      subCategories: [],
      isActive: true,
      sortOrder: sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(collectionName).insertOne(category);

    res.status(201).json({
      message: 'Category created successfully',
      category: { ...category, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (Admin)
router.put('/admin/categories/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const categoryId = new ObjectId(req.params.id);
    const { name, description, parentCategory, image, isActive, sortOrder } = req.body;

    const updateData: any = {
      updatedAt: new Date()
    };

    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (parentCategory !== undefined) updateData.parentCategory = parentCategory;
    if (image !== undefined) updateData.image = image;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: categoryId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully', category: result });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (Admin)
router.delete('/admin/categories/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const categoryId = new ObjectId(req.params.id);

    // Check if any products use this category
    const productsCount = await db.collection('products').countDocuments({
      $or: [
        { category: req.params.id },
        { subCategory: req.params.id }
      ]
    });

    if (productsCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category. ${productsCount} products are using this category.`
      });
    }

    const result = await db.collection(collectionName).deleteOne({ _id: categoryId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Add subcategory (Admin)
router.post('/admin/categories/:id/subcategories', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const categoryId = new ObjectId(req.params.id);
    const { name, image } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Subcategory name is required' });
    }

    const subCategory = {
      _id: new ObjectId(),
      name,
      slug: generateSlug(name),
      image,
      isActive: true
    };

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: categoryId },
      {
        $push: { subCategories: subCategory },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(201).json({
      message: 'Subcategory added successfully',
      category: result
    });
  } catch (error) {
    console.error('Error adding subcategory:', error);
    res.status(500).json({ error: 'Failed to add subcategory' });
  }
});

// Update subcategory (Admin)
router.put('/admin/categories/:id/subcategories/:subId', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const categoryId = new ObjectId(req.params.id);
    const subCategoryId = new ObjectId(req.params.subId);
    const { name, image, isActive } = req.body;

    const updateFields: any = {};
    if (name) {
      updateFields['subCategories.$.name'] = name;
      updateFields['subCategories.$.slug'] = generateSlug(name);
    }
    if (image !== undefined) updateFields['subCategories.$.image'] = image;
    if (isActive !== undefined) updateFields['subCategories.$.isActive'] = isActive;
    updateFields.updatedAt = new Date();

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: categoryId, 'subCategories._id': subCategoryId },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Category or subcategory not found' });
    }

    res.json({ message: 'Subcategory updated successfully', category: result });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ error: 'Failed to update subcategory' });
  }
});

// Delete subcategory (Admin)
router.delete('/admin/categories/:id/subcategories/:subId', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const categoryId = new ObjectId(req.params.id);
    const subCategoryId = new ObjectId(req.params.subId);

    // Check if any products use this subcategory
    const productsCount = await db.collection('products').countDocuments({
      subCategory: req.params.subId
    });

    if (productsCount > 0) {
      return res.status(400).json({
        error: `Cannot delete subcategory. ${productsCount} products are using this subcategory.`
      });
    }

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: categoryId },
      {
        $pull: { subCategories: { _id: subCategoryId } },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Subcategory deleted successfully', category: result });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
});

// Get category hierarchy (Public) - Useful for navigation menus
router.get('/categories/hierarchy/all', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const categories = await db.collection(collectionName)
      .find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .toArray();

    // Organize into hierarchy
    const hierarchy = {
      Men: [] as any[],
      Women: [] as any[],
      Kids: [] as any[]
    };

    categories.forEach((cat: any) => {
      if (cat.parentCategory && hierarchy[cat.parentCategory as keyof typeof hierarchy]) {
        hierarchy[cat.parentCategory as keyof typeof hierarchy].push(cat);
      }
    });

    res.json(hierarchy);
  } catch (error) {
    console.error('Error fetching category hierarchy:', error);
    res.status(500).json({ error: 'Failed to fetch category hierarchy' });
  }
});

export default router;

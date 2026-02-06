import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
  image?: string;
  subCategories: SubCategory[];
  isActive: boolean;
  sortOrder: number;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showSubCategoryDialog, setShowSubCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    image: '',
    sortOrder: 0,
    isActive: true
  });

  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory._id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingCategory ? 'Category updated' : 'Category created');
        setShowDialog(false);
        resetForm();
        fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleAddSubCategory = async () => {
    if (!selectedCategoryForSub) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${selectedCategoryForSub._id}/subcategories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(subCategoryForm)
      });

      if (response.ok) {
        toast.success('Subcategory added');
        setShowSubCategoryDialog(false);
        setSubCategoryForm({ name: '', image: '' });
        fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add subcategory');
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Failed to add subcategory');
    }
  };

  const handleDeleteSubCategory = async (categoryId: string, subCategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${categoryId}/subcategories/${subCategoryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Subcategory deleted');
        fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Failed to delete subcategory');
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentCategory: category.parentCategory || '',
      image: category.image || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      parentCategory: '',
      image: '',
      sortOrder: 0,
      isActive: true
    });
  };

  const groupedCategories = categories.reduce((acc, cat) => {
    const parent = cat.parentCategory || 'Other';
    if (!acc[parent]) acc[parent] = [];
    acc[parent].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories by Parent */}
      {['Men', 'Women', 'Kids', 'Other'].map(parent => (
        groupedCategories[parent] && groupedCategories[parent].length > 0 && (
          <Card key={parent}>
            <CardHeader>
              <CardTitle>{parent}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedCategories[parent].map(category => (
                  <div key={category._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Status: {category.isActive ? 'Active' : 'Inactive'} • Sort: {category.sortOrder}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategoryForSub(category);
                            setShowSubCategoryDialog(true);
                          }}
                        >
                          <FolderPlus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    {category.subCategories.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2">
                        <p className="text-sm font-medium mb-2">Subcategories:</p>
                        <div className="space-y-2">
                          {category.subCategories.map(sub => (
                            <div key={sub._id} className="flex items-center justify-between bg-accent/50 p-2 rounded">
                              <span className="text-sm">{sub.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSubCategory(category._id, sub._id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ))}

      {/* Add/Edit Category Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
              />
            </div>

            <div>
              <Label>Parent Category</Label>
              <Select
                value={formData.parentCategory}
                onValueChange={(value) => setFormData({ ...formData, parentCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Active</Label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={showSubCategoryDialog} onOpenChange={setShowSubCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory to {selectedCategoryForSub?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={subCategoryForm.name}
                onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                placeholder="Subcategory name"
              />
            </div>

            <div>
              <Label>Image URL (Optional)</Label>
              <Input
                value={subCategoryForm.image}
                onChange={(e) => setSubCategoryForm({ ...subCategoryForm, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSubCategoryDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubCategory}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

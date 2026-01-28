import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  GripVertical,
  Eye,
  EyeOff,
  Upload,
  Palette,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface HeroSlide {
  _id?: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  color: string;
  accentColor: string;
  gradient: string;
  isActive: boolean;
  order: number;
}

const defaultSlide: HeroSlide = {
  name: '',
  tagline: '',
  description: '',
  image: '',
  color: '',
  accentColor: '#f97316',
  gradient: 'from-orange-500/30 via-amber-400/15 to-transparent',
  isActive: true,
  order: 0,
};

const colorPresets = [
  { name: 'Orange', color: '#f97316', gradient: 'from-orange-500/30 via-amber-400/15 to-transparent' },
  { name: 'Blue', color: '#3b82f6', gradient: 'from-blue-600/20 via-cyan-500/10 to-transparent' },
  { name: 'Purple', color: '#8b5cf6', gradient: 'from-purple-600/20 via-violet-500/10 to-transparent' },
  { name: 'Green', color: '#10b981', gradient: 'from-emerald-600/20 via-teal-500/10 to-transparent' },
  { name: 'Red', color: '#ef4444', gradient: 'from-red-600/20 via-rose-500/10 to-transparent' },
  { name: 'Pink', color: '#ec4899', gradient: 'from-pink-600/20 via-rose-400/10 to-transparent' },
];

const HeroManagement = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState<HeroSlide>(defaultSlide);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch(`${apiUrl}/hero-slides`);
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch(`${apiUrl}/cloudinary/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, folder: 'hero_slides' }),
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ ...prev, image: data.url }));
          toast.success('Image uploaded successfully');
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.message || 'Failed to upload image');
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingSlide?._id 
        ? `${apiUrl}/hero-slides/${editingSlide._id}`
        : `${apiUrl}/hero-slides`;
      
      const method = editingSlide?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: editingSlide?._id ? formData.order : slides.length,
        }),
      });

      if (response.ok) {
        toast.success(editingSlide?._id ? 'Slide updated' : 'Slide created');
        fetchSlides();
        resetForm();
      } else {
        toast.error('Failed to save slide');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`${apiUrl}/hero-slides/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Slide deleted');
        fetchSlides();
      } else {
        toast.error('Failed to delete slide');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete slide');
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      const response = await fetch(`${apiUrl}/hero-slides/${slide._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slide, isActive: !slide.isActive }),
      });

      if (response.ok) {
        toast.success(slide.isActive ? 'Slide hidden' : 'Slide visible');
        fetchSlides();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const resetForm = () => {
    setFormData(defaultSlide);
    setEditingSlide(null);
    setShowForm(false);
  };

  const openEditForm = (slide: HeroSlide) => {
    setFormData(slide);
    setEditingSlide(slide);
    setShowForm(true);
  };

  const selectColorPreset = (preset: typeof colorPresets[0]) => {
    setFormData(prev => ({
      ...prev,
      accentColor: preset.color,
      gradient: preset.gradient,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Hero Slides</h1>
          <p className="text-gray-600 mt-1">Manage your homepage hero section slides</p>
        </div>
        <Button
          onClick={() => {
            setFormData(defaultSlide);
            setEditingSlide(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </Button>
      </div>

      {/* Slides List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading slides...</p>
        </div>
      ) : slides.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Hero Slides</h3>
          <p className="text-gray-500 mb-4">Add your first hero slide to get started</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Slide
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {slides.map((slide, index) => (
            <motion.div
              key={slide._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 ${!slide.isActive ? 'opacity-60' : ''}`}>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image Preview */}
                  <div className="relative w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {slide.image ? (
                      <img
                        src={slide.image}
                        alt={slide.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div
                      className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: slide.accentColor }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg truncate">{slide.name || 'Untitled'}</h3>
                        <p className="text-sm text-gray-500">{slide.tagline}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{slide.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${slide.accentColor}20`,
                          color: slide.accentColor,
                        }}
                      >
                        {slide.color}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActive(slide)}
                      title={slide.isActive ? 'Hide' : 'Show'}
                    >
                      {slide.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditForm(slide)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => slide._id && handleDelete(slide._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b flex items-center justify-between z-10">
                <h2 className="text-xl font-bold">
                  {editingSlide?._id ? 'Edit Slide' : 'Add New Slide'}
                </h2>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <Label>Shoe Image</Label>
                  <div className="mt-2 flex flex-col items-center gap-4">
                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon className="w-12 h-12 mb-2" />
                          <p className="text-sm">No image uploaded</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button type="button" variant="outline" disabled={uploading} asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </span>
                        </Button>
                      </label>
                      {formData.image && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Use PNG with transparent background for best results
                    </p>
                  </div>
                </div>

                {/* Name & Tagline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Shoe Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Velocity X"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline *</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="e.g., Unleash Your Speed"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the shoe features..."
                    rows={3}
                    required
                  />
                </div>

                {/* Color Name */}
                <div>
                  <Label htmlFor="color">Color Name *</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="e.g., Sunrise Orange"
                    required
                  />
                </div>

                {/* Color Theme */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Theme
                  </Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => selectColorPreset(preset)}
                        className={`px-3 py-2 rounded-lg border-2 transition-all ${
                          formData.accentColor === preset.color
                            ? 'border-gray-900 dark:border-white'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.color }}
                          />
                          <span className="text-sm font-medium">{preset.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Label htmlFor="accentColor" className="text-xs">Custom:</Label>
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <span className="text-xs text-gray-500">{formData.accentColor}</span>
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label>Active</Label>
                    <p className="text-sm text-gray-500">Show this slide in the hero section</p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : editingSlide?._id ? 'Update Slide' : 'Create Slide'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroManagement;

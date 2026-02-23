import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Upload, Trash2, Search, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface MediaFile {
  _id: string;
  url: string;
  publicId: string;
  fileName: string;
  format: string;
  size: number;
  createdAt: string;
}

export default function MediaManagement() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = media.filter(item =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMedia(filtered);
    } else {
      setFilteredMedia(media);
    }
  }, [searchQuery, media]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${API_URL}/cloudinary/media`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMedia(data);
        setFilteredMedia(data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

      const response = await fetch(`${API_URL}/cloudinary/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      toast.success('File uploaded successfully');
      setShowUploadDialog(false);
      setSelectedFile(null);
      fetchMedia();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

      const response = await fetch(`${API_URL}/cloudinary/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publicId })
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast.success('File deleted successfully');
      fetchMedia();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Media Library</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage uploaded images and files</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)} className="w-full sm:w-auto">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
            Media Files ({filteredMedia.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading media...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No media files found</p>
              <Button onClick={() => setShowUploadDialog(true)} className="mt-4">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First File
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredMedia.map((file) => (
                <div
                  key={file._id}
                  className="group relative border rounded-lg overflow-hidden bg-gray-50 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative">
                    <img
                      src={file.url}
                      alt={file.fileName}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => {
                        setSelectedImage(file);
                        setShowViewDialog(true);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedImage(file);
                          setShowViewDialog(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(file.url)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedUrl === file.url ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(file.publicId)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.format.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadDialog(false);
                setSelectedFile(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full sm:w-auto"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.fileName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-muted-foreground">File Name</Label>
                  <p className="font-medium break-all">{selectedImage.fileName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Format</Label>
                  <p className="font-medium">{selectedImage.format.toUpperCase()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Size</Label>
                  <p className="font-medium">{formatFileSize(selectedImage.size)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Uploaded</Label>
                  <p className="font-medium">
                    {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={selectedImage.url} readOnly className="text-xs" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedImage.url)}
                  >
                    {copiedUrl === selectedImage.url ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

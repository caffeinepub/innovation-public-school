import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useGetAllGalleryItems,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
} from '../../../hooks/useQueries';
import { toast } from 'sonner';
import type { GalleryItem } from '../../../backend';
import { ExternalBlob } from '../../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const categories = ['Events', 'Classrooms', 'Sports', 'Cultural Programs'];

export default function GalleryManager() {
  const { data: items = [] } = useGetAllGalleryItems();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const deleteItem = useDeleteGalleryItem();

  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newItem, setNewItem] = useState<{
    title: string;
    category: string;
    isActive: boolean;
    imageFile: File | null;
  }>({
    title: '',
    category: 'Events',
    isActive: true,
    imageFile: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewItem({ ...newItem, imageFile: file });
    }
  };

  const handleCreate = async () => {
    if (!newItem.title || !newItem.imageFile) {
      toast.error('Please provide title and image');
      return;
    }

    try {
      const arrayBuffer = await newItem.imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const item: GalleryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: newItem.title,
        category: newItem.category,
        image: blob,
        isActive: newItem.isActive,
      };

      await createItem.mutateAsync(item);
      toast.success('Gallery item created successfully');
      setIsCreateDialogOpen(false);
      setNewItem({ title: '', category: 'Events', isActive: true, imageFile: null });
      setUploadProgress(0);
    } catch (error) {
      toast.error('Failed to create gallery item');
    }
  };

  const handleUpdate = async (item: GalleryItem) => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        title: item.title,
        category: item.category,
        isActive: item.isActive,
      });
      toast.success('Gallery item updated successfully');
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update gallery item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      await deleteItem.mutateAsync(id);
      toast.success('Gallery item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
              <DialogDescription>Upload a new image to the gallery.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-title">Title</Label>
                <Input
                  id="new-title"
                  placeholder="Image title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger id="new-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-image">Image</Label>
                <Input
                  id="new-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {newItem.imageFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {newItem.imageFile.name}
                  </p>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <Label>Upload Progress</Label>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="new-active"
                  checked={newItem.isActive}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, isActive: checked })}
                />
                <Label htmlFor="new-active">Active</Label>
              </div>
              <Button onClick={handleCreate} disabled={createItem.isPending}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border overflow-hidden">
            <img
              src={item.image.getDirectURL()}
              alt={item.title}
              className="h-48 w-full object-cover"
            />
            {editingItem?.id === item.id ? (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editingItem.category}
                    onValueChange={(value) =>
                      setEditingItem({ ...editingItem, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.isActive}
                    onCheckedChange={(checked) =>
                      setEditingItem({ ...editingItem, isActive: checked })
                    }
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(editingItem)}
                    disabled={updateItem.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingItem(null)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      item.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useGetAllContentSections,
  useCreateContentSection,
  useUpdateContentSection,
  useDeleteContentSection,
} from '../../../hooks/useQueries';
import { toast } from 'sonner';
import type { ContentSection } from '../../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ContentManager() {
  const { data: sections = [] } = useGetAllContentSections();
  const createSection = useCreateContentSection();
  const updateSection = useUpdateContentSection();
  const deleteSection = useDeleteContentSection();

  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSection, setNewSection] = useState<ContentSection>({
    id: '',
    title: '',
    body: '',
    isPublished: true,
  });

  const handleCreate = async () => {
    if (!newSection.id || !newSection.title) {
      toast.error('Please fill in ID and title');
      return;
    }

    try {
      await createSection.mutateAsync(newSection);
      toast.success('Section created successfully');
      setIsCreateDialogOpen(false);
      setNewSection({ id: '', title: '', body: '', isPublished: true });
    } catch (error) {
      toast.error('Failed to create section');
    }
  };

  const handleUpdate = async (section: ContentSection) => {
    try {
      await updateSection.mutateAsync({
        id: section.id,
        title: section.title,
        body: section.body,
        isPublished: section.isPublished,
      });
      toast.success('Section updated successfully');
      setEditingSection(null);
    } catch (error) {
      toast.error('Failed to update section');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await deleteSection.mutateAsync(id);
      toast.success('Section deleted successfully');
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Section</DialogTitle>
              <DialogDescription>Add a new content section to your website.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-id">Section ID</Label>
                <Input
                  id="new-id"
                  placeholder="e.g., home-about"
                  value={newSection.id}
                  onChange={(e) => setNewSection({ ...newSection, id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-title">Title</Label>
                <Input
                  id="new-title"
                  placeholder="Section title"
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-body">Content</Label>
                <Textarea
                  id="new-body"
                  placeholder="Section content"
                  rows={6}
                  value={newSection.body}
                  onChange={(e) => setNewSection({ ...newSection, body: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="new-published"
                  checked={newSection.isPublished}
                  onCheckedChange={(checked) => setNewSection({ ...newSection, isPublished: checked })}
                />
                <Label htmlFor="new-published">Published</Label>
              </div>
              <Button onClick={handleCreate} disabled={createSection.isPending}>
                Create Section
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="rounded-lg border p-4">
            {editingSection?.id === section.id ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editingSection.title}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    rows={8}
                    value={editingSection.body}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, body: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingSection.isPublished}
                    onCheckedChange={(checked) =>
                      setEditingSection({ ...editingSection, isPublished: checked })
                    }
                  />
                  <Label>Published</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(editingSection)}
                    disabled={updateSection.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingSection(null)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">ID: {section.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSection(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{section.body}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      section.isPublished
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {section.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

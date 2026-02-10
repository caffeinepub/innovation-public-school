import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  useGetAllContentSections,
  useCreateContentSection,
  useUpdateContentSection,
  useDeleteContentSection,
} from '../../../hooks/useQueries';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../utils/errorMessage';
import type { ContentSection } from '../../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { defaultContentSections } from '../../../content/defaultContent';

type MergedSection = ContentSection & {
  isFromBackend: boolean;
};

export default function ContentManager() {
  const { data: backendSections = [] } = useGetAllContentSections();
  const createSection = useCreateContentSection();
  const updateSection = useUpdateContentSection();
  const deleteSection = useDeleteContentSection();

  const [editingSection, setEditingSection] = useState<MergedSection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSection, setNewSection] = useState<ContentSection>({
    id: '',
    title: '',
    body: '',
    isPublished: true,
  });

  // Merge backend sections with default sections
  const mergedSections = useMemo((): MergedSection[] => {
    const backendMap = new Map(backendSections.map((s) => [s.id, s]));
    const merged: MergedSection[] = [];

    // Add all default sections, preferring backend version if exists
    defaultContentSections.forEach((defaultSection) => {
      const backendVersion = backendMap.get(defaultSection.id);
      if (backendVersion) {
        merged.push({ ...backendVersion, isFromBackend: true });
        backendMap.delete(defaultSection.id);
      } else {
        merged.push({ ...defaultSection, isFromBackend: false });
      }
    });

    // Add any backend sections that aren't in defaults
    backendMap.forEach((section) => {
      merged.push({ ...section, isFromBackend: true });
    });

    // Sort by title
    return merged.sort((a, b) => a.title.localeCompare(b.title));
  }, [backendSections]);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return mergedSections;
    }
    const query = searchQuery.toLowerCase();
    return mergedSections.filter(
      (section) =>
        section.id.toLowerCase().includes(query) ||
        section.title.toLowerCase().includes(query)
    );
  }, [mergedSections, searchQuery]);

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
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdate = async (section: MergedSection) => {
    try {
      if (section.isFromBackend) {
        // Update existing backend section
        await updateSection.mutateAsync({
          id: section.id,
          title: section.title,
          body: section.body,
          isPublished: section.isPublished,
        });
      } else {
        // Create new backend section from default
        await createSection.mutateAsync({
          id: section.id,
          title: section.title,
          body: section.body,
          isPublished: section.isPublished,
        });
      }
      toast.success('Section saved successfully');
      setEditingSection(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (section: MergedSection) => {
    if (!section.isFromBackend) {
      toast.error('Cannot delete default sections that haven\'t been saved yet');
      return;
    }

    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await deleteSection.mutateAsync(section.id);
      toast.success('Section deleted successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
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
                  value={newSection.body}
                  onChange={(e) => setNewSection({ ...newSection, body: e.target.value })}
                  rows={6}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="new-published"
                  checked={newSection.isPublished}
                  onCheckedChange={(checked) =>
                    setNewSection({ ...newSection, isPublished: checked })
                  }
                />
                <Label htmlFor="new-published">Published</Label>
              </div>
              <Button onClick={handleCreate} disabled={createSection.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {createSection.isPending ? 'Creating...' : 'Create Section'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredSections.map((section) => (
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
                    value={editingSection.body}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, body: e.target.value })
                    }
                    rows={6}
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
                    disabled={updateSection.isPending || createSection.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateSection.isPending || createSection.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingSection(null)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{section.title}</h3>
                      {section.isPublished ? (
                        <Badge variant="default">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                      {!section.isFromBackend && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">ID: {section.id}</p>
                    <p className="text-sm line-clamp-2">{section.body}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSection(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {section.isFromBackend && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(section)}
                        disabled={deleteSection.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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

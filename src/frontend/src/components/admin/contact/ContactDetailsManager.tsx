import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useGetContactDetails,
  useUpdateContactDetails,
} from '../../../hooks/useQueries';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../utils/errorMessage';
import type { ContactDetails } from '../../../backend';

export default function ContactDetailsManager() {
  const { data: contactDetails, isLoading: isLoadingDetails } = useGetContactDetails();
  const updateDetails = useUpdateContactDetails();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<ContactDetails>({
    address: '',
    phone: '',
    email: '',
    mapEmbed: '',
    displayMap: true,
  });

  useEffect(() => {
    if (contactDetails) {
      setFormData(contactDetails);
    }
  }, [contactDetails]);

  const handleSave = async () => {
    // Prevent double-submit
    if (isSaving || updateDetails.isPending) {
      return;
    }

    setIsSaving(true);
    try {
      await updateDetails.mutateAsync(formData);
      toast.success('Contact details updated successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">Loading contact details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mapEmbed">Map Embed URL</Label>
          <Input
            id="mapEmbed"
            type="url"
            value={formData.mapEmbed}
            onChange={(e) => setFormData({ ...formData, mapEmbed: e.target.value })}
            placeholder="https://maps.google.com/?q=..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="displayMap"
            checked={formData.displayMap}
            onCheckedChange={(checked) => setFormData({ ...formData, displayMap: checked })}
          />
          <Label htmlFor="displayMap">Display Map on Contact Page</Label>
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving || updateDetails.isPending}>
        <Save className="mr-2 h-4 w-4" />
        {isSaving || updateDetails.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}

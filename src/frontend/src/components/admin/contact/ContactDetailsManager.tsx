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
import type { ContactDetails } from '../../../backend';

export default function ContactDetailsManager() {
  const { data: contactDetails } = useGetContactDetails();
  const updateDetails = useUpdateContactDetails();

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
    try {
      await updateDetails.mutateAsync(formData);
      toast.success('Contact details updated successfully');
    } catch (error) {
      toast.error('Failed to update contact details');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
          <Label htmlFor="mapEmbed">Google Map Embed URL</Label>
          <Input
            id="mapEmbed"
            type="url"
            placeholder="https://maps.google.com/..."
            value={formData.mapEmbed}
            onChange={(e) => setFormData({ ...formData, mapEmbed: e.target.value })}
          />
          <p className="text-sm text-muted-foreground">
            Get the embed URL from Google Maps (Share → Embed a map)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="displayMap"
            checked={formData.displayMap}
            onCheckedChange={(checked) => setFormData({ ...formData, displayMap: checked })}
          />
          <Label htmlFor="displayMap">Display map on Contact page</Label>
        </div>
      </div>

      <Button onClick={handleSave} disabled={updateDetails.isPending}>
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
}

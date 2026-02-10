import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, FileText, Image, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentManager from '../../components/admin/content/ContentManager';
import GalleryManager from '../../components/admin/gallery/GalleryManager';
import EnquiriesManager from '../../components/admin/enquiries/EnquiriesManager';
import ContactDetailsManager from '../../components/admin/contact/ContactDetailsManager';
import { useAdminSession } from '../../hooks/useAdminSession';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAdminSession();
  const [activeTab, setActiveTab] = useState('content');

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your website content and settings
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Enquiries</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <ContentManager />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="enquiries" className="space-y-4">
            <EnquiriesManager />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <ContactDetailsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

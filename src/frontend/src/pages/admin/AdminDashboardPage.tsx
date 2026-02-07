import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, Mail, BarChart3, Phone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import ContentManager from '../../components/admin/content/ContentManager';
import GalleryManager from '../../components/admin/gallery/GalleryManager';
import EnquiriesManager from '../../components/admin/enquiries/EnquiriesManager';
import ContactDetailsManager from '../../components/admin/contact/ContactDetailsManager';
import AnalyticsPanel from '../../components/admin/analytics/AnalyticsPanel';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('content');
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Admin Dashboard - Innovation Public School';
  }, []);

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate({ to: '/' });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your school website content</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Enquiries</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Edit text content for all pages. Changes will be reflected immediately on the website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove gallery images. Organize them by category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GalleryManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enquiries">
            <Card>
              <CardHeader>
                <CardTitle>Enquiries</CardTitle>
                <CardDescription>
                  View and manage enquiries submitted through admission and contact forms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnquiriesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>
                  Update school contact information and map settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactDetailsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View visitor statistics and website metrics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

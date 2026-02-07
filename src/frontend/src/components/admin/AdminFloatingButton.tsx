import { Shield } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AdminLoginModal from './AdminLoginModal';

export default function AdminFloatingButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110"
        title="Admin Panel"
      >
        <Shield className="h-6 w-6" />
        <span className="sr-only">Admin Panel</span>
      </Button>

      <AdminLoginModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}

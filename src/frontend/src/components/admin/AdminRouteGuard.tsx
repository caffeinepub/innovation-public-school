import { ReactNode, useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import AdminLoginModal from './AdminLoginModal';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, isCheckingAdmin } = useAdminAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
            <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">
              You need admin credentials to access this page.
            </p>
            <Button onClick={() => setShowLoginModal(true)} className="mt-6">
              Login as Admin
            </Button>
          </div>
        </div>
        <AdminLoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </>
    );
  }

  return <>{children}</>;
}

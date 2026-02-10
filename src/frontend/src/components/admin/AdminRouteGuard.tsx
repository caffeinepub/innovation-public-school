import { ReactNode } from 'react';
import { Loader2, ShieldAlert, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AdminLoginModal from './AdminLoginModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, isCheckingAuth, validationError, retryValidation } = useAdminAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Show loading only when actively checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show error state if validation failed due to backend/network issues
  if (validationError && validationError.type !== 'invalid') {
    return (
      <>
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{validationError.message}</AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              <Button onClick={retryValidation} className="w-full">
                Retry Connection
              </Button>
              <Button onClick={() => setShowLoginModal(true)} variant="outline" className="w-full">
                Login Again
              </Button>
            </div>
          </div>
        </div>
        <AdminLoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </>
    );
  }

  // Show login prompt if not authenticated (including invalid/expired sessions)
  if (!isAuthenticated) {
    return (
      <>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
            <h2 className="mt-4 text-2xl font-bold">Authentication Required</h2>
            <p className="mt-2 text-muted-foreground">
              {validationError?.type === 'invalid' 
                ? validationError.message 
                : 'Please log in with your username and password to access the admin dashboard.'}
            </p>
            <Button onClick={() => setShowLoginModal(true)} className="mt-6">
              Login
            </Button>
          </div>
        </div>
        <AdminLoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </>
    );
  }

  return <>{children}</>;
}

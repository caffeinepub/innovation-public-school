import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { toast } from 'sonner';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, login, loginStatus } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    const success = await login(username, password);
    
    if (success) {
      toast.success('Login successful');
      onOpenChange(false);
      navigate({ to: '/admin' });
    } else {
      toast.error('Invalid credentials');
      setPassword('');
    }
  };

  // If already authenticated, close modal and redirect
  if (isAuthenticated) {
    if (open) {
      onOpenChange(false);
      navigate({ to: '/admin' });
    }
    return null;
  }

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Panel Login</DialogTitle>
          <DialogDescription>
            Enter your credentials to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoggingIn}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoggingIn) {
                  handleLogin();
                }
              }}
              disabled={isLoggingIn}
              autoComplete="current-password"
            />
          </div>

          <Button onClick={handleLogin} disabled={isLoggingIn || !username || !password} className="w-full">
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

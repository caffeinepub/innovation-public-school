import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import AdminFloatingButton from '../admin/AdminFloatingButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';
import { usePageViewTracking } from '../../hooks/usePageViewTracking';

export default function SiteLayout() {
  usePageViewTracking();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AdminFloatingButton />
      <ProfileSetupModal />
    </div>
  );
}

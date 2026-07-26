import { Outlet, useLocation } from 'react-router-dom';
import PublicMotionLayout from '../components/PublicMotionLayout';

export default function Root() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return <PublicMotionLayout />;
}

import { type ReactNode } from 'react';
import { CalendarCheck, Inbox, LogOut, Mail, Tags } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab?: string;
  counts?: {
    bookings?: number;
    contacts?: number;
    activities?: number;
    categories?: number;
  };
}

const navItems = [
  { id: 'bookings', label: 'Booking Requests', icon: Inbox },
  { id: 'contacts', label: 'Contact Requests', icon: Mail },
  { id: 'activities', label: 'Activities CRUD', icon: CalendarCheck },
  { id: 'categories', label: 'Activity Categories', icon: Tags },
];

function getActiveId(pathname: string) {
  if (pathname.startsWith('/admin/activities/')) return 'activities';
  return null;
}

export default function AdminLayout({ children, activeTab, counts }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const routeActiveId = getActiveId(location.pathname);

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--dark-page)] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-gray-200 bg-white px-4 py-5 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)] lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:border-b-0 lg:border-r">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[var(--navy)] dark:text-white">Admin</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Hurghada French Guide
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {navItems.map((item) => {
            const isActive = (activeTab ?? routeActiveId) === item.id;
            const count = counts?.[item.id as keyof NonNullable<AdminLayoutProps['counts']>] ?? 0;

            return (
              <Link
                key={item.id}
                to={`/admin?tab=${item.id}`}
                className={`flex min-w-max items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors lg:min-w-0 ${
                  isActive
                    ? 'bg-[var(--teal)] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--teal)] dark:text-gray-300 dark:hover:bg-[var(--dark-muted)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-[var(--dark-muted)] dark:text-gray-200'
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-5 flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-[var(--dark-muted)]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

import { type ReactNode, useEffect, useState } from 'react';
import { CalendarCheck, Inbox, LogOut, Mail, Menu, Tags, X } from 'lucide-react';
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
  const currentActiveId = activeTab ?? routeActiveId;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login', { replace: true });
  };

  const renderNavItems = () =>
    navItems.map((item) => {
      const isActive = currentActiveId === item.id;
      const count = counts?.[item.id as keyof NonNullable<AdminLayoutProps['counts']>] ?? 0;

      return (
        <Link
          key={item.id}
          to={`/admin?tab=${item.id}`}
          className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors ${
            isActive
              ? 'bg-[var(--teal)] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--teal)] dark:text-gray-300 dark:hover:bg-[var(--dark-muted)]'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="min-w-0 break-words">{item.label}</span>
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-[var(--dark-muted)] dark:text-gray-200'
            }`}
          >
            {count}
          </span>
        </Link>
      );
    });

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 dark:bg-[var(--dark-page)] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)] sm:px-6 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:border-[var(--teal)] hover:text-[var(--teal)] dark:border-gray-700 dark:text-gray-200"
            aria-label="Open admin navigation"
            aria-expanded={isDrawerOpen}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-[var(--navy)] dark:text-white">
              Admin
            </h1>
            <p className="truncate text-xs text-gray-500 dark:text-gray-300">
              Hurghada French Guide
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900/60 dark:hover:bg-red-950/20"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-x-0 bottom-0 top-36 z-[45] lg:hidden">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/50"
            aria-label="Close admin navigation"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,calc(100vw-3rem))] flex-col gap-5 border-r border-gray-200 bg-white px-4 py-5 shadow-2xl dark:border-gray-700 dark:bg-[var(--dark-card)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-[var(--navy)] dark:text-white">Admin</h1>
                <p className="mt-1 break-words text-sm text-gray-500 dark:text-gray-300">
                  Hurghada French Guide
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[var(--teal)] hover:text-[var(--teal)] dark:border-gray-700 dark:text-gray-200"
                aria-label="Close admin navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="grid gap-2">{renderNavItems()}</nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900/60 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </aside>
        </div>
      )}

      <aside className="hidden flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)] sm:px-6 lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
        <div className="min-w-0">
          <div className="mb-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[var(--navy)] dark:text-white">Admin</h1>
              <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-300 sm:whitespace-normal">
                Hurghada French Guide
              </p>
            </div>
          </div>

          <nav className="grid gap-2">{renderNavItems()}</nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="hidden items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900/60 dark:hover:bg-red-950/20 lg:mt-auto lg:flex lg:w-full lg:justify-start"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

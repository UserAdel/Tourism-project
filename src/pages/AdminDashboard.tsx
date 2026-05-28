import { type Dispatch, type FormEvent, type SetStateAction, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  Edit3,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  type AdminBookingRequest,
  type AdminContactRequest,
  useAdminDashboard,
  useCreateAdminActivity,
  useCreateAdminCategory,
  useDeleteContactRequest,
  useUpdateAdminActivity,
  useUpdateAdminCategory,
  useUpdateBookingRequest,
  useUpdateContactRequest,
} from '../hooks/queries';
import ActivityFormModal, {
  type ActivityFormState,
  activityToForm,
  defaultCategories,
  emptyActivityForm,
  formToActivity,
  getVideoReviewThumbnailFiles,
  getVideoThumbnailFiles,
} from '../components/admin/ActivityFormModal';
import AdminLayout from '../components/admin/AdminLayout';
import ConfirmActionModal from '../components/admin/ConfirmActionModal';
import { getPrimaryPrice } from '../utils/pricing';

type AdminTab = 'bookings' | 'contacts' | 'activities' | 'categories';

interface ConfirmAction {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
}

interface CategoryFormState {
  nameEn: string;
  nameFr: string;
  isActive: boolean;
}

const emptyCategoryForm: CategoryFormState = {
  nameEn: '',
  nameFr: '',
  isActive: true,
};

function slugifyCategoryName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const bookingStatuses: AdminBookingRequest['status'][] = [
  'new',
  'contacted',
  'confirmed',
  'cancelled',
];

const contactStatuses: AdminContactRequest['status'][] = [
  'new',
  'read',
  'replied',
  'archived',
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function statusClass(status: string) {
  if (status === 'new') return 'bg-blue-50 text-blue-800 border-blue-200';
  if (status === 'pending') return 'bg-yellow-50 text-yellow-800 border-yellow-200';
  if (status === 'confirmed' || status === 'replied') {
    return 'bg-green-50 text-green-800 border-green-200';
  }
  if (status === 'cancelled' || status === 'archived') {
    return 'bg-red-50 text-red-800 border-red-200';
  }
  return 'bg-orange-50 text-orange-800 border-orange-200';
}

function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: AdminBookingRequest | null;
  onClose: () => void;
}) {
  if (!booking) return null;

  const detailGroups = [
    {
      title: 'Guest',
      rows: [
        ['Name', booking.fullName],
        ['Nationality', booking.nationality],
        ['Language', booking.language.toUpperCase()],
        ['Submitted', formatDate(booking.createdAt)],
      ],
    },
    {
      title: 'Trip',
      rows: [
        ['Activity', booking.activityName],
        ['Activity slug', booking.selectedActivity],
        ['Preferred date', booking.preferredDate],
        ['Guests', `${booking.adults} adults, ${booking.children} children`],
        ['Arrival date', booking.arrivalDate],
      ],
    },
    {
      title: 'Contact',
      rows: [
        ['Phone', booking.phone],
        ['WhatsApp', booking.whatsapp],
        ['Email', booking.email],
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:items-center">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-[var(--dark-card)]">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[var(--navy)] dark:text-white sm:text-xl">
              Booking Details
            </h2>
            <p className="mt-1 break-words text-sm text-gray-500 dark:text-gray-300">
              {booking.fullName} · {booking.activityName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
            aria-label="Close booking details"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-84px)] overflow-y-auto px-5 py-5">
          <div className="grid gap-5 md:grid-cols-2">
            {detailGroups.map((group) => (
              <section key={group.title}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                  {group.title}
                </h3>
                <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                  {group.rows.map(([label, value]) => (
                    <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        {label}
                      </dt>
                      <dd className="break-words text-sm text-gray-900 dark:text-white">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <section className="mt-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Notes
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Special requests
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                  {booking.specialRequests || 'No special requests.'}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Admin notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                  {booking.adminNotes || 'No admin notes.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function CategoryFormModal({
  form,
  isEditing,
  isOpen,
  isSaving,
  onClose,
  onSubmit,
  setCategoryForm,
}: {
  form: CategoryFormState;
  isEditing: boolean;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setCategoryForm: Dispatch<SetStateAction<CategoryFormState>>;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:px-4 sm:py-6">
      <form
        onSubmit={onSubmit}
        className="flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-lg bg-white shadow-xl dark:bg-[var(--dark-card)] sm:max-h-[calc(100dvh-2rem)] sm:rounded-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-5">
          <div className="min-w-0">
            <h2 className="break-words text-lg font-bold text-[var(--navy)] dark:text-white sm:text-xl">
              {isEditing ? 'Edit Category' : 'Create Category'}
            </h2>
            <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-300">
              Add the category names used across activities.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
            aria-label="Close category form"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <button
            type="button"
            role="switch"
            aria-checked={form.isActive}
            onClick={() =>
              setCategoryForm((current) => ({
                ...current,
                isActive: !current.isActive,
              }))
            }
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-3 text-left hover:border-[var(--teal)] dark:border-gray-700"
          >
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Active
            </span>
            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                form.isActive ? 'bg-[var(--teal)]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  form.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </span>
          </button>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              English Name
            </span>
            <input
              value={form.nameEn}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, nameEn: event.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              French Name
            </span>
            <input
              value={form.nameFr}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, nameFr: event.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
            />
          </label>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isEditing ? 'Save Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const activeTab: AdminTab =
    requestedTab === 'contacts' || requestedTab === 'activities' || requestedTab === 'categories'
      ? requestedTab
      : 'bookings';
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityForm, setActivityForm] = useState<ActivityFormState>(emptyActivityForm);
  const [activitySearch, setActivitySearch] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingRequest | null>(null);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingTypeFilter, setBookingTypeFilter] = useState<AdminBookingRequest['status'] | 'all'>(
    'all'
  );
  const [bookingDateFrom, setBookingDateFrom] = useState('');
  const [bookingDateTo, setBookingDateTo] = useState('');
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);
  const { data, isLoading, isError } = useAdminDashboard();
  const updateBooking = useUpdateBookingRequest();
  const updateContact = useUpdateContactRequest();
  const deleteContact = useDeleteContactRequest();
  const createActivity = useCreateAdminActivity();
  const updateActivity = useUpdateAdminActivity();
  const createCategory = useCreateAdminCategory();
  const updateCategory = useUpdateAdminCategory();

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    setIsConfirmingAction(true);
    try {
      await confirmAction.onConfirm();
      setConfirmAction(null);
    } finally {
      setIsConfirmingAction(false);
    }
  };

  const stats = data?.stats ?? {
    activities: 0,
    bookings: 0,
    newBookings: 0,
    contacts: 0,
    newContacts: 0,
    categories: 0,
  };

  const categoryOptions = Array.from(
    new Set([
      ...(data?.categories
        .filter((category) => category.isActive)
        .map((category) => category.id) ?? []),
      ...(data?.activities.map((activity) => activity.category) ?? []),
      ...defaultCategories,
    ])
  );
  const filteredActivities =
    data?.activities.filter((activity) => {
      const query = activitySearch.trim().toLowerCase();
      if (!query) return true;

      return [
        activity.name.en,
        activity.name.fr,
        activity.slug,
        activity.category,
        activity.id,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    }) ?? [];
  const filteredBookings =
    data?.bookings.filter((booking) => {
      const query = bookingSearch.trim().toLowerCase();
      const tripDate = booking.preferredDate;
      const matchesSearch =
        !query ||
        [
          booking.fullName,
          booking.nationality,
          booking.activityName,
          booking.selectedActivity,
          booking.arrivalDate,
          booking.phone,
          booking.whatsapp,
          booking.email,
          booking.status,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(query));
      const matchesType = bookingTypeFilter === 'all' || booking.status === bookingTypeFilter;
      const matchesDateFrom = !bookingDateFrom || tripDate >= bookingDateFrom;
      const matchesDateTo = !bookingDateTo || tripDate <= bookingDateTo;

      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    }) ?? [];

  const setFormValue = <Key extends keyof ActivityFormState>(
    key: Key,
    value: ActivityFormState[Key]
  ) => {
    setActivityForm((current) => ({ ...current, [key]: value }));
  };

  const resetActivityForm = () => {
    setEditingActivityId(null);
    setActivityForm(emptyActivityForm);
  };

  const closeActivityModal = () => {
    resetActivityForm();
    setIsActivityModalOpen(false);
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
  };

  const closeCategoryModal = () => {
    resetCategoryForm();
    setIsCategoryModalOpen(false);
  };

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      id: slugifyCategoryName(categoryForm.nameEn),
      name: {
        en: categoryForm.nameEn,
        fr: categoryForm.nameFr,
      },
      isActive: categoryForm.isActive,
    };

    try {
      if (editingCategoryId) {
        await updateCategory.mutateAsync({ id: editingCategoryId, payload });
        toast.success('Category updated');
      } else {
        await createCategory.mutateAsync(payload);
        toast.success('Category created');
      }
      resetCategoryForm();
      setIsCategoryModalOpen(false);
    } catch {
      toast.error('Could not save category. Check that the English name is unique.');
    }
  };

  const handleActivitySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      activity: formToActivity(activityForm),
      imageFile: activityForm.imageFile,
      galleryFiles: activityForm.galleryFiles,
      videoThumbnailFiles: getVideoThumbnailFiles(activityForm),
      videoReviewThumbnailFiles: getVideoReviewThumbnailFiles(activityForm),
    };

    try {
      if (editingActivityId) {
        await updateActivity.mutateAsync({ id: editingActivityId, payload });
        toast.success('Activity updated');
      } else {
        await createActivity.mutateAsync(payload);
        toast.success('Activity created');
      }
      resetActivityForm();
      setIsActivityModalOpen(false);
    } catch (err) {
      const data =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string; errors?: string[] } } }).response?.data
          : undefined;
      if (data?.errors?.length) {
        data.errors.forEach((msg) => toast.error(msg, { duration: 8000 }));
      } else {
        toast.error(data?.message || 'Could not save activity. Check required fields and slug uniqueness.');
      }
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      counts={{
        bookings: stats.bookings,
        contacts: stats.contacts,
        activities: stats.activities,
        categories: stats.categories,
      }}
    >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white sm:text-3xl">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Manage activities, booking requests, and contact messages.
          </p>
        </div>

        {isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Could not load admin data. Check that the backend and MongoDB are running.
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-6">
          {[
            { label: 'Activities', value: stats.activities, icon: Tags },
            { label: 'Booking requests', value: stats.bookings, icon: CheckCircle },
            { label: 'New bookings', value: stats.newBookings, icon: CheckCircle },
            { label: 'Contacts', value: stats.contacts, icon: Mail },
            { label: 'New contacts', value: stats.newContacts, icon: MessageSquare },
            { label: 'Categories', value: stats.categories, icon: Tags },
          ].map((item) => (
            <div
              key={item.label}
              className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)] sm:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="break-words text-xs leading-tight text-gray-500 dark:text-gray-300 sm:text-sm">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xl font-bold leading-none text-[var(--navy)] dark:text-white sm:text-2xl">
                    {item.value}
                  </p>
                </div>
                <item.icon className="h-4 w-4 shrink-0 text-[var(--teal)] sm:h-6 sm:w-6" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 min-w-0">
            {activeTab === 'bookings' && (
              <section>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
              <div className="grid gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-700 md:grid-cols-[minmax(220px,1fr)_160px_150px_150px_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={bookingSearch}
                    onChange={(event) => setBookingSearch(event.target.value)}
                    placeholder="Search bookings"
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                  />
                </div>
                <select
                  value={bookingTypeFilter}
                  onChange={(event) =>
                    setBookingTypeFilter(event.target.value as AdminBookingRequest['status'] | 'all')
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                  aria-label="Filter bookings by type"
                >
                  <option value="all">All statuses</option>
                  {bookingStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <label className="block">
                  <span className="sr-only">From date</span>
                  <input
                    type="date"
                    value={bookingDateFrom}
                    onChange={(event) => setBookingDateFrom(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                    aria-label="Filter bookings from date"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">To date</span>
                  <input
                    type="date"
                    value={bookingDateTo}
                    onChange={(event) => setBookingDateTo(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                    aria-label="Filter bookings to date"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setBookingSearch('');
                    setBookingTypeFilter('all');
                    setBookingDateFrom('');
                    setBookingDateTo('');
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                >
                  Reset
                </button>
              </div>
              {/* Mobile card layout */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700 md:hidden">
                {isLoading ? (
                  <div className="px-4 py-8 text-center text-gray-500">Loading bookings...</div>
                ) : filteredBookings.length ? (
                  filteredBookings.map((booking) => (
                    <button
                      key={booking._id}
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full px-4 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-[var(--dark-muted)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-semibold text-gray-900 dark:text-white">
                            {booking.fullName}
                          </p>
                          <p className="break-words text-sm text-gray-500 dark:text-gray-300">
                            {booking.activityName}
                          </p>
                        </div>
                        <select
                          value={booking.status}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) =>
                            updateBooking.mutate({
                              id: booking._id,
                              status: event.target.value as AdminBookingRequest['status'],
                              adminNotes: booking.adminNotes,
                            })
                          }
                          className={`shrink-0 rounded-full border px-3 py-1 text-sm font-medium ${statusClass(
                            booking.status
                          )}`}
                        >
                          {bookingStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <span>{booking.preferredDate}</span>
                        <span>{booking.adults}A / {booking.children}C</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">{formatDate(booking.createdAt)}</p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    {data?.bookings.length
                      ? 'No bookings match your filters.'
                      : 'No booking requests yet.'}
                  </div>
                )}
              </div>

              {/* Desktop table layout */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[980px] divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-[var(--dark-muted)]">
                    <tr>
                      {[
                        'Guest',
                        'Activity',
                        'Trip',
                        'Contact',
                        'Booked at',
                        'Status',
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Loading bookings...
                        </td>
                      </tr>
                    ) : filteredBookings.length ? (
                      filteredBookings.map((booking) => (
                        <tr
                          key={booking._id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedBooking(booking)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setSelectedBooking(booking);
                            }
                          }}
                          className="cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--teal)] dark:hover:bg-[var(--dark-muted)]"
                        >
                          <td className="px-4 py-4 align-top">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {booking.fullName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {booking.nationality}
                            </p>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {booking.activityName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {booking.selectedActivity}
                            </p>
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
                            <p>{booking.preferredDate}</p>
                            <p>
                              {booking.adults} adults, {booking.children} children
                            </p>
                            <p>Arrival: {booking.arrivalDate}</p>
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
                            <p className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {booking.phone}
                            </p>
                            <p className="mt-1 flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              {booking.email}
                            </p>
                            {booking.whatsapp && booking.whatsapp !== booking.phone && (
                              <p className="mt-1 text-xs text-gray-500">
                                WhatsApp: {booking.whatsapp}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(booking.createdAt)}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <select
                              value={booking.status}
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => event.stopPropagation()}
                              onChange={(event) =>
                                updateBooking.mutate({
                                  id: booking._id,
                                  status: event.target.value as AdminBookingRequest['status'],
                                  adminNotes: booking.adminNotes,
                                })
                              }
                              className={`rounded-full border px-3 py-1 text-sm font-medium ${statusClass(
                                booking.status
                              )}`}
                            >
                              {bookingStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          {data?.bookings.length
                            ? 'No bookings match your filters.'
                            : 'No booking requests yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
              </section>
            )}

            {activeTab === 'contacts' && (
              <section>
            <div className="grid gap-4 lg:grid-cols-2">
              {isLoading ? (
                <div className="rounded-lg bg-white p-6 text-gray-500 shadow-sm dark:bg-[var(--dark-card)]">
                  Loading contacts...
                </div>
              ) : data?.contacts.length ? (
                data.contacts.map((contact) => (
                  <article
                    key={contact._id}
                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        <p className="break-all text-sm text-gray-500 dark:text-gray-300">
                          {contact.email}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(contact.createdAt)}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <select
                          value={contact.status}
                          onChange={(event) =>
                            updateContact.mutate({
                              id: contact._id,
                              status: event.target.value as AdminContactRequest['status'],
                              adminNotes: contact.adminNotes,
                            })
                          }
                          className={`rounded-full border px-3 py-1 text-sm font-medium ${statusClass(
                            contact.status
                          )}`}
                        >
                          {contactStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmAction({
                              title: 'Delete contact request?',
                              description: `This will permanently delete the message from ${contact.name}.`,
                              confirmLabel: 'Delete contact',
                              onConfirm: async () => {
                                try {
                                  await deleteContact.mutateAsync(contact._id);
                                  toast.success('Contact request deleted');
                                } catch {
                                  toast.error('Could not delete contact request');
                                }
                              },
                            });
                          }}
                          className="cursor-pointer rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-red-600 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-200"
                          aria-label="Delete contact request"
                          title="Delete"
                          disabled={deleteContact.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {contact.message}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-lg bg-white p-6 text-gray-500 shadow-sm dark:bg-[var(--dark-card)]">
                  No contact requests yet.
                </div>
              )}
            </div>
              </section>
            )}

            {activeTab === 'activities' && (
              <section>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
              <div className="flex flex-col items-stretch gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-semibold text-[var(--navy)] dark:text-white">Activities</h2>
                <div className="flex items-center gap-3">
                  <div className="relative hidden sm:block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="search"
                      value={activitySearch}
                      onChange={(event) => setActivitySearch(event.target.value)}
                      placeholder="Search activities"
                      className="w-72 rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      resetActivityForm();
                      setIsActivityModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:hidden">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={activitySearch}
                    onChange={(event) => setActivitySearch(event.target.value)}
                    placeholder="Search activities"
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                  />
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 md:hidden">
                {isLoading ? (
                  <div className="px-4 py-8 text-center text-gray-500">Loading activities...</div>
                ) : filteredActivities.length ? (
                  filteredActivities.map((activity) => (
                    <article key={activity._id} className="px-4 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/admin/activities/${activity._id}`}
                            className="break-words font-semibold text-gray-900 hover:text-[var(--teal)] dark:text-white"
                          >
                            {activity.name.en}
                          </Link>
                          <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-300">
                            /activities/{activity.slug}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                            activity.isActive
                              ? 'border-green-200 bg-green-50 text-green-800'
                              : 'border-red-200 bg-red-50 text-red-800'
                          }`}
                        >
                          {activity.isActive ? 'active' : 'archived'}
                        </span>
                      </div>

                      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-[var(--dark-muted)]">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Category
                          </dt>
                          <dd className="mt-1 break-words text-gray-700 dark:text-gray-200">
                            {activity.category}
                          </dd>
                        </div>
                        <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-[var(--dark-muted)]">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Price
                          </dt>
                          <dd className="mt-1 font-semibold text-gray-900 dark:text-white">
                            €{getPrimaryPrice(activity)}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          to={`/admin/activities/${activity._id}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200 sm:flex-none"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingActivityId(activity._id);
                            setActivityForm(activityToForm(activity));
                            setIsActivityModalOpen(true);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200 sm:flex-none"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    {activitySearch ? 'No activities match your search.' : 'No activities yet.'}
                  </div>
                )}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-[var(--dark-muted)]">
                    <tr>
                      {['Name', 'Category', 'Price', 'Status', 'Actions'].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          Loading activities...
                        </td>
                      </tr>
                    ) : filteredActivities.length ? (
                      filteredActivities.map((activity) => (
                        <tr
                          key={activity._id}
                          role="button"
                          tabIndex={0}
                          onClick={() => navigate(`/admin/activities/${activity._id}`)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              navigate(`/admin/activities/${activity._id}`);
                            }
                          }}
                          className="cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--teal)] dark:hover:bg-[var(--dark-muted)]"
                        >
                          <td className="px-4 py-4 align-top">
                            <Link
                              to={`/admin/activities/${activity._id}`}
                              className="font-semibold text-gray-900 hover:text-[var(--teal)] dark:text-white"
                            >
                              {activity.name.en}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              /activities/{activity.slug}
                            </p>
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
                            {activity.category}
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
                            €{getPrimaryPrice(activity)}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                activity.isActive
                                  ? 'border-green-200 bg-green-50 text-green-800'
                                  : 'border-red-200 bg-red-50 text-red-800'
                              }`}
                            >
                              {activity.isActive ? 'active' : 'archived'}
                            </span>
                          </td>
                          <td
                            className="px-4 py-4 align-top"
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                          >
                            <div className="flex gap-2">
                              <Link
                                to={`/admin/activities/${activity._id}`}
                                className="cursor-pointer rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                                aria-label="View activity"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingActivityId(activity._id);
                                  setActivityForm(activityToForm(activity));
                                  setIsActivityModalOpen(true);
                                }}
                                className="cursor-pointer rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                                aria-label="Edit activity"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          {activitySearch ? 'No activities match your search.' : 'No activities yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
              </section>
            )}

            {activeTab === 'categories' && (
              <section>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
                  <div className="flex flex-col items-stretch gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-semibold text-[var(--navy)] dark:text-white">
                      Activity Categories
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        resetCategoryForm();
                        setIsCategoryModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]"
                    >
                      <Plus className="h-4 w-4" />
                      Create Category
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700 md:hidden">
                    {isLoading ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        Loading categories...
                      </div>
                    ) : data?.categories.length ? (
                      data.categories.map((category) => (
                        <article key={category._id} className="px-4 py-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="break-words font-semibold text-gray-900 dark:text-white">
                                {category.name.en}
                              </h3>
                              <p className="mt-1 break-words text-sm text-gray-600 dark:text-gray-300">
                                {category.name.fr}
                              </p>
                              <p className="mt-2 break-all font-mono text-xs text-gray-500 dark:text-gray-400">
                                {category.id}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                                category.isActive
                                  ? 'border-green-200 bg-green-50 text-green-800'
                                  : 'border-red-200 bg-red-50 text-red-800'
                              }`}
                            >
                              {category.isActive ? 'active' : 'archived'}
                            </span>
                          </div>
                          <div className="mt-4 flex">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryId(category._id);
                                setCategoryForm({
                                  nameEn: category.name.en,
                                  nameFr: category.name.fr,
                                  isActive: category.isActive,
                                });
                                setIsCategoryModalOpen(true);
                              }}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200 sm:flex-none"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No categories yet.
                      </div>
                    )}
                  </div>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[760px] divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-[var(--dark-muted)]">
                        <tr>
                          {['ID', 'English', 'French', 'Status', 'Actions'].map((heading) => (
                            <th
                              key={heading}
                              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              Loading categories...
                            </td>
                          </tr>
                        ) : data?.categories.length ? (
                          data.categories.map((category) => (
                            <tr key={category._id}>
                              <td className="px-4 py-4 align-top font-mono text-sm text-gray-600 dark:text-gray-300">
                                {category.id}
                              </td>
                              <td className="px-4 py-4 align-top font-semibold text-gray-900 dark:text-white">
                                {category.name.en}
                              </td>
                              <td className="px-4 py-4 align-top text-gray-600 dark:text-gray-300">
                                {category.name.fr}
                              </td>
                              <td className="px-4 py-4 align-top">
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                    category.isActive
                                      ? 'border-green-200 bg-green-50 text-green-800'
                                      : 'border-red-200 bg-red-50 text-red-800'
                                  }`}
                                >
                                  {category.isActive ? 'active' : 'archived'}
                                </span>
                              </td>
                              <td className="px-4 py-4 align-top">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCategoryId(category._id);
                                      setCategoryForm({
                                        nameEn: category.name.en,
                                        nameFr: category.name.fr,
                                        isActive: category.isActive,
                                      });
                                      setIsCategoryModalOpen(true);
                                    }}
                                    className="cursor-pointer rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                                    aria-label="Edit category"
                                    title="Edit"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              No categories yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </section>
            )}
        </div>
        <ActivityFormModal
          categories={categoryOptions}
          form={activityForm}
          isOpen={isActivityModalOpen}
          isSaving={createActivity.isPending || updateActivity.isPending}
          title={editingActivityId ? 'Edit Activity' : 'Create Activity'}
          onClose={closeActivityModal}
          onSubmit={handleActivitySubmit}
          setFormValue={setFormValue}
        />
        <CategoryFormModal
          form={categoryForm}
          isEditing={Boolean(editingCategoryId)}
          isOpen={isCategoryModalOpen}
          isSaving={createCategory.isPending || updateCategory.isPending}
          onClose={closeCategoryModal}
          onSubmit={handleCategorySubmit}
          setCategoryForm={setCategoryForm}
        />
        <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
        <ConfirmActionModal
          isOpen={Boolean(confirmAction)}
          title={confirmAction?.title ?? ''}
          description={confirmAction?.description ?? ''}
          confirmLabel={confirmAction?.confirmLabel}
          isConfirming={isConfirmingAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
        />
    </AdminLayout>
  );
}

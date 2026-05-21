import { type FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  Edit3,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  Search,
  Tags,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  type AdminBookingRequest,
  type AdminContactRequest,
  useAdminDashboard,
  useCreateAdminActivity,
  useCreateAdminCategory,
  useDeleteAdminActivity,
  useDeleteAdminCategory,
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
} from '../components/admin/ActivityFormModal';
import AdminLayout from '../components/admin/AdminLayout';
import { getPrimaryPrice } from '../utils/pricing';

type AdminTab = 'bookings' | 'contacts' | 'activities' | 'categories';

interface CategoryFormState {
  id: string;
  nameEn: string;
  nameFr: string;
  isActive: boolean;
}

const emptyCategoryForm: CategoryFormState = {
  id: '',
  nameEn: '',
  nameFr: '',
  isActive: true,
};

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
  if (status === 'confirmed' || status === 'replied') {
    return 'bg-green-50 text-green-800 border-green-200';
  }
  if (status === 'cancelled' || status === 'archived') {
    return 'bg-red-50 text-red-800 border-red-200';
  }
  return 'bg-orange-50 text-orange-800 border-orange-200';
}

export default function AdminDashboard() {
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
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);
  const { data, isLoading, isError } = useAdminDashboard();
  const updateBooking = useUpdateBookingRequest();
  const updateContact = useUpdateContactRequest();
  const createActivity = useCreateAdminActivity();
  const updateActivity = useUpdateAdminActivity();
  const deleteActivity = useDeleteAdminActivity();
  const createCategory = useCreateAdminCategory();
  const updateCategory = useUpdateAdminCategory();
  const deleteCategory = useDeleteAdminCategory();

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

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      id: categoryForm.id,
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
    } catch {
      toast.error('Could not save category. Check that the ID is unique.');
    }
  };

  const handleActivitySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      activity: formToActivity(activityForm),
      imageFile: activityForm.imageFile,
      galleryFiles: activityForm.galleryFiles,
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
    } catch {
      toast.error('Could not save activity. Check required fields and slug uniqueness.');
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
          <h2 className="text-3xl font-bold text-[var(--navy)] dark:text-white">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Activities', value: stats.activities, icon: Tags },
            { label: 'Bookings', value: stats.bookings, icon: CheckCircle },
            { label: 'New bookings', value: stats.newBookings, icon: CheckCircle },
            { label: 'Contacts', value: stats.contacts, icon: Mail },
            { label: 'New contacts', value: stats.newContacts, icon: MessageSquare },
            { label: 'Categories', value: stats.categories, icon: Tags },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{item.label}</p>
                  <p className="mt-1 text-3xl font-bold text-[var(--navy)] dark:text-white">
                    {item.value}
                  </p>
                </div>
                <item.icon className="h-7 w-7 text-[var(--teal)]" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 min-w-0">
            {activeTab === 'bookings' && (
              <section>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-[var(--dark-muted)]">
                    <tr>
                      {['Guest', 'Activity', 'Trip', 'Contact', 'Status'].map((heading) => (
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
                          Loading bookings...
                        </td>
                      </tr>
                    ) : data?.bookings.length ? (
                      data.bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-4 py-4 align-top">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {booking.fullName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {booking.nationality}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(booking.createdAt)}</p>
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
                            <p>{booking.hotelName}</p>
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-300">
                            <p>{booking.email}</p>
                            <p className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {booking.whatsapp}
                            </p>
                            {booking.specialRequests && (
                              <p className="mt-2 max-w-xs text-gray-500">
                                {booking.specialRequests}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <select
                              value={booking.status}
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
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No booking requests yet.
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
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{contact.email}</p>
                        <p className="text-xs text-gray-400">{formatDate(contact.createdAt)}</p>
                      </div>
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
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
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
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]"
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                        <tr key={activity._id}>
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
                          <td className="px-4 py-4 align-top">
                            <div className="flex gap-2">
                              <Link
                                to={`/admin/activities/${activity._id}`}
                                className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
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
                                className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                                aria-label="Edit activity"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await deleteActivity.mutateAsync(activity._id);
                                    toast.success('Activity archived');
                                  } catch {
                                    toast.error('Could not archive activity');
                                  }
                                }}
                                className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-red-600 dark:border-gray-600 dark:text-gray-200"
                                aria-label="Archive activity"
                                title="Archive"
                                disabled={!activity.isActive}
                              >
                                <Trash2 className="h-4 w-4" />
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
              <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
                  <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <h2 className="font-semibold text-[var(--navy)] dark:text-white">
                      Activity Categories
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                        id: category.id,
                                        nameEn: category.name.en,
                                        nameFr: category.name.fr,
                                        isActive: category.isActive,
                                      });
                                    }}
                                    className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                                    aria-label="Edit category"
                                    title="Edit"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        await deleteCategory.mutateAsync(category._id);
                                        toast.success('Category archived');
                                      } catch {
                                        toast.error('Could not archive category');
                                      }
                                    }}
                                    className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-red-600 dark:border-gray-600 dark:text-gray-200"
                                    aria-label="Archive category"
                                    title="Archive"
                                    disabled={!category.isActive}
                                  >
                                    <Trash2 className="h-4 w-4" />
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

                <form
                  onSubmit={handleCategorySubmit}
                  className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-[var(--navy)] dark:text-white">
                      {editingCategoryId ? 'Edit Category' : 'Create Category'}
                    </h2>
                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        className="text-sm font-semibold text-[var(--teal)]"
                      >
                        New
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category ID
                      </span>
                      <input
                        value={categoryForm.id}
                        onChange={(event) =>
                          setCategoryForm((current) => ({ ...current, id: event.target.value }))
                        }
                        required
                        placeholder="sea-adventures"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        English Name
                      </span>
                      <input
                        value={categoryForm.nameEn}
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
                        value={categoryForm.nameFr}
                        onChange={(event) =>
                          setCategoryForm((current) => ({ ...current, nameFr: event.target.value }))
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                      />
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={categoryForm.isActive}
                        onChange={(event) =>
                          setCategoryForm((current) => ({
                            ...current,
                            isActive: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-[var(--teal)] focus:ring-[var(--teal)]"
                      />
                      Active
                    </label>

                    <button
                      type="submit"
                      disabled={createCategory.isPending || updateCategory.isPending}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--teal)] px-4 py-3 font-semibold text-white hover:bg-[var(--teal-dark)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {editingCategoryId ? 'Save Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
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
    </AdminLayout>
  );
}

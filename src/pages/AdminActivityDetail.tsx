import { type FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminDashboard,
  useAdminActivity,
  useUpdateAdminActivity,
} from '../hooks/queries';
import AdminLayout from '../components/admin/AdminLayout';
import ActivityFormModal, {
  type ActivityFormState,
  activityToForm,
  defaultCategories,
  emptyActivityForm,
  formToActivity,
} from '../components/admin/ActivityFormModal';
import { resolveActivityImageUrl } from '../utils/activityImages';
import { getPrimaryPrice, getPricingFields } from '../utils/pricing';

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
      <h2 className="mb-3 font-semibold text-[var(--navy)] dark:text-white">{title}</h2>
      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-[var(--dark-muted)]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AdminActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: activity, isLoading, isError } = useAdminActivity(id);
  const { data: dashboardData } = useAdminDashboard();
  const updateActivity = useUpdateAdminActivity();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityForm, setActivityForm] = useState<ActivityFormState>(emptyActivityForm);

  useEffect(() => {
    if (activity) {
      setActivityForm(activityToForm(activity));
    }
  }, [activity]);

  const categories = Array.from(
    new Set([
      ...(dashboardData?.categories
        .filter((category) => category.isActive)
        .map((category) => category.id) ?? []),
      activity?.category,
      ...defaultCategories,
    ].filter(Boolean) as string[])
  );
  const counts = {
    bookings: dashboardData?.stats.bookings ?? 0,
    contacts: dashboardData?.stats.contacts ?? 0,
    activities: dashboardData?.stats.activities ?? 0,
    categories: dashboardData?.stats.categories ?? 0,
  };

  const setFormValue = <Key extends keyof ActivityFormState>(
    key: Key,
    value: ActivityFormState[Key]
  ) => {
    setActivityForm((current) => ({ ...current, [key]: value }));
  };

  const handleActivitySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) return;

    try {
      await updateActivity.mutateAsync({
        id,
        payload: {
          activity: formToActivity(activityForm),
          imageFile: activityForm.imageFile,
          galleryFiles: activityForm.galleryFiles,
        },
      });
      toast.success('Activity updated');
      setIsModalOpen(false);
    } catch {
      toast.error('Could not update activity');
    }
  };

  const handleActiveToggle = async () => {
    if (!activity) return;

    const nextIsActive = !activity.isActive;
    const activityPayload = {
      id: activity.id,
      slug: activity.slug,
      name: activity.name,
      category: activity.category,
      description: activity.description,
      highlights: activity.highlights,
      pricing: activity.pricing,
      pricingFields: activity.pricingFields,
      ageRestrictions: activity.ageRestrictions,
      duration: activity.duration,
      startTime: activity.startTime,
      endTime: activity.endTime,
      times: activity.times,
      maxCapacity: activity.maxCapacity,
      maxWeight: activity.maxWeight,
      included: activity.included,
      excluded: activity.excluded,
      imageUrl: activity.imageUrl,
      galleryImages: activity.galleryImages,
      featured: activity.featured,
      childFriendly: activity.childFriendly,
      familyFriendly: activity.familyFriendly,
      pickupIncluded: activity.pickupIncluded,
      availableDaily: activity.availableDaily,
      freeCancellation: activity.freeCancellation,
      privateAvailable: activity.privateAvailable,
      groupAvailable: activity.groupAvailable,
    };

    try {
      await updateActivity.mutateAsync({
        id: activity._id,
        payload: {
          activity: {
            ...activityPayload,
            isActive: nextIsActive,
          },
        },
      });
      toast.success(nextIsActive ? 'Activity activated' : 'Activity deactivated');
    } catch {
      toast.error('Could not update activity status');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout counts={counts}>
        <div className="text-gray-500">Loading activity...</div>
      </AdminLayout>
    );
  }

  if (isError || !activity) {
    return (
      <AdminLayout counts={counts}>
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
          Activity not found.
        </div>
      </AdminLayout>
    );
  }

  const price = getPrimaryPrice(activity);
  const pricingFields = getPricingFields(activity);

  return (
    <AdminLayout counts={counts}>
      <div className="mb-5">
        <Link
          to="/admin?tab=activities"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--teal)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to activities
        </Link>
      </div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  activity.isActive
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {activity.isActive ? 'active' : 'archived'}
              </span>
              {activity.featured && (
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800">
                  featured
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-[var(--navy)] dark:text-white">
              {activity.name.en}
            </h2>
            <p className="mt-1 text-gray-500 dark:text-gray-300">{activity.name.fr}</p>
          </div>

          <div className="flex gap-2">
            <a
              href={`/activities/${activity.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
            >
              <ExternalLink className="h-4 w-4" />
              Public page
            </a>
            <button
              type="button"
              onClick={() => {
                setActivityForm(activityToForm(activity));
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <label className="inline-flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200">
              <input
                type="checkbox"
                checked={activity.isActive}
                onChange={handleActiveToggle}
                disabled={updateActivity.isPending}
                className="sr-only"
              />
              <span
                className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                  activity.isActive ? 'bg-[var(--teal)]' : 'bg-gray-300 dark:bg-gray-600'
                } ${updateActivity.isPending ? 'opacity-50' : ''}`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    activity.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </span>
              Active
            </label>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
            <img
              src={resolveActivityImageUrl(activity.imageUrl)}
              alt={activity.name.en}
              className="h-72 w-full object-cover"
            />
            <div className="space-y-3 p-5 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Slug:</span>{' '}
                {activity.slug}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Category:</span>{' '}
                {activity.category}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Duration:</span>{' '}
                {activity.duration}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Base price:</span>{' '}
                EUR {price}
              </p>
              {pricingFields.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Prices:</span>
                  <div className="mt-2 space-y-1">
                    {pricingFields.map((field, index) => (
                      <p key={`${field.id ?? field.name.en}-${index}`}>
                        {field.name.en} / {field.name.fr}: EUR {field.price}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
            <h2 className="mb-3 font-semibold text-[var(--navy)] dark:text-white">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300">{activity.description.en}</p>
            <p className="mt-4 text-gray-500 dark:text-gray-400">{activity.description.fr}</p>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DetailList title="Highlights EN" items={activity.highlights.en} />
          <DetailList title="Highlights FR" items={activity.highlights.fr} />
          <DetailList title="Included EN" items={activity.included.en} />
          <DetailList title="Included FR" items={activity.included.fr} />
        </div>

        <ActivityFormModal
          categories={categories}
          form={activityForm}
          isOpen={isModalOpen}
          isSaving={updateActivity.isPending}
          title="Edit Activity"
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleActivitySubmit}
          setFormValue={setFormValue}
        />
    </AdminLayout>
  );
}

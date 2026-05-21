import { type FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Edit3,
  Euro,
  ExternalLink,
  Folder,
  Link2,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminDashboard,
  useAdminActivity,
  useDeleteAdminActivityReview,
  useUpdateAdminActivity,
  useUpdateAdminActivityReview,
} from '../hooks/queries';
import AdminLayout from '../components/admin/AdminLayout';
import ActivityFormModal, {
  type ActivityFormState,
  activityToForm,
  defaultCategories,
  emptyActivityForm,
  formToActivity,
  getVideoThumbnailFiles,
} from '../components/admin/ActivityFormModal';
import type { ActivityReview } from '../types';
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
  const updateReview = useUpdateAdminActivityReview();
  const deleteReview = useDeleteAdminActivityReview();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityForm, setActivityForm] = useState<ActivityFormState>(emptyActivityForm);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    country: '',
    rating: 5,
    comment: '',
  });

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
          videoThumbnailFiles: getVideoThumbnailFiles(activityForm),
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
      maxCapacity: activity.maxCapacity,
      maxWeight: activity.maxWeight,
      included: activity.included,
      excluded: activity.excluded,
      imageUrl: activity.imageUrl,
      galleryImages: activity.galleryImages,
      videoHighlights: activity.videoHighlights,
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

  const startEditingReview = (review: ActivityReview) => {
    setEditingReviewId(review._id);
    setReviewForm({
      name: review.name,
      country: review.country || 'Unknown country',
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !editingReviewId) return;

    try {
      await updateReview.mutateAsync({
        activityId: id,
        reviewId: editingReviewId,
        payload: reviewForm,
      });
      toast.success('Review updated');
      setEditingReviewId(null);
    } catch {
      toast.error('Could not update review');
    }
  };

  const handleReviewDelete = async (reviewId: string) => {
    if (!id || !window.confirm('Delete this review?')) return;

    try {
      await deleteReview.mutateAsync({ activityId: id, reviewId });
      toast.success('Review deleted');
    } catch {
      toast.error('Could not delete review');
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
  const reviews = activity.reviews ?? [];

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

        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
          <div className="grid xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="relative min-h-72 bg-gray-100 dark:bg-[var(--dark-muted)]">
              <img
                src={resolveActivityImageUrl(activity.imageUrl)}
                alt={activity.name.en}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Activity Summary
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">{activity.name.en}</h2>
              </div>
            </div>

            <div className="p-5">
              <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Slug', value: activity.slug, icon: Link2 },
                  { label: 'Category', value: activity.category, icon: Folder },
                  { label: 'Duration', value: activity.duration, icon: Clock },
                  { label: 'Base price', value: `EUR ${price}`, icon: Euro },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
                  >
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      <Icon className="h-4 w-4 text-[var(--teal)]" />
                      {label}
                    </dt>
                    <dd className="mt-2 break-words text-sm font-semibold text-gray-900 dark:text-white">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {pricingFields.length > 0 && (
                <div className="mt-5 border-t border-gray-200 pt-5 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-[var(--navy)] dark:text-white">
                    Prices
                  </h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {pricingFields.map((field, index) => (
                      <div
                        key={`${field.id ?? field.name.en}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-[var(--dark-muted)]"
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {field.name.en} / {field.name.fr}
                        </span>
                        <span className="font-bold text-[var(--teal)]">EUR {field.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 border-t border-gray-200 pt-5 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-[var(--navy)] dark:text-white">
                  Overview
                </h3>
                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {activity.description.en}
                  </p>
                  <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {activity.description.fr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DetailList title="Highlights EN" items={activity.highlights.en} />
          <DetailList title="Highlights FR" items={activity.highlights.fr} />
          <DetailList title="Included EN" items={activity.included.en} />
          <DetailList title="Included FR" items={activity.included.fr} />
        </div>

        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[var(--navy)] dark:text-white">Reviews</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-[var(--dark-muted)] dark:text-gray-300">
              No reviews for this activity yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isEditing = editingReviewId === review._id;

                return (
                  <div
                    key={review._id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[var(--dark-muted)]"
                  >
                    {isEditing ? (
                      <form onSubmit={handleReviewSubmit} className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_160px]">
                          <label className="grid gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Name
                            <input
                              type="text"
                              value={reviewForm.name}
                              onChange={(event) =>
                                setReviewForm((current) => ({
                                  ...current,
                                  name: event.target.value,
                                }))
                              }
                              minLength={2}
                              maxLength={120}
                              required
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-section)] dark:text-white"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Country
                            <input
                              type="text"
                              value={reviewForm.country}
                              onChange={(event) =>
                                setReviewForm((current) => ({
                                  ...current,
                                  country: event.target.value,
                                }))
                              }
                              minLength={2}
                              maxLength={120}
                              required
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-section)] dark:text-white"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Rating
                            <select
                              value={reviewForm.rating}
                              onChange={(event) =>
                                setReviewForm((current) => ({
                                  ...current,
                                  rating: Number(event.target.value),
                                }))
                              }
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-section)] dark:text-white"
                            >
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>
                                  {rating}/5
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <label className="grid gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Review
                          <textarea
                            value={reviewForm.comment}
                            onChange={(event) =>
                              setReviewForm((current) => ({
                                ...current,
                                comment: event.target.value,
                              }))
                            }
                            minLength={5}
                            maxLength={2000}
                            required
                            rows={4}
                            className="resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-section)] dark:text-white"
                          />
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            disabled={updateReview.isPending}
                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)] disabled:opacity-60"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingReviewId(null)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {review.name}
                            </h3>
                            {(review.date || review.createdAt) && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {review.date ||
                                  new Date(review.createdAt ?? '').toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                              </p>
                            )}
                            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              {review.country}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-[var(--gold)] text-[var(--gold)]'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {review.comment}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEditingReview(review)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewDelete(review._id)}
                            disabled={deleteReview.isPending}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

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

import { type FormEvent, useState } from 'react';
import { Edit3, Plus, Star, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  type Testimonial,
  type TestimonialPayload,
  useCreateAdminTestimonial,
  useDeleteAdminTestimonial,
  useUpdateAdminTestimonial,
} from '../../hooks/queries';
import ConfirmActionModal from './ConfirmActionModal';

interface TestimonialsPanelProps {
  testimonials: Testimonial[];
  isLoading: boolean;
}

interface TestimonialFormState {
  name: string;
  rating: number;
  textEn: string;
  textFr: string;
  activityEn: string;
  activityFr: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyTestimonialForm: TestimonialFormState = {
  name: '',
  rating: 5,
  textEn: '',
  textFr: '',
  activityEn: '',
  activityFr: '',
  sortOrder: 0,
  isActive: true,
};

function testimonialToForm(testimonial: Testimonial): TestimonialFormState {
  return {
    name: testimonial.name,
    rating: testimonial.rating,
    textEn: testimonial.text.en,
    textFr: testimonial.text.fr,
    activityEn: testimonial.activity.en,
    activityFr: testimonial.activity.fr,
    sortOrder: testimonial.sortOrder,
    isActive: testimonial.isActive,
  };
}

function formToPayload(form: TestimonialFormState): TestimonialPayload {
  return {
    name: form.name.trim(),
    rating: form.rating,
    text: {
      en: form.textEn.trim(),
      fr: form.textFr.trim(),
    },
    activity: {
      en: form.activityEn.trim(),
      fr: form.activityFr.trim(),
    },
    sortOrder: form.sortOrder,
    isActive: form.isActive,
  };
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    return (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response?.data?.message;
  }

  return undefined;
}

export default function TestimonialsPanel({
  testimonials,
  isLoading,
}: TestimonialsPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingTestimonial, setDeletingTestimonial] =
    useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialFormState>(emptyTestimonialForm);
  const createTestimonial = useCreateAdminTestimonial();
  const updateTestimonial = useUpdateAdminTestimonial();
  const deleteTestimonial = useDeleteAdminTestimonial();
  const isSaving =
    createTestimonial.isPending || updateTestimonial.isPending;

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyTestimonialForm);
  };

  const openCreateModal = () => {
    const nextSortOrder =
      testimonials.reduce(
        (highestOrder, testimonial) =>
          Math.max(highestOrder, testimonial.sortOrder),
        -1,
      ) + 1;

    setEditingId(null);
    setForm({
      ...emptyTestimonialForm,
      sortOrder: nextSortOrder,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingId(testimonial._id);
    setForm(testimonialToForm(testimonial));
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = formToPayload(form);

    try {
      if (editingId) {
        await updateTestimonial.mutateAsync({
          id: editingId,
          payload,
        });
        toast.success('تم تحديث تقييم الضيف');
      } else {
        await createTestimonial.mutateAsync(payload);
        toast.success('تم إنشاء تقييم الضيف');
      }

      closeModal();
    } catch (error) {
      toast.error(
        getErrorMessage(error) ??
          'تعذر حفظ تقييم الضيف. تحقق من البيانات.',
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingTestimonial) {
      return;
    }

    try {
      await deleteTestimonial.mutateAsync(deletingTestimonial._id);
      toast.success('تم حذف تقييم الضيف');
      setDeletingTestimonial(null);
    } catch (error) {
      toast.error(
        getErrorMessage(error) ?? 'تعذر حذف تقييم الضيف.',
      );
    }
  };

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
        <div className="flex flex-col items-stretch gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[var(--navy)] dark:text-white">
              Guest Reviews
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Manage the reviews shown in “What Our Guests Say”.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]"
          >
            <Plus className="h-4 w-4" />
            New Review
          </button>
        </div>

        {isLoading ? (
          <div className="px-4 py-10 text-center text-gray-500">
            Loading guest reviews...
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid gap-4 p-4 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial._id}
                className="rounded-xl border border-gray-200 p-4 dark:border-gray-700 dark:bg-[var(--dark-muted)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          testimonial.isActive
                            ? 'border-green-200 bg-green-50 text-green-800'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        {testimonial.isActive ? 'active' : 'hidden'}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                        order {testimonial.sortOrder}
                      </span>
                    </div>
                    <div
                      className="mt-2 flex items-center gap-1"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index < testimonial.rating
                              ? 'fill-[var(--gold)] text-[var(--gold)]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(testimonial)}
                      className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
                      aria-label={`Edit review by ${testimonial.name}`}
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingTestimonial(testimonial)}
                      className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:border-red-300 hover:text-red-600 dark:border-gray-600 dark:text-gray-200"
                      aria-label={`Delete review by ${testimonial.name}`}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-[var(--dark-card)]">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      English · {testimonial.activity.en}
                    </p>
                    <p className="mt-1 text-sm italic text-gray-700 dark:text-gray-200">
                      “{testimonial.text.en}”
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-[var(--dark-card)]">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      French · {testimonial.activity.fr}
                    </p>
                    <p className="mt-1 text-sm italic text-gray-700 dark:text-gray-200">
                      “{testimonial.text.fr}”
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center text-gray-500">
            No guest reviews yet.
          </div>
        )}
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
        >
          <form
            onSubmit={handleSubmit}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-[var(--dark-card)]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-[var(--dark-card)]">
              <h2
                id="testimonial-modal-title"
                className="text-xl font-bold text-[var(--navy)] dark:text-white"
              >
                {editingId ? 'Edit Guest Review' : 'Create Guest Review'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Guest name
                </span>
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Rating
                </span>
                <select
                  value={form.rating}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      rating: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} star{rating === 1 ? '' : 's'}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Display order
                </span>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sortOrder: Math.max(0, Number(event.target.value)),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Activity label — English
                </span>
                <input
                  required
                  maxLength={180}
                  value={form.activityEn}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      activityEn: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Activity label — French
                </span>
                <input
                  required
                  maxLength={180}
                  value={form.activityFr}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      activityFr: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Review — English
                </span>
                <textarea
                  required
                  minLength={1}
                  maxLength={2000}
                  rows={5}
                  value={form.textEn}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      textEn: event.target.value,
                    }))
                  }
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Review — French
                </span>
                <textarea
                  required
                  minLength={1}
                  maxLength={2000}
                  rows={5}
                  value={form.textFr}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      textFr: event.target.value,
                    }))
                  }
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                />
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[var(--teal)]"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-800 dark:text-white">
                    Show on homepage
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-300">
                    Hidden reviews remain available in admin.
                  </span>
                </span>
              </label>
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-[var(--dark-card)] sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? 'Saving...'
                  : editingId
                    ? 'Save Review'
                    : 'Create Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmActionModal
        isOpen={Boolean(deletingTestimonial)}
        title="Delete guest review?"
        description={
          deletingTestimonial
            ? `This will permanently delete the review by ${deletingTestimonial.name}.`
            : ''
        }
        confirmLabel="Delete review"
        isConfirming={deleteTestimonial.isPending}
        onClose={() => setDeletingTestimonial(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

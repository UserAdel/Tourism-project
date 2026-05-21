import { type FormEvent, useEffect, useMemo } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import type { Activity, PricingField } from '../../types';
import type { AdminActivity } from '../../hooks/queries';
import { resolveActivityImageUrl } from '../../utils/activityImages';
import { legacyPricingToFields } from '../../utils/pricing';

interface BilingualItem {
  en: string;
  fr: string;
}

interface PricingFormItem {
  id: string;
  nameEn: string;
  nameFr: string;
  price: string;
  isMain: boolean;
}

export interface ActivityFormState {
  id: string;
  slug: string;
  nameEn: string;
  nameFr: string;
  category: string;
  descriptionEn: string;
  descriptionFr: string;
  highlights: BilingualItem[];
  included: BilingualItem[];
  excluded: BilingualItem[];
  pricingFields: PricingFormItem[];
  ageRestrictionsEn: string;
  ageRestrictionsFr: string;
  duration: string;
  startTime: string;
  endTime: string;
  times: string;
  maxCapacity: string;
  maxWeight: string;
  imageUrl: string;
  imageFile: File | null;
  galleryImages: string[];
  galleryFiles: File[];
  featured: boolean;
  childFriendly: boolean;
  familyFriendly: boolean;
  pickupIncluded: boolean;
  availableDaily: boolean;
  freeCancellation: boolean;
  privateAvailable: boolean;
  groupAvailable: boolean;
  isActive: boolean;
}

export const defaultCategories = [
  'island-trips',
  'historical-tours',
  'dolphin-experiences',
  'sea-adventures',
  'private-tours',
  'wellness',
  'family-activities',
];

const emptyItem = { en: '', fr: '' };
const defaultPricingFields: PricingFormItem[] = [
  { id: 'adult', nameEn: 'Adult', nameFr: 'Adulte', price: '', isMain: true },
  { id: 'child', nameEn: 'Children', nameFr: 'Enfants', price: '', isMain: false },
];

export const emptyActivityForm: ActivityFormState = {
  id: '',
  slug: '',
  nameEn: '',
  nameFr: '',
  category: 'island-trips',
  descriptionEn: '',
  descriptionFr: '',
  highlights: [{ ...emptyItem }],
  included: [{ ...emptyItem }],
  excluded: [],
  pricingFields: defaultPricingFields.map((field) => ({ ...field })),
  ageRestrictionsEn: '',
  ageRestrictionsFr: '',
  duration: '',
  startTime: '',
  endTime: '',
  times: '',
  maxCapacity: '',
  maxWeight: '',
  imageUrl: '',
  imageFile: null,
  galleryImages: [],
  galleryFiles: [],
  featured: false,
  childFriendly: true,
  familyFriendly: true,
  pickupIncluded: true,
  availableDaily: true,
  freeCancellation: true,
  privateAvailable: true,
  groupAvailable: true,
  isActive: true,
};

function toItems(en: string[] = [], fr: string[] = []) {
  const length = Math.max(en.length, fr.length, 1);
  return Array.from({ length }, (_, index) => ({
    en: en[index] ?? '',
    fr: fr[index] ?? '',
  }));
}

function compactItems(items: BilingualItem[]) {
  return items
    .map((item) => ({ en: item.en.trim(), fr: item.fr.trim() }))
    .filter((item) => item.en && item.fr);
}

function numberOrUndefined(value: string) {
  return value === '' ? undefined : Number(value);
}

function numberOrNull(value: string) {
  return value === '' ? null : Number(value);
}

function pricingFieldsToFormItems(fields: PricingField[]) {
  const adultField = fields.find((field) => field.id === 'adult');
  const childField = fields.find((field) => field.id === 'child');

  return [
    {
      ...defaultPricingFields[0],
      price: adultField?.price.toString() ?? '',
    },
    {
      ...defaultPricingFields[1],
      price: childField?.price.toString() ?? '',
    },
  ];
}

function compactPricingFields(fields: PricingFormItem[]) {
  return fields.reduce<PricingField[]>((pricingFields, field) => {
    const template = field.id === 'child' ? defaultPricingFields[1] : defaultPricingFields[0];
    const price = numberOrUndefined(field.price);

    if (price !== undefined) {
      pricingFields.push({
        id: template.id,
        name: { en: template.nameEn, fr: template.nameFr },
        price,
        isMain: template.id === 'adult',
      });
    }

    return pricingFields;
  }, []);
}

function pricingFieldsToLegacyPricing(fields: PricingField[]): Activity['pricing'] {
  return fields.reduce<Activity['pricing']>((pricing, field) => {
    if (field.id === 'adult') pricing.adult = field.price;
    if (field.id === 'child') pricing.child = field.price;
    if (field.id === 'private') pricing.private = field.price;
    if (field.id === 'extraPerson') pricing.extraPerson = field.price;
    if (field.id === 'visitor') pricing.visitor = field.price;
    return pricing;
  }, {});
}

export function activityToForm(activity: AdminActivity): ActivityFormState {
  const pricingFields = activity.pricingFields?.length
    ? activity.pricingFields
    : legacyPricingToFields(activity.pricing);

  return {
    ...emptyActivityForm,
    id: activity.id,
    slug: activity.slug,
    nameEn: activity.name.en,
    nameFr: activity.name.fr,
    category: activity.category,
    descriptionEn: activity.description.en,
    descriptionFr: activity.description.fr,
    highlights: toItems(activity.highlights.en, activity.highlights.fr),
    included: toItems(activity.included.en, activity.included.fr),
    excluded: activity.excluded ? toItems(activity.excluded.en, activity.excluded.fr) : [],
    pricingFields: pricingFieldsToFormItems(pricingFields),
    ageRestrictionsEn: activity.ageRestrictions.en,
    ageRestrictionsFr: activity.ageRestrictions.fr,
    duration: activity.duration,
    startTime: activity.startTime ?? '',
    endTime: activity.endTime ?? '',
    times: activity.times?.join('\n') ?? '',
    maxCapacity: activity.maxCapacity?.toString() ?? '',
    maxWeight: activity.maxWeight?.toString() ?? '',
    imageUrl: activity.imageUrl,
    imageFile: null,
    galleryImages: activity.galleryImages ?? [],
    galleryFiles: [],
    featured: Boolean(activity.featured),
    childFriendly: activity.childFriendly,
    familyFriendly: Boolean(activity.familyFriendly),
    pickupIncluded: activity.pickupIncluded,
    availableDaily: activity.availableDaily !== false,
    freeCancellation: activity.freeCancellation !== false,
    privateAvailable: activity.privateAvailable,
    groupAvailable: activity.groupAvailable,
    isActive: activity.isActive,
  };
}

export function formToActivity(form: ActivityFormState): Activity & { isActive: boolean } {
  const highlights = compactItems(form.highlights);
  const included = compactItems(form.included);
  const excluded = compactItems(form.excluded);
  const pricingFields = compactPricingFields(form.pricingFields);

  return {
    id: form.id,
    slug: form.slug,
    name: { en: form.nameEn, fr: form.nameFr },
    category: form.category,
    description: { en: form.descriptionEn, fr: form.descriptionFr },
    highlights: {
      en: highlights.map((item) => item.en),
      fr: highlights.map((item) => item.fr),
    },
    pricing: pricingFieldsToLegacyPricing(pricingFields),
    pricingFields,
    ageRestrictions: { en: form.ageRestrictionsEn, fr: form.ageRestrictionsFr },
    duration: form.duration,
    startTime: form.startTime,
    endTime: form.endTime,
    times: form.times
      .split(/\n|,/)
      .map((time) => time.trim())
      .filter(Boolean),
    maxCapacity: numberOrNull(form.maxCapacity) ?? undefined,
    maxWeight: numberOrNull(form.maxWeight) ?? undefined,
    included: {
      en: included.map((item) => item.en),
      fr: included.map((item) => item.fr),
    },
    excluded: excluded.length
      ? {
          en: excluded.map((item) => item.en),
          fr: excluded.map((item) => item.fr),
        }
      : undefined,
    imageUrl: form.imageUrl,
    galleryImages: form.galleryImages,
    featured: form.featured,
    childFriendly: form.childFriendly,
    familyFriendly: form.familyFriendly,
    pickupIncluded: form.pickupIncluded,
    availableDaily: form.availableDaily,
    freeCancellation: form.freeCancellation,
    privateAvailable: form.privateAvailable,
    groupAvailable: form.groupAvailable,
    isActive: form.isActive,
  };
}

function TextField({
  label,
  value,
  onChange,
  required,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  required,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
      />
    </label>
  );
}

function BilingualItemsEditor({
  label,
  items,
  minItems = 0,
  onChange,
}: {
  label: string;
  items: BilingualItem[];
  minItems?: number;
  onChange: (items: BilingualItem[]) => void;
}) {
  const updateItem = (index: number, key: keyof BilingualItem, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  };

  const removeItem = (index: number) => {
    if (items.length <= minItems) return;
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <section className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-[var(--navy)] dark:text-white">{label}</h3>
        <button
          type="button"
          onClick={() => onChange([...items, { ...emptyItem }])}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--teal)] dark:border-gray-600 dark:text-gray-200"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              value={item.en}
              onChange={(event) => updateItem(index, 'en', event.target.value)}
              placeholder="EN name"
              required={minItems > 0}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
            />
            <input
              value={item.fr}
              onChange={(event) => updateItem(index, 'fr', event.target.value)}
              placeholder="FR name"
              required={minItems > 0}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={items.length <= minItems}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200"
              aria-label={`Remove ${label} item`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingFieldsEditor({
  fields,
  onChange,
}: {
  fields: PricingFormItem[];
  onChange: (fields: PricingFormItem[]) => void;
}) {
  const updateField = (id: 'adult' | 'child', value: string) => {
    onChange(fields.map((field) => (field.id === id ? { ...field, price: value } : field)));
  };
  const adultPrice = fields.find((field) => field.id === 'adult')?.price ?? '';
  const childPrice = fields.find((field) => field.id === 'child')?.price ?? '';

  return (
    <section className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="mb-3">
        <h3 className="font-semibold text-[var(--navy)] dark:text-white">Pricing</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Adult EUR
            <span className="rounded-full bg-[var(--teal)] px-2 py-0.5 text-xs font-semibold text-white">
              Main price
            </span>
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={adultPrice}
            onChange={(event) => updateField('adult', event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Children EUR
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={childPrice}
            onChange={(event) => updateField('child', event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
          />
        </label>
      </div>
    </section>
  );
}

interface ActivityFormModalProps {
  categories: string[];
  form: ActivityFormState;
  isOpen: boolean;
  isSaving: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setFormValue: <Key extends keyof ActivityFormState>(
    key: Key,
    value: ActivityFormState[Key]
  ) => void;
}

export default function ActivityFormModal({
  categories,
  form,
  isOpen,
  isSaving,
  title,
  onClose,
  onSubmit,
  setFormValue,
}: ActivityFormModalProps) {
  const heroPreviewUrl = useMemo(
    () => (form.imageFile ? URL.createObjectURL(form.imageFile) : ''),
    [form.imageFile]
  );
  const galleryFilePreviews = useMemo(
    () =>
      form.galleryFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [form.galleryFiles]
  );

  useEffect(() => {
    return () => {
      if (heroPreviewUrl) URL.revokeObjectURL(heroPreviewUrl);
    };
  }, [heroPreviewUrl]);

  useEffect(() => {
    return () => {
      galleryFilePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [galleryFilePreviews]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-5xl rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[var(--dark-card)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-[var(--dark-card)]">
          <h2 className="font-semibold text-[var(--navy)] dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:text-red-600 dark:border-gray-600 dark:text-gray-200"
            aria-label="Close activity editor"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-5">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="ID" value={form.id} onChange={(value) => setFormValue('id', value)} required />
              <TextField label="Slug" value={form.slug} onChange={(value) => setFormValue('slug', value)} required />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Name EN" value={form.nameEn} onChange={(value) => setFormValue('nameEn', value)} required />
              <TextField label="Name FR" value={form.nameFr} onChange={(value) => setFormValue('nameFr', value)} required />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </span>
                <select
                  value={form.category}
                  onChange={(event) => setFormValue('category', event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <TextField label="Duration" value={form.duration} onChange={(value) => setFormValue('duration', value)} required />
            </div>

            <TextAreaField label="Description EN" value={form.descriptionEn} onChange={(value) => setFormValue('descriptionEn', value)} required />
            <TextAreaField label="Description FR" value={form.descriptionFr} onChange={(value) => setFormValue('descriptionFr', value)} required />

            <section className="rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-600">
              <h3 className="mb-3 font-semibold text-[var(--navy)] dark:text-white">Hero image</h3>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hero image
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  required={!form.imageUrl}
                  onChange={(event) =>
                    setFormValue('imageFile', event.target.files?.[0] ?? null)
                  }
                  className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--teal)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--teal-dark)] dark:text-gray-300"
                />
                {form.imageFile && (
                  <p className="mt-2 text-sm font-medium text-[var(--teal)]">
                    Selected: {form.imageFile.name}
                  </p>
                )}
                {(heroPreviewUrl || form.imageUrl) && (
                  <img
                    src={heroPreviewUrl || resolveActivityImageUrl(form.imageUrl)}
                    alt="Hero preview"
                    className="mt-3 h-48 w-full rounded-lg object-cover"
                  />
                )}
              </label>
            </section>

            <section className="rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-600">
              <h3 className="mb-3 font-semibold text-[var(--navy)] dark:text-white">Photo gallery</h3>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gallery images
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  onChange={(event) =>
                    setFormValue('galleryFiles', [
                      ...form.galleryFiles,
                      ...Array.from(event.target.files ?? []),
                    ])
                  }
                  className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--teal)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--teal-dark)] dark:text-gray-300"
                />
              </label>

              {(form.galleryImages.length > 0 || galleryFilePreviews.length > 0) && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {form.galleryImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="group relative">
                      <img
                        src={resolveActivityImageUrl(image)}
                        alt="Gallery"
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormValue(
                            'galleryImages',
                            form.galleryImages.filter((_, imageIndex) => imageIndex !== index)
                          )
                        }
                        className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-gray-700 shadow-sm hover:text-red-600 dark:bg-gray-950/80 dark:text-gray-200"
                        aria-label="Delete gallery image"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {galleryFilePreviews.map((preview, index) => (
                    <div
                      key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                      className="group relative"
                    >
                      <img
                        src={preview.url}
                        alt={preview.file.name}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormValue(
                            'galleryFiles',
                            form.galleryFiles.filter((_, fileIndex) => fileIndex !== index)
                          )
                        }
                        className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-gray-700 shadow-sm hover:text-red-600 dark:bg-gray-950/80 dark:text-gray-200"
                        aria-label={`Remove ${preview.file.name}`}
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <BilingualItemsEditor
              label="Highlights"
              items={form.highlights}
              minItems={1}
              onChange={(items) => setFormValue('highlights', items)}
            />
            <BilingualItemsEditor
              label="Included"
              items={form.included}
              minItems={1}
              onChange={(items) => setFormValue('included', items)}
            />
            <BilingualItemsEditor
              label="Excluded"
              items={form.excluded}
              onChange={(items) => setFormValue('excluded', items)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Age EN" value={form.ageRestrictionsEn} onChange={(value) => setFormValue('ageRestrictionsEn', value)} required />
              <TextField label="Age FR" value={form.ageRestrictionsFr} onChange={(value) => setFormValue('ageRestrictionsFr', value)} required />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <TextField label="Start time" type="time" value={form.startTime} onChange={(value) => setFormValue('startTime', value)} />
              <TextField label="End time" type="time" value={form.endTime} onChange={(value) => setFormValue('endTime', value)} />
              <TextField label="Times" value={form.times} onChange={(value) => setFormValue('times', value)} />
            </div>

            <PricingFieldsEditor
              fields={form.pricingFields}
              onChange={(fields) => setFormValue('pricingFields', fields)}
            />

            <section className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 font-semibold text-[var(--navy)] dark:text-white">Pricing options</h3>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ['pickupIncluded', 'Hotel pickup included'],
                  ['availableDaily', 'Available daily'],
                  ['freeCancellation', 'Free cancellation'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={Boolean(form[key as keyof ActivityFormState])}
                      onChange={(event) =>
                        setFormValue(key as keyof ActivityFormState, event.target.checked as never)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[var(--teal)] focus:ring-[var(--teal)]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Max capacity" type="number" value={form.maxCapacity} onChange={(value) => setFormValue('maxCapacity', value)} />
              <TextField label="Max weight" type="number" value={form.maxWeight} onChange={(value) => setFormValue('maxWeight', value)} />
            </div>

            <section className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 font-semibold text-[var(--navy)] dark:text-white">Activity options</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Badges</h4>
                  <div className="space-y-2">
                    {[
                      ['featured', 'Featured'],
                      ['familyFriendly', 'Family friendly'],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={Boolean(form[key as keyof ActivityFormState])}
                          onChange={(event) =>
                            setFormValue(key as keyof ActivityFormState, event.target.checked as never)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[var(--teal)] focus:ring-[var(--teal)]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Tour type</h4>
                  <div className="space-y-2">
                    {[
                      ['privateAvailable', 'Private available'],
                      ['groupAvailable', 'Group available'],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={Boolean(form[key as keyof ActivityFormState])}
                          onChange={(event) =>
                            setFormValue(key as keyof ActivityFormState, event.target.checked as never)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[var(--teal)] focus:ring-[var(--teal)]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Features</h4>
                  <div className="space-y-2">
                    {[
                      ['childFriendly', 'Child friendly'],
                      ['pickupIncluded', 'Pickup included'],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={Boolean(form[key as keyof ActivityFormState])}
                          onChange={(event) =>
                            setFormValue(key as keyof ActivityFormState, event.target.checked as never)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[var(--teal)] focus:ring-[var(--teal)]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-[var(--dark-card)]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[var(--dark-muted)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--teal-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

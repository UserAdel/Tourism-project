import type { Activity, Language, PricingField } from '../types';

const legacyPricingLabels: Record<string, PricingField['name']> = {
  adult: { en: 'Adult', fr: 'Adulte' },
  child: { en: 'Children', fr: 'Enfants' },
  private: { en: 'Private', fr: 'Privé' },
  extraPerson: { en: 'Extra person', fr: 'Personne supplémentaire' },
  visitor: { en: 'Visitor', fr: 'Visiteur' },
};

const legacyPricingOrder = ['adult', 'child', 'private', 'extraPerson', 'visitor'] as const;

export function legacyPricingToFields(pricing: Activity['pricing'] = {}) {
  return legacyPricingOrder.reduce<PricingField[]>((fields, key) => {
    const price = pricing[key];
    if (price !== undefined) {
      fields.push({
        id: key,
        name: legacyPricingLabels[key],
        price,
        isMain: fields.length === 0,
      });
    }

    return fields;
  }, []);
}

export function getPricingFields(activity: Activity) {
  if (activity.pricingFields?.length) {
    return activity.pricingFields;
  }

  return legacyPricingToFields(activity.pricing);
}

export function getPrimaryPricingField(activity: Activity) {
  const fields = getPricingFields(activity);
  return fields.find((field) => field.id === 'adult') ?? fields.find((field) => field.isMain) ?? fields[0];
}

export function getPrimaryPrice(activity: Activity) {
  return getPrimaryPricingField(activity)?.price ?? 0;
}

export function formatPricingLabel(field: PricingField, language: Language) {
  return field.name[language] || field.name.en;
}

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { activities as fallbackActivities } from '../data/activities';
import Button from '../components/Button';
import CountryPhoneInput from '../components/CountryPhoneInput';
import type { BookingFormData } from '../types';
import { CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useActivities, useCreateBookingRequest } from '../hooks/queries';
import { normalizeActivity } from '../utils/activityImages';
import {
  buildInternationalPhoneNumber,
  getDefaultPhoneCountry,
  getPhoneCountry,
} from '../utils/phoneNumbers';

type GuestCountField = 'adults' | 'children';
type BookingFormState = Omit<BookingFormData, GuestCountField> & Record<GuestCountField, number | ''>;

export default function BookNow() {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedActivity = searchParams.get('activity') || '';
  const { data: apiActivities } = useActivities();
  const createBookingRequest = useCreateBookingRequest();
  const activities = apiActivities ?? fallbackActivities.map(normalizeActivity);
  const defaultPhoneCountryName = getDefaultPhoneCountry().name;

  const [formData, setFormData] = useState<BookingFormState>({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    nationality: '',
    arrivalDate: '',
    preferredDate: '',
    adults: 1,
    children: 0,
    language: language,
    specialRequests: '',
    selectedActivity: preselectedActivity
  });
  const [phoneCountryName, setPhoneCountryName] = useState(defaultPhoneCountryName);
  const [whatsappCountryName, setWhatsappCountryName] = useState(defaultPhoneCountryName);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'adults' || name === 'children') {
      if (value === '') {
        setFormData((prev) => ({ ...prev, [name]: '' }));
        return;
      }

      if (!/^\d+$/.test(value)) return;

      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
      return;
    }

    const nextValue = value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.adults === '' || formData.adults < 1 || formData.children === '') {
      toast.error(
        language === 'en'
          ? 'Please enter at least 1 adult and 0 or more children.'
          : 'Veuillez entrer au moins 1 adulte et 0 enfant ou plus.'
      );
      return;
    }

    setIsSubmitting(true);

    const phoneCountry = getPhoneCountry(phoneCountryName);
    const whatsappCountry = getPhoneCountry(whatsappCountryName);
    const phone = buildInternationalPhoneNumber(phoneCountry.dialCode, formData.phone);
    const whatsapp = buildInternationalPhoneNumber(whatsappCountry.dialCode, formData.whatsapp);

    const bookingPayload: BookingFormData = {
      ...formData,
      phone,
      whatsapp,
      adults: formData.adults,
      children: formData.children,
    };

    try {
      await createBookingRequest.mutateAsync(bookingPayload);
      setSubmitted(true);
    } catch {
      toast.error(
        language === 'en'
          ? 'Could not process your booking. Please try again.'
          : 'Impossible de traiter votre réservation. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[var(--dark-page)] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
            {language === 'en' ? 'Request Sent!' : 'Demande Envoyée!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {language === 'en'
              ? 'Your booking request has been saved. We will contact you via WhatsApp to confirm the details.'
              : 'Votre demande de réservation a été enregistrée. Nous vous contacterons via WhatsApp pour confirmer les détails.'}
          </p>
          <Button onClick={() => setSubmitted(false)} className="w-full">
            {language === 'en' ? 'Make Another Booking' : 'Faire une Autre Réservation'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[var(--dark-page)] min-h-screen">
      <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--turquoise)] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('booking.title')}</h1>
          <p className="text-xl text-white/90">
            {language === 'en'
              ? 'Fill out the form below and we\'ll contact you via WhatsApp to confirm'
              : 'Remplissez le formulaire ci-dessous et nous vous contacterons via WhatsApp pour confirmer'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-[var(--dark-card)] rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('booking.activity')} *
              </label>
              <select
                name="selectedActivity"
                value={formData.selectedActivity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
              >
                <option value="">
                  {language === 'en' ? 'Select an activity' : 'Sélectionner une activité'}
                </option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.slug}>
                    {activity.name[language]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.fullName')} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div className="md:col-span-2">
                <CountryPhoneInput
                  id="phone"
                  label={t('booking.phone')}
                  value={formData.phone}
                  countryName={phoneCountryName}
                  language={language}
                  onCountryNameChange={setPhoneCountryName}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <CountryPhoneInput
                  id="whatsapp"
                  label={t('booking.whatsapp')}
                  value={formData.whatsapp}
                  countryName={whatsappCountryName}
                  language={language}
                  onCountryNameChange={setWhatsappCountryName}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, whatsapp: value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.nationality')} *
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.arrivalDate')} *
                </label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.date')} *
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.adults')} *
                </label>
                <input
                  type="text"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  placeholder={language === 'en' ? 'e.g. 2' : 'ex. 2'}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.children')} *
                </label>
                <input
                  type="text"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  placeholder={language === 'en' ? 'e.g. 0' : 'ex. 0'}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.language')} *
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('booking.requests')}
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
              />
            </div>

            <div className="bg-[var(--sand)] dark:bg-[var(--dark-muted)] p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {language === 'en'
                  ? 'No online payment is required. Submit your request and we will confirm availability via WhatsApp.'
                  : 'Aucun paiement en ligne n’est requis. Envoyez votre demande et nous confirmerons la disponibilité via WhatsApp.'}
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                t('booking.submitting')
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Submit Booking Request' : 'Envoyer la Demande'}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

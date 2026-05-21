import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { activities as fallbackActivities } from '../data/activities';
import Button from '../components/Button';
import type { BookingFormData } from '../types';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useActivities, useCreateBookingRequest } from '../hooks/queries';
import { normalizeActivity } from '../utils/activityImages';

export default function BookNow() {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedActivity = searchParams.get('activity') || '';
  const { data: apiActivities } = useActivities();
  const createBookingRequest = useCreateBookingRequest();
  const activities = apiActivities ?? fallbackActivities.map(normalizeActivity);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    hotelName: '',
    roomNumber: '',
    nationality: '',
    preferredDate: '',
    adults: 1,
    children: 0,
    language: language,
    specialRequests: '',
    selectedActivity: preselectedActivity
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const nextValue = name === 'adults' || name === 'children' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedActivityData = activities.find((a) => a.slug === formData.selectedActivity);
    const activityName = selectedActivityData?.name[language] || formData.selectedActivity;

    const whatsappMessage = `
*New Booking Request*

*Activity:* ${activityName}
*Name:* ${formData.fullName}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*WhatsApp:* ${formData.whatsapp}
*Hotel:* ${formData.hotelName}
${formData.roomNumber ? `*Room:* ${formData.roomNumber}` : ''}
*Nationality:* ${formData.nationality}
*Date:* ${formData.preferredDate}
*Adults:* ${formData.adults}
*Children:* ${formData.children}
*Language:* ${formData.language}
${formData.specialRequests ? `*Special Requests:* ${formData.specialRequests}` : ''}
    `.trim();

    try {
      await createBookingRequest.mutateAsync(formData);
      setIsSubmitting(false);
      setSubmitted(true);
      window.open(
        `https://wa.me/201234567890?text=${encodeURIComponent(whatsappMessage)}`,
        '_blank'
      );
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        language === 'en'
          ? 'Could not save your booking request. Please try again.'
          : 'Impossible d enregistrer votre demande. Veuillez réessayer.'
      );
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
              ? 'Your booking request was saved and WhatsApp has opened for quick confirmation.'
              : 'Votre demande de réservation a été enregistrée et WhatsApp est ouvert pour confirmation rapide.'}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.phone')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.whatsapp')} *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.hotel')} *
                </label>
                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.room')}
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
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
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('booking.children')} *
                </label>
                <input
                  type="number"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  required
                  min="0"
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
                  ? 'By submitting this form, you will be redirected to WhatsApp to send your booking request. No payment is required at this stage.'
                  : 'En soumettant ce formulaire, vous serez redirigé vers WhatsApp pour envoyer votre demande de réservation. Aucun paiement n\'est requis à ce stade.'}
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                t('booking.submitting')
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('booking.submit')}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { activities as fallbackActivities } from '../data/activities';
import Button from '../components/Button';
import type { BookingFormData } from '../types';
import { CheckCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useActivities, useCreateBookingRequest, useInitiatePayment } from '../hooks/queries';
import { normalizeActivity } from '../utils/activityImages';

export default function BookNow() {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedActivity = searchParams.get('activity') || '';
  const { data: apiActivities } = useActivities();
  const createBookingRequest = useCreateBookingRequest();
  const initiatePayment = useInitiatePayment();
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

    try {
      // 1. Create booking request
      const booking = await createBookingRequest.mutateAsync(formData);

      // 2. Calculate total amount from activity pricing
      const pricing = selectedActivityData?.pricing;
      const adultPrice = pricing?.adult || 0;
      const childPrice = pricing?.child || 0;
      const totalAmount = adultPrice * formData.adults + childPrice * formData.children;

      if (totalAmount <= 0) {
        setIsSubmitting(false);
        toast.error(
          language === 'en'
            ? 'Could not determine the price for this activity.'
            : 'Impossible de déterminer le prix de cette activité.'
        );
        return;
      }

      // 3. Initiate Kashier payment
      const paymentResponse = await initiatePayment.mutateAsync({
        bookingRequestId: booking._id,
        amount: totalAmount,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
      });

      // 4. Redirect to Kashier payment page
      if (paymentResponse.sessionUrl) {
        window.location.href = paymentResponse.sessionUrl;
      } else {
        throw new Error('No session URL returned');
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        language === 'en'
          ? 'Could not process your booking. Please try again.'
          : 'Impossible de traiter votre réservation. Veuillez réessayer.'
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
              ? 'Your booking request has been saved. You will be redirected to the payment page shortly.'
              : 'Votre demande de réservation a été enregistrée. Vous serez redirigé vers la page de paiement.'}
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
                  type="text"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
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
                  ? 'By submitting this form, you will be redirected to a secure payment page to complete your booking.'
                  : 'En soumettant ce formulaire, vous serez redirigé vers une page de paiement sécurisée pour finaliser votre réservation.'}
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                t('booking.submitting')
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Book & Pay Now' : 'Réserver & Payer'}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/Button';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateContactRequest } from '../hooks/queries';

export default function Contact() {
  const { language, t } = useLanguage();
  const createContactRequest = useCreateContactRequest();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const whatsappMessage = `
*Contact Form Message*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Message:* ${formData.message}
    `.trim();

    try {
      await createContactRequest.mutateAsync(formData);
      setSubmitted(true);
      window.open(
        `https://wa.me/201234567890?text=${encodeURIComponent(whatsappMessage)}`,
        '_blank'
      );
    } catch (error) {
      toast.error(
        language === 'en'
          ? 'Could not save your message. Please try again.'
          : 'Impossible d enregistrer votre message. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-[var(--dark-page)] min-h-screen">
      <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--turquoise)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-white/90">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
              {t('contact.info')}
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--sand)] dark:bg-[var(--dark-muted)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[var(--teal)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--navy)] dark:text-white mb-1">
                    {t('contact.phone')}
                  </h3>
                  <a
                    href="tel:+201234567890"
                    className="text-gray-600 dark:text-gray-300 hover:text-[var(--teal)] transition-colors"
                  >
                    +20 123 456 7890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--sand)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-[var(--teal)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--navy)] mb-1">
                    {t('contact.whatsapp')}
                  </h3>
                  <a
                    href="https://wa.me/201234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[var(--teal)] transition-colors"
                  >
                    +20 123 456 7890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--sand)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[var(--teal)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--navy)] mb-1">
                    {t('contact.email_label')}
                  </h3>
                  <a
                    href="mailto:info@hurghadafrenchguide.com"
                    className="text-gray-600 hover:text-[var(--teal)] transition-colors"
                  >
                    info@hurghadafrenchguide.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--sand)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[var(--teal)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--navy)] mb-1">
                    {t('contact.location')}
                  </h3>
                  <p className="text-gray-600">
                    Hurghada, Red Sea<br />Egypt
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--sand)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[var(--teal)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--navy)] mb-1">
                    {language === 'en' ? 'Hours' : 'Horaires'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' ? 'Available 24/7 on WhatsApp' : 'Disponible 24/7 sur WhatsApp'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--turquoise)] rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">
                {language === 'en' ? 'Quick Response Guaranteed' : 'Réponse Rapide Garantie'}
              </h3>
              <p className="text-white/90 text-sm">
                {language === 'en'
                  ? 'We respond to all WhatsApp messages within 2 hours during business hours (8 AM - 10 PM Egypt time)'
                  : 'Nous répondons à tous les messages WhatsApp dans les 2 heures pendant les heures d\'ouverture (8h - 22h heure d\'Égypte)'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--dark-card)] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
              {t('contact.send')}
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--navy)] dark:text-white mb-2">
                  {language === 'en' ? 'Message Sent!' : 'Message Envoyé!'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {language === 'en'
                    ? 'Your message was saved and WhatsApp has opened for quick follow-up.'
                    : 'Votre message a été enregistré et WhatsApp est ouvert pour un suivi rapide.'}
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  {language === 'en' ? 'Send Another Message' : 'Envoyer Un Autre Message'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.email')} *
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
                    {t('contact.message')} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    language === 'en' ? 'Sending...' : 'Envoi...'
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('contact.send')}
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {language === 'en'
                    ? 'This will open WhatsApp to send your message'
                    : 'Cela ouvrira WhatsApp pour envoyer votre message'}
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-[var(--dark-card)] rounded-2xl shadow-lg overflow-hidden h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220924.52196876685!2d33.647788!3d27.25738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14531a7d47c3c499%3A0x86a8bd14e7de7081!2sHurghada%2C%20Red%20Sea%20Governorate%2C%20Egypt!5e0!3m2!1sen!2s!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hurghada Map"
          />
        </div>
      </div>
    </div>
  );
}

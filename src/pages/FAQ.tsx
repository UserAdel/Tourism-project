import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Button from '../components/Button';

export default function FAQ() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: {
        en: 'Are hotel transfers included in all excursions?',
        fr: 'Les transferts hôtel sont-ils inclus dans toutes les excursions?'
      },
      answer: {
        en: 'Most of our excursions include complimentary round-trip hotel transfers from Hurghada, Makadi Bay, Sahl Hasheesh, and El Gouna. The exact pickup time will be confirmed via WhatsApp the evening before your excursion. Some activities like Parasailing require you to meet at the marina.',
        fr: 'La plupart de nos excursions incluent des transferts hôtel aller-retour gratuits depuis Hurghada, Makadi Bay, Sahl Hasheesh et El Gouna. L\'heure exacte de prise en charge sera confirmée via WhatsApp la veille de votre excursion. Certaines activités comme le parachute ascensionnel nécessitent un rendez-vous à la marina.'
      }
    },
    {
      question: {
        en: 'What are the age restrictions for activities?',
        fr: 'Quelles sont les restrictions d\'âge pour les activités?'
      },
      answer: {
        en: 'Age restrictions vary by activity. Most island trips welcome all ages (children under 3-4 years often free). Dolphin swimming requires participants to be 4+ years old. Horse riding is for guests 6+ years with a maximum weight of 90kg. Each activity page lists specific age requirements.',
        fr: 'Les restrictions d\'âge varient selon l\'activité. La plupart des excursions en île accueillent tous les âges (enfants de moins de 3-4 ans souvent gratuits). La nage avec les dauphins nécessite que les participants aient 4 ans et plus. L\'équitation est pour les invités de 6 ans et plus avec un poids maximum de 90kg. Chaque page d\'activité répertorie les exigences d\'âge spécifiques.'
      }
    },
    {
      question: {
        en: 'What is your cancellation policy?',
        fr: 'Quelle est votre politique d\'annulation?'
      },
      answer: {
        en: 'Free cancellation up to 24 hours before the excursion. Cancellations within 24 hours are subject to full charge. We understand plans can change - contact us via WhatsApp as soon as possible if you need to cancel or reschedule.',
        fr: 'Annulation gratuite jusqu\'à 24 heures avant l\'excursion. Les annulations dans les 24 heures sont soumises à des frais complets. Nous comprenons que les plans peuvent changer - contactez-nous via WhatsApp dès que possible si vous devez annuler ou reprogrammer.'
      }
    },
    {
      question: {
        en: 'Do I need to pay online?',
        fr: 'Dois-je payer en ligne?'
      },
      answer: {
        en: 'No online payment is required. Our booking process is inquiry-based - you submit your request, and we confirm availability via WhatsApp. Payment can be made in cash (Egyptian Pounds or Euros) at pickup, or via bank transfer if preferred. We\'ll discuss payment options when confirming your booking.',
        fr: 'Aucun paiement en ligne n\'est requis. Notre processus de réservation est basé sur les demandes - vous soumettez votre demande et nous confirmons la disponibilité via WhatsApp. Le paiement peut être effectué en espèces (livres égyptiennes ou euros) à la prise en charge, ou par virement bancaire si vous préférez. Nous discuterons des options de paiement lors de la confirmation de votre réservation.'
      }
    },
    {
      question: {
        en: 'What should I bring on excursions?',
        fr: 'Que dois-je apporter lors des excursions?'
      },
      answer: {
        en: 'Essentials: Sunscreen (high SPF), sunglasses, hat, swimwear, towel, and comfortable shoes. For island trips, bring waterproof phone cases if desired. For historical tours, wear modest clothing covering shoulders and knees. Camera/GoPro for memories! We provide snorkeling equipment, but you\'re welcome to bring your own.',
        fr: 'Essentiels: Crème solaire (FPS élevé), lunettes de soleil, chapeau, maillot de bain, serviette et chaussures confortables. Pour les excursions en île, apportez des étuis de téléphone étanches si désiré. Pour les visites historiques, portez des vêtements modestes couvrant les épaules et les genoux. Appareil photo/GoPro pour les souvenirs! Nous fournissons l\'équipement de plongée, mais vous êtes libre d\'apporter le vôtre.'
      }
    },
    {
      question: {
        en: 'Are your guides French-speaking?',
        fr: 'Vos guides parlent-ils français?'
      },
      answer: {
        en: 'Yes! All our guides are fluent French speakers. Many are native French speakers or have studied in French-speaking countries. For historical tours like Luxor and the Grand Egyptian Museum, our guides are professional Egyptologists who speak French fluently.',
        fr: 'Oui! Tous nos guides parlent couramment le français. Beaucoup sont francophones natifs ou ont étudié dans des pays francophones. Pour les visites historiques comme Louxor et le Grand Musée Égyptien, nos guides sont des égyptologues professionnels qui parlent couramment le français.'
      }
    },
    {
      question: {
        en: 'What happens if weather conditions are bad?',
        fr: 'Que se passe-t-il si les conditions météorologiques sont mauvaises?'
      },
      answer: {
        en: 'Guest safety is our priority. If weather makes an excursion unsafe (high winds, rough seas), we\'ll contact you to reschedule or offer a full refund. The Red Sea typically has excellent weather year-round, but occasional storms do occur. We monitor conditions closely.',
        fr: 'La sécurité des invités est notre priorité. Si la météo rend une excursion dangereuse (vents forts, mer agitée), nous vous contacterons pour reprogrammer ou offrir un remboursement complet. La Mer Rouge a généralement un temps excellent toute l\'année, mais des tempêtes occasionnelles se produisent. Nous surveillons les conditions de près.'
      }
    },
    {
      question: {
        en: 'Can I book private tours?',
        fr: 'Puis-je réserver des excursions privées?'
      },
      answer: {
        en: 'Absolutely! Many of our excursions are available as private tours. The Speed Boat is exclusively private (up to 7 guests). Other activities like Orange Bay, Luxor, and Grand Egyptian Museum can be arranged as private tours. Private tours offer flexibility with timing and itinerary. Contact us for private tour pricing.',
        fr: 'Absolument! Beaucoup de nos excursions sont disponibles en tours privés. Le bateau rapide est exclusivement privé (jusqu\'à 7 invités). D\'autres activités comme Orange Bay, Louxor et le Grand Musée Égyptien peuvent être organisées en tours privés. Les tours privés offrent une flexibilité avec le timing et l\'itinéraire. Contactez-nous pour les tarifs des tours privés.'
      }
    },
    {
      question: {
        en: 'How do I receive confirmation of my booking?',
        fr: 'Comment puis-je recevoir la confirmation de ma réservation?'
      },
      answer: {
        en: 'All confirmations are sent via WhatsApp within 2-4 hours of your booking request. You\'ll receive booking details, pickup time, what to bring, and emergency contact numbers. The evening before your excursion, we\'ll send a reminder with the exact pickup time.',
        fr: 'Toutes les confirmations sont envoyées via WhatsApp dans les 2 à 4 heures suivant votre demande de réservation. Vous recevrez les détails de la réservation, l\'heure de prise en charge, ce qu\'il faut apporter et les numéros de contact d\'urgence. La veille de votre excursion, nous enverrons un rappel avec l\'heure exacte de prise en charge.'
      }
    },
    {
      question: {
        en: 'Are meals included?',
        fr: 'Les repas sont-ils inclus?'
      },
      answer: {
        en: 'It depends on the excursion. Island trips (Orange Bay, Eden Island, Mahmya) include lunch and drinks. Full-day tours (Luxor, Grand Egyptian Museum) include lunch. Shorter activities like dolphin shows and parasailing do not include meals. Check each activity page for specific inclusions.',
        fr: 'Cela dépend de l\'excursion. Les voyages en île (Orange Bay, Eden Island, Mahmya) incluent le déjeuner et les boissons. Les visites d\'une journée complète (Louxor, Grand Musée Égyptien) incluent le déjeuner. Les activités plus courtes comme les spectacles de dauphins et le parachute ascensionnel n\'incluent pas les repas. Vérifiez chaque page d\'activité pour les inclusions spécifiques.'
      }
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 dark:bg-[var(--dark-page)] min-h-screen">
      <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--turquoise)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'en' ? 'Frequently Asked Questions' : 'Questions Fréquemment Posées'}
          </h1>
          <p className="text-xl text-white/90">
            {language === 'en'
              ? 'Find answers to common questions about our excursions'
              : 'Trouvez des réponses aux questions courantes sur nos excursions'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[var(--dark-card)] rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[var(--dark-muted)] transition-colors"
              >
                <span className="font-semibold text-[var(--navy)] dark:text-white pr-4">
                  {faq.question[language]}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--teal)] flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                  {faq.answer[language]}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--turquoise)] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Still Have Questions?' : 'Vous Avez Encore Des Questions?'}
          </h2>
          <p className="mb-6 text-white/90">
            {language === 'en'
              ? 'Contact us directly on WhatsApp and our team will be happy to help'
              : 'Contactez-nous directement sur WhatsApp et notre équipe se fera un plaisir de vous aider'}
          </p>
          <a
            href="https://wa.me/201234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="!bg-white !text-[var(--teal)] hover:!bg-gray-100">
              <MessageCircle className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Contact Us on WhatsApp' : 'Contactez-Nous sur WhatsApp'}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

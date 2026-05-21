import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/Button';

export default function PaymentStatus() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--dark-page)] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isSuccess
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
          {isSuccess
            ? language === 'en'
              ? 'Payment Successful!'
              : 'Paiement Réussi!'
            : language === 'en'
              ? 'Payment Failed'
              : 'Paiement Échoué'}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-2">
          {isSuccess
            ? language === 'en'
              ? 'Your booking has been confirmed. Thank you for your payment!'
              : 'Votre réservation a été confirmée. Merci pour votre paiement!'
            : language === 'en'
              ? 'Something went wrong with your payment. Please try again.'
              : 'Un problème est survenu avec votre paiement. Veuillez réessayer.'}
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {language === 'en' ? 'Order ID:' : 'N° de commande:'} {orderId}
          </p>
        )}

        <div className="space-y-3">
          {isSuccess ? (
            <Link to="/">
              <Button className="w-full">
                {language === 'en' ? 'Back to Home' : 'Retour à l\'accueil'}
              </Button>
            </Link>
          ) : (
            <Link to="/book">
              <Button className="w-full">
                {language === 'en' ? 'Try Again' : 'Réessayer'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

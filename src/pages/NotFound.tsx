import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/Button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--teal)] to-[var(--turquoise)] flex items-center justify-center px-4">
      <div className="text-center text-white max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {language === 'en' ? 'Page Not Found' : 'Page Non Trouvée'}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === 'en'
              ? 'Oops! The page you\'re looking for seems to have drifted away like a boat on the Red Sea.'
              : 'Oups! La page que vous recherchez semble avoir dérivé comme un bateau sur la Mer Rouge.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto bg-white text-[var(--teal)] hover:bg-gray-100">
              <Home className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Back to Home' : 'Retour à l\'Accueil'}
            </Button>
          </Link>
          <Link to="/activities">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-[var(--teal)]"
            >
              <Search className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Browse Activities' : 'Parcourir les Activités'}
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-white/80">
            {language === 'en'
              ? 'Need help finding what you\'re looking for?'
              : 'Besoin d\'aide pour trouver ce que vous cherchez?'}
          </p>
          <a
            href="https://wa.me/201234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-[var(--gold)] hover:text-white transition-colors font-medium"
          >
            {language === 'en' ? 'Contact us on WhatsApp' : 'Contactez-nous sur WhatsApp'}
          </a>
        </div>
      </div>
    </div>
  );
}

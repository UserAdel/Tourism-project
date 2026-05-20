import { useLanguage } from '../contexts/LanguageContext';
import { tourismImages } from '../data/tourismImages';
import { Award, Users, Heart, Languages, Star } from 'lucide-react';

export default function About() {
  const { language } = useLanguage();

  const values = [
    {
      icon: Languages,
      title: language === 'en' ? 'French Expertise' : 'Expertise Francophone',
      description:
        language === 'en'
          ? 'All our guides are fluent French speakers with deep knowledge of Egyptian history and culture.'
          : 'Tous nos guides parlent couramment français avec une connaissance approfondie de l\'histoire et de la culture égyptiennes.'
    },
    {
      icon: Award,
      title: language === 'en' ? 'Local Knowledge' : 'Connaissance Locale',
      description:
        language === 'en'
          ? 'Based in Hurghada for over 10 years, we know the Red Sea like no one else.'
          : 'Basés à Hurghada depuis plus de 10 ans, nous connaissons la Mer Rouge comme personne.'
    },
    {
      icon: Heart,
      title: language === 'en' ? 'Passion for Excellence' : 'Passion pour l\'Excellence',
      description:
        language === 'en'
          ? 'We are passionate about creating unforgettable experiences for every guest.'
          : 'Nous sommes passionnés par la création d\'expériences inoubliables pour chaque invité.'
    },
    {
      icon: Users,
      title: language === 'en' ? 'Family-Oriented' : 'Orienté Famille',
      description:
        language === 'en'
          ? 'We specialize in family-friendly excursions that delight guests of all ages.'
          : 'Nous nous spécialisons dans les excursions familiales qui ravissent les invités de tous âges.'
    }
  ];

  const stats = [
    { number: '10+', label: language === 'en' ? 'Years Experience' : 'Ans d\'Expérience' },
    { number: '50+', label: language === 'en' ? 'Excursions' : 'Excursions' },
    { number: '10,000+', label: language === 'en' ? 'Happy Guests' : 'Clients Satisfaits' },
    { number: '4.9/5', label: language === 'en' ? 'Average Rating' : 'Note Moyenne' }
  ];

  return (
    <div className="bg-white dark:bg-[var(--dark-page)]">
      <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--turquoise)] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {language === 'en' ? 'About Hurghada French Guide' : 'À Propos d\'Hurghada French Guide'}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Your trusted partner for authentic Red Sea experiences with expert French-speaking guides'
              : 'Votre partenaire de confiance pour des expériences authentiques en Mer Rouge avec des guides francophones experts'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[var(--teal)] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--navy)] mb-6">
                {language === 'en' ? 'Our Story' : 'Notre Histoire'}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {language === 'en'
                    ? 'Founded by a team of passionate travel enthusiasts, Hurghada French Guide was born from a desire to share the incredible beauty of the Red Sea with French-speaking travelers from around the world.'
                    : 'Fondée par une équipe de passionnés de voyage, Hurghada French Guide est née du désir de partager l\'incroyable beauté de la Mer Rouge avec les voyageurs francophones du monde entier.'}
                </p>
                <p>
                  {language === 'en'
                    ? 'For over a decade, we\'ve been creating unforgettable experiences, from pristine island escapes to awe-inspiring historical tours. Our French-speaking guides don\'t just show you the sights - they bring Egypt\'s rich history and vibrant culture to life.'
                    : 'Depuis plus d\'une décennie, nous créons des expériences inoubliables, des escapades sur des îles immaculées aux visites historiques impressionnantes. Nos guides francophones ne se contentent pas de vous montrer les sites - ils donnent vie à la riche histoire et à la culture vibrante de l\'Égypte.'}
                </p>
                <p>
                  {language === 'en'
                    ? 'Every excursion is carefully curated to ensure safety, comfort, and authenticity. We believe in sustainable tourism that respects local communities and the natural environment.'
                    : 'Chaque excursion est soigneusement organisée pour assurer sécurité, confort et authenticité. Nous croyons au tourisme durable qui respecte les communautés locales et l\'environnement naturel.'}
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={tourismImages.redSea}
                alt="Red Sea"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--navy)] mb-12 text-center">
            {language === 'en' ? 'Our Values' : 'Nos Valeurs'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-[var(--sand)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-10 h-10 text-[var(--teal)]" />
                </div>
                <h3 className="font-semibold text-lg text-[var(--navy)] mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--sand)] to-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--navy)] mb-4">
            {language === 'en' ? 'Why Choose Us?' : 'Pourquoi Nous Choisir?'}
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            {language === 'en'
              ? 'We combine local expertise, French language fluency, and a genuine passion for hospitality to create experiences that exceed expectations. Every tour is an opportunity to make lasting memories.'
              : 'Nous combinons expertise locale, maîtrise du français et véritable passion pour l\'hospitalité pour créer des expériences qui dépassent les attentes. Chaque visite est une opportunité de créer des souvenirs durables.'}
          </p>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-[var(--gold)] text-[var(--gold)]" />
            ))}
          </div>
          <p className="text-[var(--teal)] font-semibold mt-2">
            {language === 'en' ? '4.9/5 from 2,000+ reviews' : '4,9/5 sur plus de 2 000 avis'}
          </p>
        </div>
      </div>
    </div>
  );
}

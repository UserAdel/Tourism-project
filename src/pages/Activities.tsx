import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { activities, categories } from '../data/activities';
import ActivityCard from '../components/ActivityCard';
import { Filter } from 'lucide-react';

export default function Activities() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceMin: '',
    priceMax: '',
    private: false,
    group: false,
    childFriendly: false,
    pickupIncluded: false
  });

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (filters.category && activity.category !== filters.category) return false;

      const price = activity.pricing.adult || activity.pricing.private || 0;
      if (filters.priceMin && price < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && price > parseInt(filters.priceMax)) return false;

      if (filters.private && !activity.privateAvailable) return false;
      if (filters.group && !activity.groupAvailable) return false;
      if (filters.childFriendly && !activity.childFriendly) return false;
      if (filters.pickupIncluded && !activity.pickupIncluded) return false;

      return true;
    });
  }, [filters]);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      private: false,
      group: false,
      childFriendly: false,
      pickupIncluded: false
    });
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== '').length;

  return (
    <div className="bg-gray-50 dark:bg-[var(--dark-page)] min-h-screen">
      <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--turquoise)] dark:from-[var(--turquoise)] dark:to-[var(--teal)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('nav.activities')}
          </h1>
          <p className="text-xl text-white/90">
            {language === 'en'
              ? 'Discover all our amazing excursions and experiences'
              : 'Découvrez toutes nos excursions et expériences incroyables'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {filteredActivities.length} {language === 'en' ? 'activities found' : 'activités trouvées'}
          </p>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-[var(--dark-card)] rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white"
          >
            <Filter className="w-4 h-4" />
            {t('filters.title')}
            {activeFilterCount > 0 && (
              <span className="bg-[var(--teal)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          <aside
            className={`${
              filtersOpen ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 bg-white dark:bg-[var(--dark-card)] rounded-2xl p-6 shadow-lg h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-[var(--navy)] dark:text-white">{t('filters.title')}</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[var(--teal)] text-sm hover:underline"
                >
                  {t('filters.clearAll')}
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.category')}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                >
                  <option value="">{t('filters.all')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name[language]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.priceRange')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[var(--dark-muted)] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.type')}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.private}
                      onChange={(e) => handleFilterChange('private', e.target.checked)}
                      className="w-4 h-4 text-[var(--teal)] border-gray-300 dark:border-gray-600 rounded focus:ring-[var(--teal)]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('filters.private')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.group}
                      onChange={(e) => handleFilterChange('group', e.target.checked)}
                      className="w-4 h-4 text-[var(--teal)] border-gray-300 dark:border-gray-600 rounded focus:ring-[var(--teal)]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('filters.group')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.features')}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.childFriendly}
                      onChange={(e) => handleFilterChange('childFriendly', e.target.checked)}
                      className="w-4 h-4 text-[var(--teal)] border-gray-300 dark:border-gray-600 rounded focus:ring-[var(--teal)]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('filters.childFriendly')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pickupIncluded}
                      onChange={(e) => handleFilterChange('pickupIncluded', e.target.checked)}
                      className="w-4 h-4 text-[var(--teal)] border-gray-300 dark:border-gray-600 rounded focus:ring-[var(--teal)]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('filters.pickupIncluded')}</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => setFiltersOpen(false)}
              className="lg:hidden w-full mt-6 px-4 py-2 bg-[var(--teal)] text-white rounded-lg"
            >
              {language === 'en' ? 'Apply Filters' : 'Appliquer les Filtres'}
            </button>
          </aside>

          <div className="flex-1">
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {language === 'en'
                    ? 'No activities found matching your filters'
                    : 'Aucune activité trouvée correspondant à vos filtres'}
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[var(--teal)] dark:text-[var(--turquoise)] hover:underline"
                >
                  {t('filters.clearAll')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { countries, type Country } from '../data/countries';
import type { Language } from '../types';
import { getPhoneCountry } from '../utils/phoneNumbers';

interface CountryPhoneInputProps {
  id: string;
  label: string;
  value: string;
  countryName: string;
  language: Language;
  onCountryNameChange: (countryName: string) => void;
  onValueChange: (value: string) => void;
  required?: boolean;
}

export default function CountryPhoneInput({
  id,
  label,
  value,
  countryName,
  language,
  onCountryNameChange,
  onValueChange,
  required = false,
}: CountryPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedCountry = getPhoneCountry(countryName);

  const filteredCountries = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return countries;
    }

    return countries.filter((country) => {
      const searchableCountry = `${country.name} ${country.dialCode}`.toLowerCase();
      return searchableCountry.includes(normalizedSearchTerm);
    });
  }, [searchTerm]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('touchstart', closeOnOutsideClick);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('touchstart', closeOnOutsideClick);
    };
  }, []);

  const inputId = `${id}-number`;
  const listboxId = `${id}-country-listbox`;
  const searchPlaceholder = language === 'en' ? 'Search country or code' : 'Rechercher pays ou indicatif';

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  const handleCountrySelect = (country: Country) => {
    onCountryNameChange(country.name);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div ref={rootRef}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label} {required ? '*' : ''}
      </label>

      <div className="flex min-w-0">
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label={`${label} country code`}
            aria-expanded={isOpen}
            aria-controls={listboxId}
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-full min-h-12 w-36 sm:w-44 items-center gap-2 rounded-l-lg border border-r-0 border-gray-300 bg-white px-3 text-left text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white dark:hover:bg-white/5"
          >
            <span className="text-lg leading-none">{selectedCountry.flag}</span>
            <span className="min-w-0 flex-1 truncate text-sm">{selectedCountry.name}</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-300" />
          </button>

          {isOpen && (
            <div className="absolute left-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-[var(--dark-card)]">
              <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2 dark:border-gray-700">
                <Search className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  autoFocus
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                />
              </div>

              <div id={listboxId} role="listbox" className="max-h-64 overflow-y-auto py-1">
                {filteredCountries.map((country) => {
                  const isSelected = country.name === selectedCountry.name;

                  return (
                    <button
                      key={country.name}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleCountrySelect(country)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-800 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-white/10"
                    >
                      <span className="text-lg leading-none">{country.flag}</span>
                      <span className="min-w-0 flex-1 truncate">{country.name}</span>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        {country.dialCode}
                      </span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-[var(--teal)]" />}
                    </button>
                  );
                })}

                {filteredCountries.length === 0 && (
                  <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {language === 'en' ? 'No country found' : 'Aucun pays trouvé'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <input
          id={inputId}
          type="tel"
          value={value}
          onChange={handleInputChange}
          required={required}
          inputMode="tel"
          className="min-h-12 min-w-0 flex-1 rounded-r-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
        />
      </div>
    </div>
  );
}

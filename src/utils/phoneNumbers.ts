import { countries, type Country } from '../data/countries';

const fallbackPhoneCountry: Country = {
  flag: '\u{1F1EB}\u{1F1F7}',
  name: 'France',
  dialCode: '+33',
};

export function getDefaultPhoneCountry(): Country {
  return countries.find((country) => country.name === 'France') ?? fallbackPhoneCountry;
}

export function getPhoneCountry(countryName: string): Country {
  return countries.find((country) => country.name === countryName) ?? getDefaultPhoneCountry();
}

export function buildInternationalPhoneNumber(countryDialCode: string, phoneNumber: string): string {
  const dialDigits = countryDialCode.replace(/\D/g, '');
  const trimmedPhone = phoneNumber.trim();

  if (!dialDigits || !trimmedPhone) {
    return trimmedPhone;
  }

  const compactPhone = trimmedPhone.replace(/[^\d+]/g, '');

  if (compactPhone.startsWith('+')) {
    return `+${compactPhone.slice(1).replace(/\D/g, '')}`;
  }

  if (compactPhone.startsWith('00')) {
    return `+${compactPhone.slice(2).replace(/\D/g, '')}`;
  }

  let nationalDigits = compactPhone.replace(/\D/g, '');

  if (!nationalDigits) {
    return '';
  }

  if (nationalDigits.startsWith(dialDigits) && nationalDigits.length > dialDigits.length + 6) {
    return `+${nationalDigits}`;
  }

  nationalDigits = nationalDigits.replace(/^0+/, '');

  return `+${dialDigits}${nationalDigits}`;
}

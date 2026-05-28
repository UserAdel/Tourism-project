export interface Country {
  flag: string;
  name: string;
  dialCode: string;
}

export const countries: Country[] = [
  { flag: '\u{1F1E9}\u{1F1FF}', name: 'Algeria', dialCode: '+213' },
  { flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina', dialCode: '+54' },
  { flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia', dialCode: '+61' },
  { flag: '\u{1F1E6}\u{1F1F9}', name: 'Austria', dialCode: '+43' },
  { flag: '\u{1F1E7}\u{1F1EA}', name: 'Belgium', dialCode: '+32' },
  { flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil', dialCode: '+55' },
  { flag: '\u{1F1E7}\u{1F1EC}', name: 'Bulgaria', dialCode: '+359' },
  { flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada', dialCode: '+1' },
  { flag: '\u{1F1E8}\u{1F1F1}', name: 'Chile', dialCode: '+56' },
  { flag: '\u{1F1E8}\u{1F1F3}', name: 'China', dialCode: '+86' },
  { flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia', dialCode: '+57' },
  { flag: '\u{1F1ED}\u{1F1F7}', name: 'Croatia', dialCode: '+385' },
  { flag: '\u{1F1E8}\u{1F1FF}', name: 'Czech Republic', dialCode: '+420' },
  { flag: '\u{1F1E9}\u{1F1F0}', name: 'Denmark', dialCode: '+45' },
  { flag: '\u{1F1EA}\u{1F1EC}', name: 'Egypt', dialCode: '+20' },
  { flag: '\u{1F1EB}\u{1F1EE}', name: 'Finland', dialCode: '+358' },
  { flag: '\u{1F1EB}\u{1F1F7}', name: 'France', dialCode: '+33' },
  { flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany', dialCode: '+49' },
  { flag: '\u{1F1EC}\u{1F1F7}', name: 'Greece', dialCode: '+30' },
  { flag: '\u{1F1ED}\u{1F1FA}', name: 'Hungary', dialCode: '+36' },
  { flag: '\u{1F1EE}\u{1F1F3}', name: 'India', dialCode: '+91' },
  { flag: '\u{1F1EE}\u{1F1E9}', name: 'Indonesia', dialCode: '+62' },
  { flag: '\u{1F1EE}\u{1F1EA}', name: 'Ireland', dialCode: '+353' },
  { flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy', dialCode: '+39' },
  { flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan', dialCode: '+81' },
  { flag: '\u{1F1EF}\u{1F1F4}', name: 'Jordan', dialCode: '+962' },
  { flag: '\u{1F1F0}\u{1F1FC}', name: 'Kuwait', dialCode: '+965' },
  { flag: '\u{1F1F1}\u{1F1E7}', name: 'Lebanon', dialCode: '+961' },
  { flag: '\u{1F1F1}\u{1F1FA}', name: 'Luxembourg', dialCode: '+352' },
  { flag: '\u{1F1F2}\u{1F1FD}', name: 'Mexico', dialCode: '+52' },
  { flag: '\u{1F1F2}\u{1F1E6}', name: 'Morocco', dialCode: '+212' },
  { flag: '\u{1F1F3}\u{1F1F1}', name: 'Netherlands', dialCode: '+31' },
  { flag: '\u{1F1F3}\u{1F1FF}', name: 'New Zealand', dialCode: '+64' },
  { flag: '\u{1F1F3}\u{1F1F4}', name: 'Norway', dialCode: '+47' },
  { flag: '\u{1F1F5}\u{1F1F1}', name: 'Poland', dialCode: '+48' },
  { flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal', dialCode: '+351' },
  { flag: '\u{1F1F6}\u{1F1E6}', name: 'Qatar', dialCode: '+974' },
  { flag: '\u{1F1F7}\u{1F1F4}', name: 'Romania', dialCode: '+40' },
  { flag: '\u{1F1F8}\u{1F1E6}', name: 'Saudi Arabia', dialCode: '+966' },
  { flag: '\u{1F1F8}\u{1F1F3}', name: 'Senegal', dialCode: '+221' },
  { flag: '\u{1F1F7}\u{1F1F8}', name: 'Serbia', dialCode: '+381' },
  { flag: '\u{1F1F8}\u{1F1EC}', name: 'Singapore', dialCode: '+65' },
  { flag: '\u{1F1FF}\u{1F1E6}', name: 'South Africa', dialCode: '+27' },
  { flag: '\u{1F1F0}\u{1F1F7}', name: 'South Korea', dialCode: '+82' },
  { flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain', dialCode: '+34' },
  { flag: '\u{1F1F8}\u{1F1EA}', name: 'Sweden', dialCode: '+46' },
  { flag: '\u{1F1E8}\u{1F1ED}', name: 'Switzerland', dialCode: '+41' },
  { flag: '\u{1F1F9}\u{1F1F3}', name: 'Tunisia', dialCode: '+216' },
  { flag: '\u{1F1F9}\u{1F1F7}', name: 'Turkey', dialCode: '+90' },
  { flag: '\u{1F1E6}\u{1F1EA}', name: 'United Arab Emirates', dialCode: '+971' },
  { flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom', dialCode: '+44' },
  { flag: '\u{1F1FA}\u{1F1F8}', name: 'United States', dialCode: '+1' },
];

export function getCountryWithFlag(name: string): string {
  const country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return country ? `${country.flag} ${country.name}` : name;
}

export function getFlagForCountry(name: string): string {
  const country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return country?.flag ?? '';
}

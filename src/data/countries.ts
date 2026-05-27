export const countries = [
  { flag: '\u{1F1E6}\u{1F1EA}', name: 'United Arab Emirates' },
  { flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina' },
  { flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
  { flag: '\u{1F1E6}\u{1F1F9}', name: 'Austria' },
  { flag: '\u{1F1E7}\u{1F1EA}', name: 'Belgium' },
  { flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil' },
  { flag: '\u{1F1E7}\u{1F1EC}', name: 'Bulgaria' },
  { flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada' },
  { flag: '\u{1F1E8}\u{1F1F1}', name: 'Chile' },
  { flag: '\u{1F1E8}\u{1F1F3}', name: 'China' },
  { flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia' },
  { flag: '\u{1F1ED}\u{1F1F7}', name: 'Croatia' },
  { flag: '\u{1F1E8}\u{1F1FF}', name: 'Czech Republic' },
  { flag: '\u{1F1E9}\u{1F1F0}', name: 'Denmark' },
  { flag: '\u{1F1EA}\u{1F1EC}', name: 'Egypt' },
  { flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  { flag: '\u{1F1EB}\u{1F1EE}', name: 'Finland' },
  { flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany' },
  { flag: '\u{1F1EC}\u{1F1F7}', name: 'Greece' },
  { flag: '\u{1F1ED}\u{1F1FA}', name: 'Hungary' },
  { flag: '\u{1F1EE}\u{1F1F3}', name: 'India' },
  { flag: '\u{1F1EE}\u{1F1E9}', name: 'Indonesia' },
  { flag: '\u{1F1EE}\u{1F1EA}', name: 'Ireland' },
  { flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy' },
  { flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan' },
  { flag: '\u{1F1EF}\u{1F1F4}', name: 'Jordan' },
  { flag: '\u{1F1F0}\u{1F1FC}', name: 'Kuwait' },
  { flag: '\u{1F1F1}\u{1F1E7}', name: 'Lebanon' },
  { flag: '\u{1F1F1}\u{1F1FA}', name: 'Luxembourg' },
  { flag: '\u{1F1F2}\u{1F1FD}', name: 'Mexico' },
  { flag: '\u{1F1F2}\u{1F1E6}', name: 'Morocco' },
  { flag: '\u{1F1F3}\u{1F1F1}', name: 'Netherlands' },
  { flag: '\u{1F1F3}\u{1F1FF}', name: 'New Zealand' },
  { flag: '\u{1F1F3}\u{1F1F4}', name: 'Norway' },
  { flag: '\u{1F1F5}\u{1F1F1}', name: 'Poland' },
  { flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal' },
  { flag: '\u{1F1F6}\u{1F1E6}', name: 'Qatar' },
  { flag: '\u{1F1F7}\u{1F1F4}', name: 'Romania' },
  { flag: '\u{1F1F8}\u{1F1E6}', name: 'Saudi Arabia' },
  { flag: '\u{1F1F7}\u{1F1F8}', name: 'Serbia' },
  { flag: '\u{1F1F8}\u{1F1EC}', name: 'Singapore' },
  { flag: '\u{1F1FF}\u{1F1E6}', name: 'South Africa' },
  { flag: '\u{1F1F0}\u{1F1F7}', name: 'South Korea' },
  { flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain' },
  { flag: '\u{1F1F8}\u{1F1EA}', name: 'Sweden' },
  { flag: '\u{1F1E8}\u{1F1ED}', name: 'Switzerland' },
  { flag: '\u{1F1F9}\u{1F1F3}', name: 'Tunisia' },
  { flag: '\u{1F1F9}\u{1F1F7}', name: 'Turkey' },
  { flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
  { flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
];

export function getCountryWithFlag(name: string): string {
  const country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return country ? `${country.flag} ${country.name}` : name;
}

export function getFlagForCountry(name: string): string {
  const country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return country?.flag ?? '';
}

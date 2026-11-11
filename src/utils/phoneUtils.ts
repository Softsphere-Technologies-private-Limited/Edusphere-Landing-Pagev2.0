export interface CountryIsd {
  country: string;
  code: string;
  flag: string;
  sample: string;
}

export const COUNTRY_ISD_LIST: CountryIsd[] = [
  { country: 'India', code: '+91', flag: '🇮🇳', sample: '98765 43210' },
  { country: 'United States', code: '+1', flag: '🇺🇸', sample: '202 555 0123' },
  { country: 'United Kingdom', code: '+44', flag: '🇬🇧', sample: '7911 123456' },
  { country: 'United Arab Emirates', code: '+971', flag: '🇦🇪', sample: '50 123 4567' },
  { country: 'Saudi Arabia', code: '+966', flag: '🇸🇦', sample: '50 123 4567' },
  { country: 'Singapore', code: '+65', flag: '🇸🇬', sample: '8123 4567' },
  { country: 'Australia', code: '+61', flag: '🇦🇺', sample: '412 345 678' },
  { country: 'Canada', code: '+1', flag: '🇨🇦', sample: '416 555 0123' },
  { country: 'Germany', code: '+49', flag: '🇩🇪', sample: '151 23456789' },
  { country: 'France', code: '+33', flag: '🇫🇷', sample: '6 12 34 56 78' },
  { country: 'Qatar', code: '+974', flag: '🇶🇦', sample: '3312 3456' },
  { country: 'Oman', code: '+968', flag: '🇴🇲', sample: '9123 4567' },
  { country: 'Kuwait', code: '+965', flag: '🇰🇼', sample: '9123 4567' },
  { country: 'Bahrain', code: '+973', flag: '🇧🇭', sample: '3612 3456' },
  { country: 'Malaysia', code: '+60', flag: '🇲🇾', sample: '12 345 6789' },
  { country: 'Nepal', code: '+977', flag: '🇳🇵', sample: '984 1234567' },
  { country: 'Sri Lanka', code: '+94', flag: '🇱🇰', sample: '71 234 5678' },
  { country: 'Bangladesh', code: '+880', flag: '🇧🇩', sample: '1712 345678' },
  { country: 'Pakistan', code: '+92', flag: '🇵🇰', sample: '300 1234567' },
  { country: 'South Africa', code: '+27', flag: '🇿🇦', sample: '82 123 4567' },
  { country: 'Philippines', code: '+63', flag: '🇵🇭', sample: '917 123 4567' },
  { country: 'Japan', code: '+81', flag: '🇯🇵', sample: '90 1234 5678' },
  { country: 'China', code: '+86', flag: '🇨🇳', sample: '138 1234 5678' },
  { country: 'Nigeria', code: '+234', flag: '🇳🇬', sample: '802 123 4567' },
];

/**
 * Detects default ISD country code based on browser locale, timezone, or IP geolocation.
 * Defaults to +91 (India) if undetermined.
 */
export async function detectDefaultIsdCode(): Promise<string> {
  // 1. Check browser timezone
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (timeZone.includes('Kolkata') || timeZone.includes('Calcutta') || timeZone.includes('Asia/Kolkata')) {
      return '+91';
    }
    if (timeZone.startsWith('America/')) return '+1';
    if (timeZone.includes('London') || timeZone.includes('Europe/London')) return '+44';
    if (timeZone.includes('Dubai')) return '+971';
    if (timeZone.includes('Riyadh')) return '+966';
    if (timeZone.includes('Sydney') || timeZone.includes('Australia/')) return '+61';
    if (timeZone.includes('Singapore')) return '+65';
    if (timeZone.includes('Tokyo')) return '+81';
    if (timeZone.includes('Berlin') || timeZone.includes('Europe/Berlin')) return '+49';
  } catch (err) {
    console.warn('[ISD Detect] TimeZone detection fallback:', err);
  }

  // 2. Check browser navigator language
  try {
    const lang = navigator.language || '';
    if (lang.endsWith('-IN') || lang.startsWith('hi') || lang === 'en-IN') return '+91';
    if (lang.endsWith('-US') || lang.endsWith('-CA')) return '+1';
    if (lang.endsWith('-GB')) return '+44';
    if (lang.endsWith('-AE')) return '+971';
    if (lang.endsWith('-AU')) return '+61';
    if (lang.endsWith('-SG')) return '+65';
    if (lang.endsWith('-DE')) return '+49';
  } catch (e) {
    // ignore
  }

  // 3. Optional quick IP Geolocation lookup
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.country_calling_code) {
        let code = data.country_calling_code.trim();
        if (!code.startsWith('+')) code = '+' + code;
        const exists = COUNTRY_ISD_LIST.some((c) => c.code === code);
        if (exists) return code;
      }
    }
  } catch (ipErr) {
    // Fallback quietly to default
  }

  // Default fallback
  return '+91';
}

/**
 * Ensures phone number is formatted with an ISD code.
 * E.g., if input is "9876543210" and isd is "+91", returns "+91 9876543210".
 */
export function formatFullPhoneNumber(input: string, isdCode: string = '+91'): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // If already starts with '+', keep as is
  if (trimmed.startsWith('+')) return trimmed;

  // Strip non-digits
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (digitsOnly.length === 10 && isdCode === '+91') {
    return `+91 ${digitsOnly.substring(0, 5)} ${digitsOnly.substring(5)}`;
  }

  return `${isdCode} ${digitsOnly}`;
}

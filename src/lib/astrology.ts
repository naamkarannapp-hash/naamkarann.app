/**
 * Vedic Astrology Calculator for Nakshatra, Pada, Syllable (Namakshara), and Rashi.
 * Completely self-contained, offline-capable, and runs inside Next.js serverless execution.
 */

import { find as findTz } from 'geo-tz';
import type { NakshatraResult } from './types';

const NAKSHATRAS: { name: string; syllables: [string, string, string, string] }[] = [
  { name: 'Ashwini', syllables: ['Chu', 'Che', 'Cho', 'La'] },
  { name: 'Bharani', syllables: ['Lee', 'Lu', 'Le', 'Lo'] },
  { name: 'Krittika', syllables: ['A', 'Ee', 'U', 'Ea'] },
  { name: 'Rohini', syllables: ['O', 'Va', 'Vi', 'Vu'] },
  { name: 'Mrigashira', syllables: ['Ve', 'Vo', 'Ka', 'Kee'] },
  { name: 'Ardra', syllables: ['Ku', 'Gha', 'Nga', 'Chha'] },
  { name: 'Punarvasu', syllables: ['Ke', 'Ko', 'Ha', 'Hee'] },
  { name: 'Pushya', syllables: ['Hu', 'He', 'Ho', 'Da'] },
  { name: 'Ashlesha', syllables: ['Dee', 'Doo', 'De', 'Do'] },
  { name: 'Magha', syllables: ['Ma', 'Mee', 'Moo', 'Me'] },
  { name: 'Purva Phalguni', syllables: ['Mo', 'Ta', 'Tee', 'Too'] },
  { name: 'Uttara Phalguni', syllables: ['Te', 'To', 'Pa', 'Pee'] },
  { name: 'Hasta', syllables: ['Pu', 'Sha', 'Na', 'Tha'] },
  { name: 'Chitra', syllables: ['Pe', 'Po', 'Ra', 'Ree'] },
  { name: 'Swati', syllables: ['Ru', 'Re', 'Ro', 'Taa'] },
  { name: 'Vishakha', syllables: ['Tee', 'Too', 'Te', 'To'] },
  { name: 'Anuradha', syllables: ['Na', 'Nee', 'Noo', 'Ne'] },
  { name: 'Jyeshtha', syllables: ['No', 'Ya', 'Yee', 'Yoo'] },
  { name: 'Mula', syllables: ['Ye', 'Yo', 'Bha', 'Bhee'] },
  { name: 'Purva Ashadha', syllables: ['Bhu', 'Dha', 'Pha', 'Dhad'] },
  { name: 'Uttara Ashadha', syllables: ['Bhe', 'Bho', 'Ja', 'Jee'] },
  { name: 'Shravana', syllables: ['Jhi', 'Khee', 'Khu', 'Khe'] },
  { name: 'Dhanishta', syllables: ['Ga', 'Gee', 'Gu', 'Ge'] },
  { name: 'Shatabhisha', syllables: ['Go', 'Sa', 'See', 'Soo'] },
  { name: 'Purva Bhadrapada', syllables: ['Se', 'So', 'Da', 'Dee'] },
  { name: 'Uttara Bhadrapada', syllables: ['Du', 'Tha', 'Jha', 'Na'] },
  { name: 'Revati', syllables: ['De', 'Do', 'Cha', 'Chee'] },
];

const RASHIS: string[] = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrischika (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)',
];

function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function getJulianDay(year: number, month: number, day: number, utcHours: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + utcHours / 24.0;
  return jd;
}

function calculateLahiriAyanamsha(tCenturies: number): number {
  // Lahiri Ayanamsha reference: 23° 51' 25.53" at J2000.0 (JD 2451545.0)
  // Precession rate approx 50.29 arcseconds per year = 1.3969° per century
  const ayanamsha = 23.85709 + 1.39697 * tCenturies + 0.000308 * tCenturies * tCenturies;
  return normalizeDegrees(ayanamsha);
}

function calculateMoonLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0

  // Mean orbital elements (Meeus Astronomical Algorithms)
  const l0 = normalizeDegrees(218.3164477 + 481267.88123421 * t - 0.0015786 * t * t); // Moon Mean Longitude
  const d = normalizeDegrees(297.8501921 + 445267.1114034 * t - 0.0018819 * t * t); // Mean Elongation
  const m = normalizeDegrees(357.5291092 + 35999.0502909 * t - 0.0001536 * t * t); // Sun's Mean Anomaly
  const mPrime = normalizeDegrees(134.9633964 + 477198.8675055 * t + 0.0087414 * t * t); // Moon's Mean Anomaly
  const f = normalizeDegrees(93.272095 + 483202.0175233 * t - 0.0036539 * t * t); // Argument of Latitude

  // Main periodic perturbation terms for Moon's geocentric tropical longitude
  let longitude = l0;
  longitude += 6.288774 * Math.sin(toRadians(mPrime)); // Equation of the center
  longitude += 1.274027 * Math.sin(toRadians(2 * d - mPrime)); // Evection
  longitude += 0.658314 * Math.sin(toRadians(2 * d)); // Variation
  longitude += 0.213618 * Math.sin(toRadians(2 * mPrime));
  longitude -= 0.185116 * Math.sin(toRadians(m)); // Annual equation
  longitude -= 0.114332 * Math.sin(toRadians(2 * f));
  longitude += 0.058793 * Math.sin(toRadians(2 * d - 2 * mPrime));
  longitude += 0.057066 * Math.sin(toRadians(2 * d - m - mPrime));
  longitude += 0.053320 * Math.sin(toRadians(2 * d + mPrime));
  longitude += 0.045758 * Math.sin(toRadians(2 * d - m));
  longitude -= 0.040923 * Math.sin(toRadians(m - mPrime));
  longitude -= 0.034720 * Math.sin(toRadians(d));
  longitude -= 0.030383 * Math.sin(toRadians(m + mPrime));

  return normalizeDegrees(longitude);
}

export function calculateNakshatraAndRashi(
  dateOfBirth: string | Date,
  timeOfBirth: string,
  lat: number,
  lon: number
): NakshatraResult {
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const [hours, minutes] = timeOfBirth.split(':').map(Number);

  // Timezone resolution
  let tzOffsetHours = 5.5; // Default to IST (UTC+5:30)
  try {
    const timezones = findTz(lat, lon);
    if (timezones && timezones[0]) {
      const sampleDate = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate(), hours, minutes);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezones[0],
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(sampleDate);
      const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value;
      if (tzPart && tzPart.includes('GMT')) {
        const match = tzPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
        if (match) {
          const sign = match[1] === '-' ? -1 : 1;
          const h = parseInt(match[2], 10);
          const m = match[3] ? parseInt(match[3], 10) : 0;
          tzOffsetHours = sign * (h + m / 60);
        }
      }
    }
  } catch (err) {
    console.warn('Timezone resolution fallback:', err);
  }

  // Calculate UTC decimal hour
  let utcDecimalHours = hours + minutes / 60.0 - tzOffsetHours;
  let year = birthDate.getFullYear();
  let month = birthDate.getMonth() + 1;
  let day = birthDate.getDate();

  if (utcDecimalHours < 0) {
    utcDecimalHours += 24.0;
    day -= 1;
    if (day < 1) {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      day = new Date(year, month, 0).getDate();
    }
  } else if (utcDecimalHours >= 24.0) {
    utcDecimalHours -= 24.0;
    day += 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      day = 1;
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  }

  const jd = getJulianDay(year, month, day, utcDecimalHours);
  const tCenturies = (jd - 2451545.0) / 36525.0;

  // Tropical Moon Longitude and Lahiri Ayanamsha
  const tropicalMoon = calculateMoonLongitude(jd);
  const ayanamsha = calculateLahiriAyanamsha(tCenturies);
  const siderealMoon = normalizeDegrees(tropicalMoon - ayanamsha);

  // Nakshatra calculations (27 nakshatras, each 13°20' = 13.3333333°)
  const nakshatraSpan = 360.0 / 27.0; // 13.333333333333334
  const nakshatraIndex = Math.floor(siderealMoon / nakshatraSpan) % 27;
  const nakshatraData = NAKSHATRAS[nakshatraIndex];

  // Pada calculation (4 padas per nakshatra, each 3°20' = 3.3333333°)
  const padaSpan = nakshatraSpan / 4.0;
  const posInNakshatra = siderealMoon - nakshatraIndex * nakshatraSpan;
  const pada = Math.min(4, Math.max(1, Math.floor(posInNakshatra / padaSpan) + 1));
  const syllable = nakshatraData.syllables[pada - 1] || nakshatraData.syllables[0];

  // Rashi calculation (12 rashis, each 30°)
  const rashiIndex = Math.floor(siderealMoon / 30.0) % 12;
  const rashi = RASHIS[rashiIndex];

  return {
    nakshatra: nakshatraData.name,
    pada,
    syllable,
    rashi,
  };
}

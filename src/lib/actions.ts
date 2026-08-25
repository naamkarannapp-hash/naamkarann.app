'use server';

import { z } from 'zod';
import { nameFormSchema, type NameResult, type LocationSearchResult, type NakshatraResult } from './types';
import { generateNames } from '@/ai/flows/generate-names';
import { generateCuratedFallbackNames } from './curated-names';
import { calculateNakshatraAndRashi } from './astrology';
import { find as findTz } from 'geo-tz';

export async function getAndPrioritizeNames(
  values: z.infer<typeof nameFormSchema>
): Promise<{ names: NameResult[] } | { error: string }> {
  try {
    const input = {
      gender: values.gender || 'Neutral',
      regionalRoots: values.regionalRoots || [],
      startingLetters: values.startingLetters || '',
      blendParents: values.blendParents || false,
      parent1Name: values.parent1Name || '',
      parent2Name: values.parent2Name || '',
      matchSibling: values.matchSibling || false,
      siblingName: values.siblingName || '',
      inspirations: values.inspirations || [],
    };

    try {
      // 1. Generate directly via Next.js Backend AI flow (Genkit / Gemini 2.0 Flash)
      const aiResults = await generateNames(input);

      if (Array.isArray(aiResults) && aiResults.length > 0) {
        const names: NameResult[] = aiResults.map((item, index) => ({
          id: `${item.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
          name: item.name,
          meaning: item.meaning,
          pronunciation: item.pronunciation,
          origin: item.origin,
          category: item.category,
          gender: item.gender,
          gradient: item.gradient || 'linear-gradient(135deg, #1A52E1 0%, #9C27B0 100%)',
        }));

        return { names };
      }
    } catch (aiError) {
      console.warn('AI flow encountered error or missing API key, using curated generator fallback:', aiError);
    }

    // 2. Intelligent curated fallback matching user criteria
    const fallbackNames = generateCuratedFallbackNames(values);
    return { names: fallbackNames };

  } catch (error) {
    console.error('Error in getAndPrioritizeNames:', error);
    const fallbackNames = generateCuratedFallbackNames(values);
    if (fallbackNames.length > 0) {
      return { names: fallbackNames };
    }
    if (error instanceof Error) {
      return { error: `An unexpected error occurred: ${error.message}` };
    }
    return { error: 'An unexpected error occurred while generating names.' };
  }
}

export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=en&limit=5`);
    if (!response.ok) {
      console.error('Photon API request failed:', response.statusText);
      return [];
    }

    const data = await response.json();
    if (data && data.features) {
      return data.features.map((feature: any, index: number) => ({
        id: `${feature.properties.osm_id}-${index}`,
        name: feature.properties.name || '',
        city: feature.properties.city || '',
        state: feature.properties.state || '',
        country: feature.properties.country || '',
        coordinates: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], // lat, lon
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching from Photon API:', error);
    return [];
  }
}

export async function convertToUTCTimestamp(
  { date, time, lat, lon }: { date: Date; time: string; lat: number; lon: number }
): Promise<string> {
  try {
    const timezones = findTz(lat, lon);
    const timezone = timezones[0]; // Get the primary timezone

    if (!timezone) {
      throw new Error("Could not determine timezone for the given location.");
    }

    const [hours, minutes] = time.split(':').map(Number);

    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    
    const zonedDate = new Date(
        date.getFullYear(), date.getMonth(), date.getDate(),
        hours, minutes
    );

    const formatterForOffset = new Intl.DateTimeFormat([], {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });

    const offsetString = formatterForOffset.format(zonedDate).split('GMT')[1];
    
    const finalDate = new Date(`${localDateString}${offsetString}`);

    return finalDate.toISOString();

  } catch (error) {
    console.error("Error converting to UTC:", error);
    const fallbackDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    fallbackDate.setUTCHours(hours, minutes, 0, 0);
    return fallbackDate.toISOString();
  }
}

const nakshatraApiSchema = z.object({
  dateOfBirth: z.string(),
  timeOfBirth: z.string(),
  placeOfBirth: z.string(),
  lat: z.number(),
  lon: z.number(),
});

export async function getNakshatraDetails(
  values: z.infer<typeof nakshatraApiSchema>
): Promise<{ result: NakshatraResult } | { error: string }> {
  try {
    // Exact offline astronomical calculation executed instantly on Next.js serverless backend
    const result = calculateNakshatraAndRashi(
      values.dateOfBirth,
      values.timeOfBirth,
      values.lat,
      values.lon
    );

    return { result };
  } catch (error) {
    console.error('Error calculating Nakshatra details:', error);
    return { error: 'An unexpected error occurred while calculating Nakshatra & Rashi.' };
  }
}

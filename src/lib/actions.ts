
'use server';

import {z} from 'zod';
import {nameFormSchema, type NameResult, type LocationSearchResult, type NakshatraResult} from './types';
import {prioritizeNames} from '@/ai/flows/prioritize-names';
import { find as findTz } from 'geo-tz';
import { format } from 'date-fns';

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const NAKSHATRA_WEBHOOK_URL = "https://n8n.srv973313.hstgr.cloud/webhook/getNakshatra";


interface ApiNameResult {
  name: string;
  meaning: string;
  pronounce: string;
  origin: string;
  category_tag: string;
  gender: 'boy' | 'girl' | 'neutral';
  gradient_color: string;
}

export async function getAndPrioritizeNames(
  values: z.infer<typeof nameFormSchema>
): Promise<{names: NameResult[]} | {error: string}> {
  if (!WEBHOOK_URL) {
    console.error('WEBHOOK_URL is not set in environment variables');
    return { error: 'Application is not configured correctly. Missing WEBHOOK_URL.' };
  }
  try {
    // Construct the payload based on the user's request to include all fields
    const payload = {
      gender: values.gender || "Neutral",
      regionalRoots: values.regionalRoots || [],
      startingLetters: values.startingLetters || "",
      blendParents: values.blendParents || false,
      parent1Name: values.parent1Name || "",
      parent2Name: values.parent2Name || "",
      matchSibling: values.matchSibling || false,
      siblingName: values.siblingName || "",
      inspirations: values.inspirations || [],
      astrologyMode: values.astrologyMode || false,
      dateOfBirth: values.dateOfBirth || null,
      timeOfBirth: values.timeOfBirth || "",
      placeOfBirth: values.placeOfBirth || "",
      lat: values.lat,
      lon: values.lon,
      utcTimestamp: values.utcTimestamp || null
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Webhook response not OK', {status: response.status, statusText: response.statusText});
      const errorText = await response.text();
      return {error: `Failed to fetch names from webhook. Server responded with: ${errorText}`};
    }
    
    let apiResponse;
    try {
        apiResponse = await response.json();
    } catch (e) {
        console.error('Failed to parse JSON from webhook', e);
        return { error: 'Received an invalid response from the name service.' };
    }


    if (!apiResponse.output || !apiResponse.output.success || !Array.isArray(apiResponse.output.names)) {
      console.error('Webhook response is not in the expected format:', apiResponse);
      return {error: 'Received unexpected data format from the name service.'};
    }

    let names: NameResult[] = apiResponse.output.names.map((name: ApiNameResult, index: number) => ({
      id: `${name.name}-${index}`,
      name: name.name,
      meaning: name.meaning,
      pronunciation: name.pronounce,
      origin: name.origin,
      category: name.category_tag,
      gender: name.gender,
      gradient: name.gradient_color,
    }));
    
    if (values.inspirations && values.inspirations.length > 0 && names.length > 0) {
      try {
        const nameStrings = names.map(n => n.name);
        const prioritizedNameStrings = await prioritizeNames({
          names: nameStrings,
          inspiration: values.inspirations.join(', '),
        });

        const nameMap = new Map(names.map(n => [n.name, n]));
        const prioritizedNames = prioritizedNameStrings
          .map(name => nameMap.get(name))
          .filter((name): name is NameResult => name !== undefined);

        const unprioritizedNames = names.filter(name => !prioritizedNameStrings.includes(name.name));
        
        const finalNameList = [...prioritizedNames, ...unprioritizedNames];
        // Deduplicate in case the same name was in both lists
        const uniqueNames = Array.from(new Map(finalNameList.map(item => [item.id, item])).values());
        
        return {names: uniqueNames};

      } catch (aiError) {
        console.error('AI prioritization failed, returning original list:', aiError);
        // If AI fails, return the original list from the webhook
        return {names};
      }
    }

    return {names};
  } catch (error) {
    console.error('Error in getAndPrioritizeNames:', error);
    if (error instanceof Error) {
      return {error: `An unexpected error occurred: ${error.message}`};
    }
    return {error: 'An unexpected error occurred.'};
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
        coordinates: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] // lat, lon
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

    // Create a date string in ISO format but without the Z (to treat it as local time in the target timezone)
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
    // Fallback to a simple UTC conversion if timezone lookup fails, though it might be inaccurate
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
    const response = await fetch(NAKSHATRA_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      console.error('Nakshatra webhook response not OK', {status: response.status, statusText: response.statusText});
      return { error: 'Failed to fetch Nakshatra details.' };
    }

    const data = await response.json();
    if (data.output && data.output.nakshatra) {
      return { result: data.output };
    } else {
      return { error: 'Invalid response from Nakshatra service.' };
    }
  } catch (error) {
    console.error('Error in getNakshatraDetails:', error);
    return { error: 'An unexpected error occurred while fetching details.' };
  }
}

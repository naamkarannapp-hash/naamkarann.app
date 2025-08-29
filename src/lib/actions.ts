
'use server';

import {z} from 'zod';
import {nameFormSchema, type NameResult, type LocationSearchResult} from './types';
import {prioritizeNames} from '@/ai/flows/prioritize-names';
import { find as findTz } from 'geo-tz';
import { format } from 'date-fns';

const WEBHOOK_URL = process.env.WEBHOOK_URL;

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
    // Construct the new payload based on the user's template
    const payload: any = {
      gender: values.gender ? values.gender.toLowerCase() : 'neutral'
    };
    
    if (values.astrologyMode) {
      payload.astrologyMode = true;
    }

    if (values.astrologyMode && values.dateOfBirth && values.utcTimestamp && values.placeOfBirth && values.lat !== undefined && values.lon !== undefined) {
      const utcDate = new Date(values.utcTimestamp);
      payload.vedic_horoscope = {
        birthDate: format(values.dateOfBirth, 'dd-MM-yyyy'),
        birthTime: `${String(utcDate.getUTCHours()).padStart(2, '0')}:${String(utcDate.getUTCMinutes()).padStart(2, '0')} in UTC`,
        birthPlace: values.placeOfBirth,
        birthLatitude: values.lat.toString(),
        birthLongitude: values.lon.toString()
      };
    }
    
    if (values.startingLetters) {
      payload.startingLetters = values.startingLetters;
    }

    if (values.blendParents && values.parent1Name) {
      payload.blendWithParents = {
        parent1Name: values.parent1Name,
        ...(values.parent2Name && { parent2Name: values.parent2Name })
      };
    }

    if (values.matchSibling && values.siblingName) {
      payload.siblingName = values.siblingName;
    }

    if (values.regionalRoots && values.regionalRoots.length > 0) {
      payload.regionalRoots = values.regionalRoots.join(',');
    }
    
    if (values.inspirations && values.inspirations.length > 0) {
      payload.inspirations = values.inspirations.join(',');
    }

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

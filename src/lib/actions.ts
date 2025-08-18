
'use server';

import {z} from 'zod';
import {nameFormSchema, type NameResult} from './types';
import {prioritizeNames} from '@/ai/flows/prioritize-names';
import { trackUserSearch } from './user-actions';
import { auth } from 'firebase-admin';
import { getApp } from 'firebase-admin/app';

const WEBHOOK_URL = 'https://n8n-vabues.onrender.com/webhook/getnames';

interface ApiNameResult {
  name: string;
  meaning: string;
  origin: string;
  category_tag: string;
  gender: 'boy' | 'girl' | 'neutral';
  gradient_color: string;
}

async function getCurrentUser() {
    try {
        const adminAuth = auth(getApp());
        const sessionCookie = require('next/headers').cookies().get('session')?.value;
        if (sessionCookie) {
            const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
            return await adminAuth.getUser(decodedToken.uid);
        }
        return null;
    } catch (error) {
        return null;
    }
}


export async function getAndPrioritizeNames(
  values: z.infer<typeof nameFormSchema>
): Promise<{names: NameResult[]} | {error: string}> {
  try {
    // Transform the array values into comma-separated strings for the API
    const apiValues = {
      ...values,
      regionalRoots: values.regionalRoots?.join(','),
      inspirations: values.inspirations?.join(','),
    };


    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiValues),
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
      origin: name.origin,
      category: name.category_tag,
      gender: name.gender,
      gradient: name.gradient_color,
    }));
    
    // This is a server action, so we can't rely on client-side auth state.
    // The tracking logic needs to be revisited to correctly identify the user on the server.
    // For now, this call will likely not work as intended because auth.currentUser is a client-side concept.
    // I am commenting this out to prevent crashes, but this functionality needs a proper server-side auth solution.
    // await trackUserSearch(values, names);


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

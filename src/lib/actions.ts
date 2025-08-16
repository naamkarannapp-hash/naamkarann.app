"use server";

import { z } from "zod";
import { nameFormSchema, type NameResult } from "./types";
import { prioritizeNames } from "@/ai/flows/prioritize-names";

const WEBHOOK_URL = "https://n8n-vabues.onrender.com/webhook/getnames";

export async function getAndPrioritizeNames(values: z.infer<typeof nameFormSchema>): Promise<{ names: NameResult[] } | { error: string }> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      console.error("Webhook response not OK", { status: response.status, statusText: response.statusText });
      const errorText = await response.text();
      return { error: `Failed to fetch names from webhook. Server responded with: ${errorText}` };
    }

    let names: NameResult[] = await response.json();
    
    if (!Array.isArray(names)) {
        console.error("Webhook response is not an array:", names);
        return { error: "Received unexpected data format from the name service." };
    }
    
    // Add a unique ID to each name for React keys and saving
    names = names.map((name, index) => ({ ...name, id: `${name.name}-${index}` }));

    if (values.inspirations && names.length > 0) {
      try {
        const nameStrings = names.map(n => n.name);
        const prioritizedNameStrings = await prioritizeNames({
          names: nameStrings,
          inspiration: values.inspirations,
        });

        const nameMap = new Map(names.map(n => [n.name, n]));
        const prioritizedNames = prioritizedNameStrings
          .map(name => nameMap.get(name))
          .filter((name): name is NameResult => name !== undefined);

        const unprioritizedNames = names.filter(name => !prioritizedNameStrings.includes(name.name));
        
        return { names: [...prioritizedNames, ...unprioritizedNames] };
      } catch (aiError) {
        console.error("AI prioritization failed, returning original list:", aiError);
        // If AI fails, return the original list from the webhook
        return { names };
      }
    }

    return { names };
  } catch (error) {
    console.error("Error in getAndPrioritizeNames:", error);
    if (error instanceof Error) {
        return { error: `An unexpected error occurred: ${error.message}` };
    }
    return { error: "An unexpected error occurred." };
  }
}

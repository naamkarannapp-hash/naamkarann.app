
'use server';

import { auth as adminAuth, initializeApp, getApps, App } from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { NameFormValues, NameResult } from "./types";

function getAdminApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }
    return initializeApp();
}

async function getDb() {
    return getFirestore(getAdminApp());
}

async function getCurrentUser(uid: string) {
    try {
        return await adminAuth(getAdminApp()).getUser(uid);
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}


export async function trackUserSearch(formValues: NameFormValues, results: NameResult[], uid: string): Promise<void> {
    if (!uid) {
        console.warn("No authenticated user UID provided. Cannot track search.");
        return;
    }
    
    const db = await getDb();
    const userRef = db.collection("users").doc(uid);

    try {
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            const userRecord = await getCurrentUser(uid);
            if (userRecord) {
                 await userRef.set({
                    uid: userRecord.uid,
                    email: userRecord.email,
                    displayName: userRecord.displayName,
                    photoURL: userRecord.photoURL,
                    createdAt: FieldValue.serverTimestamp(),
                    searchCount: 1,
                });
            }
        } else {
            await userRef.update({
                searchCount: FieldValue.increment(1)
            });
        }

        // Add search details to subcollection
        const searchesRef = userRef.collection("searches");
        await searchesRef.add({
            timestamp: FieldValue.serverTimestamp(),
            formValues: JSON.parse(JSON.stringify(formValues)), // Ensure plain object
            results: JSON.parse(JSON.stringify(results)), // Ensure plain object
        });

    } catch (error) {
        console.error("Error tracking user search:", error);
    }
}

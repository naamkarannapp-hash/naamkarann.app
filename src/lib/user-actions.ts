
'use server';

import { auth, db } from "@/lib/firebase";
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc, increment, addDoc } from "firebase/firestore";
import type { NameFormValues, NameResult, UserProfile } from "./types";

export async function createUserProfile(user: UserProfile): Promise<void> {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            ...user,
            createdAt: serverTimestamp(),
            searchCount: 0,
        });
    }
}

export async function trackUserSearch(formValues: NameFormValues, results: NameResult[]): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.warn("No authenticated user found. Cannot track search.");
        return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const searchesRef = collection(userRef, "searches");

    try {
        // Increment search count
        await updateDoc(userRef, {
            searchCount: increment(1)
        });

        // Add search details to subcollection
        await addDoc(searchesRef, {
            timestamp: serverTimestamp(),
            formValues: JSON.parse(JSON.stringify(formValues)), // Ensure plain object
            results: JSON.parse(JSON.stringify(results)), // Ensure plain object
        });

    } catch (error) {
        console.error("Error tracking user search:", error);
        // If updating fails (e.g. user doc doesn't exist), create it.
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            await setDoc(userRef, {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                createdAt: serverTimestamp(),
                searchCount: 1,
            });
             await addDoc(searchesRef, {
                timestamp: serverTimestamp(),
                formValues: JSON.parse(JSON.stringify(formValues)),
                results: JSON.parse(JSON.stringify(results)),
            });
        }
    }
}

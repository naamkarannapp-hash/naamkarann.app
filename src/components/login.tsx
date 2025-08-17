
"use client";

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface LoginProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function Login({ isOpen, onOpenChange }: LoginProps) {
  const handleSignIn = async () => {
    try {
      // The onAuthStateChanged listener in AuthProvider will handle UI updates.
      await signInWithPopup(auth, googleProvider);
      // The dialog can be closed after initiating, as the auth state will take over.
      onOpenChange(false); 
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Ensure dialog closes even if there is an error, so user can retry.
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Naamkarann</DialogTitle>
          <DialogDescription>
            Please sign in to continue and find the perfect name.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Button onClick={handleSignIn} className="w-full">
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


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
      await signInWithPopup(auth, googleProvider);
      onOpenChange(false); // Close dialog on successful sign-in
    } catch (error) {
      console.error("Error signing in with Google: ", error);
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

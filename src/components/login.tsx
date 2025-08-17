
"use client";

import { signInWithPopup, AuthError } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';

interface LoginProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function Login({ isOpen, onOpenChange }: LoginProps) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If the user is logged in and the dialog is open, close it and navigate.
    if (user && isOpen) {
      onOpenChange(false);
      router.push('/form/personalize');
    }
  }, [user, isOpen, onOpenChange, router]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // The useEffect above will handle navigation once the user state is updated.
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

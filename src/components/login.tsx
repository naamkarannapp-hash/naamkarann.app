
"use client";

import { signInWithPopup, AuthError } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useRouter } from 'next/navigation';

interface LoginProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function Login({ isOpen, onOpenChange }: LoginProps) {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener in AuthProvider will handle global state.
      // We can navigate immediately after successful sign in.
      onOpenChange(false);
      router.push('/form/personalize');
    } catch (error) {
      // Don't log an error if the user intentionally closes the popup.
      if ((error as AuthError).code === 'auth/popup-closed-by-user') {
        return;
      }
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

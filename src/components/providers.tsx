
"use client";

import { AppStateProvider } from '@/context/app-state-context';
import { AuthProvider } from '@/context/auth-context';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AppStateProvider>
                {children}
            </AppStateProvider>
        </AuthProvider>
    );
}


"use client";

import { AppStateProvider } from '@/context/app-state-context';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppStateProvider>
            {children}
        </AppStateProvider>
    );
}

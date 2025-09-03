
import { FormHeader } from '@/components/form-header';
import { FormFooter } from '@/components/form-footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personalize Your Baby Name Search | Naamkarann',
  description: 'Start your search by personalizing name suggestions based on gender, starting letters, and family names. Find the perfect name with our AI-powered generator.',
};


export default function FormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pattern-background">
      <div className="container mx-auto p-4 md:p-8 flex-grow">
        <FormHeader />
        <main className="flex-grow flex items-start justify-center pt-8">
          {children}
        </main>
      </div>
      <FormFooter />
    </div>
  );
}

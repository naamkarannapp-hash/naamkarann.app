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
    <div className="flex flex-col min-h-screen bg-background text-foreground pattern-background relative overflow-hidden">
      {/* Ambient glowing radial backgrounds */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-200/35 via-purple-200/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-br from-purple-200/20 via-blue-100/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 py-6 md:py-8 flex-grow pb-28">
        <FormHeader />
        <main className="flex-grow flex items-start justify-center pt-2">
          {children}
        </main>
      </div>
      <FormFooter />
    </div>
  );
}

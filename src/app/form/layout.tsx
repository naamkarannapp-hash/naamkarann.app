import { FormHeader } from '@/components/form-header';
import { FormFooter } from '@/components/form-footer';

export default function FormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col min-h-screen bg-background">
      <FormHeader />
      <main className="flex-grow flex items-start justify-center pt-8 pb-32">
        {children}
      </main>
      <FormFooter />
    </div>
  );
}

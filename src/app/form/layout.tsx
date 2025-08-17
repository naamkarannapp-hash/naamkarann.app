import { FormHeader } from '@/components/form-header';
import { FormFooter } from '@/components/form-footer';

export default function FormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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

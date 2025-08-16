import { FormHeader } from '@/components/form-header';

export default function FormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col min-h-screen bg-background">
      <FormHeader />
      <main className="flex-grow flex items-start justify-center pt-8">
        {children}
      </main>
      <div id="footer-placeholder" className="h-24"></div>
    </div>
  );
}
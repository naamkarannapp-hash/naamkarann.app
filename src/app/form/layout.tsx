import { FormHeader } from '@/components/form-header';

export default function FormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      <FormHeader />
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}

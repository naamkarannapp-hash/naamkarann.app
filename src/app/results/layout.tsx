
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Your AI-Generated Baby Names | Naamkarann',
    description: 'Browse your personalized list of beautiful, meaningful baby names. Swipe through suggestions and discover the perfect name for your child.',
};

export default function ResultsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

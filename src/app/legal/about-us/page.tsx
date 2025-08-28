
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Naamkarann',
    description: 'Learn about the mission and story behind Naamkarann, your AI-powered companion for finding the perfect, meaningful baby name.',
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 pattern-background">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">About Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>
                Welcome to Naamkarann, your companion in the beautiful journey of naming your child. We believe that a name is more than just a word; it’s a story, a heritage, and a blessing. Our mission is to blend tradition with technology to help you discover a name that is both meaningful and unique.
            </p>
            <p>
                Created with love and a deep appreciation for cultural roots, our app offers thousands of names, each with its own story and significance. We use a touch of AI to personalize suggestions, making your search for the perfect name an inspiring and joyful experience.
            </p>
             <p>
                Thank you for letting us be a part of this special milestone.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

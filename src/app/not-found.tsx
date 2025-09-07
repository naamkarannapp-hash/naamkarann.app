
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { SearchX } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 - Page Not Found | Naamkarann',
    description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pattern-background">
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg border-none bg-transparent">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                <SearchX className="w-12 h-12" />
            </div>
            <CardTitle className="text-4xl font-bold mt-4">Page Not Found</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              Sorry, the page you are looking for could not be found or no longer exists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/">Go back to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

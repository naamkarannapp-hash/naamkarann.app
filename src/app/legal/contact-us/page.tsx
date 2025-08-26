
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactUsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 pattern-background">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We'd love to hear from you! Whether you have a question, a suggestion, or just want to share your experience with our app, please feel free to reach out.
          </p>
          <p>
            You can contact us by email at: <a href="mailto:naamkarann.app@gmail.com" className="text-primary hover:underline">naamkarann.app@gmail.com</a>.
          </p>
           <p>
                We do our best to respond to all inquiries as quickly as possible. Thank you for your interest in Naamkarann!
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

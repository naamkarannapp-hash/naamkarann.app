
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Naamkarann',
    description: 'Read the Privacy Policy for Naamkarann to understand how we handle your data when you use our AI baby name generator.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 pattern-background">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to Naamkarann. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our
            application. We respect your privacy and are committed to protecting
            it through our compliance with this policy.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Information We Collect</h2>
          <p>
            We do not collect any personal data, such as your name or email address, because this application does not include user registration or accounts. The information you provide to generate names is processed in real-time and is not stored or linked to you.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Third-Party Advertising</h2>
          <p>
            We use Google AdSense to serve advertisements on our website. Our third-party advertising partners may use cookies or similar technologies to serve you advertisements that are more relevant to your interests.
          </p>
           <ul className="list-disc pl-6 space-y-2">
                <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>.</li>
            </ul>
          <h2 className="text-2xl font-semibold pt-4">Use of Your Information</h2>
          <p>
            The information you provide (such as gender, starting letters, or inspirations) is used solely for the purpose of generating name suggestions for you within your current session. We do not use this information for any other purpose, nor do we save it.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please
            contact us at <a href="mailto:naamkarann.app@gmail.com" className="text-primary hover:underline">naamkarann.app@gmail.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

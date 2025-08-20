
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
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
            We may collect information about you in a variety of ways. The
            information we may collect via the Application includes personal
            data, such as your name and email address, that you voluntarily
            give to us when you register with the Application.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with
            a smooth, efficient, and customized experience. Specifically, we may
            use information collected about you via the Application to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Create and manage your account.</li>
            <li>
              Email you regarding your account or order.
            </li>
            <li>
              Generate a personal profile about you to make future visits to the
              Application more personalized.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold pt-4">Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please
            contact us.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

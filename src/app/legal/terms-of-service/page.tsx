
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Please read these Terms of Service carefully before using the
            Naamkarann application operated by us.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Conditions of Use</h2>
          <p>
            We will provide their services to you, which are subject to the
            conditions stated below in this document. Every time you visit this
            website, use its services or make a purchase, you accept the
            following conditions. This is why we urge you to read them
            carefully.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Privacy Policy</h2>
          <p>
            Before you continue using our website we advise you to read our
            privacy policy regarding our user data collection. It will help you
            better understand our practices.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Applicable Law</h2>
          <p>
            By visiting this website, you agree that the laws of the, without
            regard to principles of conflict laws, will govern these terms of
            service, or any dispute of any sort that might come between us and
            you, or its business partners and associates.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Contact Us</h2>
          <p>
            If you have any questions or concerns about these Terms, please
            contact us.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

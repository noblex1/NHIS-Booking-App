import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Shield } from "lucide-react";
import { requireUserSession } from "@/lib/route-guards";

export const Route = createFileRoute("/profile/terms")({
  beforeLoad: requireUserSession,
  head: () => ({
    meta: [
      { title: "Terms & Privacy - NHIS Booking" },
      { name: "description", content: "Read our terms of service and privacy policy." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8 md:py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/profile" })}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Terms & Privacy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Our commitment to your privacy and service terms
        </p>
      </div>

      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terms">
            <FileText className="mr-2 h-4 w-4" />
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="mr-2 h-4 w-4" />
            Privacy Policy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <Card className="p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h2>Terms of Service</h2>
              <p className="text-muted-foreground">
                Last updated: May 30, 2026
              </p>

              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing and using the NHIS Booking System, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this service.
              </p>

              <h3>2. Use of Service</h3>
              <p>
                The NHIS Booking System is provided to facilitate appointment scheduling at NHIA service centres. You agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information when creating an account</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Attend scheduled appointments or cancel them in advance</li>
                <li>Bring required documents to your appointments</li>
              </ul>

              <h3>3. Account Registration</h3>
              <p>
                To use this service, you must:
              </p>
              <ul>
                <li>Be at least 18 years old or have parental consent</li>
                <li>Provide a valid email address</li>
                <li>Create a secure password</li>
                <li>Verify your email address through OTP</li>
              </ul>

              <h3>4. Appointment Booking</h3>
              <p>
                When booking an appointment:
              </p>
              <ul>
                <li>Appointments are subject to availability</li>
                <li>You may book for yourself or on behalf of others</li>
                <li>Cancellations should be made at least 24 hours in advance</li>
                <li>Missed appointments may affect future booking privileges</li>
              </ul>

              <h3>5. User Responsibilities</h3>
              <p>
                You are responsible for:
              </p>
              <ul>
                <li>Arriving on time for your appointments</li>
                <li>Bringing all required documents</li>
                <li>Providing accurate information</li>
                <li>Respecting service centre staff and other users</li>
              </ul>

              <h3>6. Service Availability</h3>
              <p>
                We strive to maintain service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues.
              </p>

              <h3>7. Modifications to Service</h3>
              <p>
                We reserve the right to modify or discontinue the service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>

              <h3>8. Limitation of Liability</h3>
              <p>
                The NHIS Booking System is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use the service.
              </p>

              <h3>9. Contact Information</h3>
              <p>
                For questions about these terms, please contact us at:
                <br />
                Email: support@nhis.gov.gh
                <br />
                Phone: 0800 123 456
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h2>Privacy Policy</h2>
              <p className="text-muted-foreground">
                Last updated: May 30, 2026
              </p>

              <h3>1. Information We Collect</h3>
              <p>
                We collect information that you provide directly to us, including:
              </p>
              <ul>
                <li><strong>Personal Information:</strong> Full name, email address, date of birth</li>
                <li><strong>Account Information:</strong> Username, password (encrypted)</li>
                <li><strong>Appointment Data:</strong> Service type, preferred dates and times, documents acknowledged</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
              </ul>

              <h3>2. How We Use Your Information</h3>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Create and manage your account</li>
                <li>Process and confirm your appointments</li>
                <li>Send appointment reminders and updates</li>
                <li>Improve our services and user experience</li>
                <li>Communicate with you about your account</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h3>3. Information Sharing</h3>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul>
                <li><strong>With NHIA Service Centres:</strong> To facilitate your appointments</li>
                <li><strong>With Service Providers:</strong> Who assist in operating our platform (email services, hosting)</li>
                <li><strong>For Legal Compliance:</strong> When required by law or to protect our rights</li>
              </ul>

              <h3>4. Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul>
                <li>Passwords are encrypted using industry-standard algorithms</li>
                <li>Data transmission is secured using SSL/TLS encryption</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
                <li>Regular security audits and updates</li>
              </ul>

              <h3>5. Your Rights</h3>
              <p>
                You have the right to:
              </p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>

              <h3>6. Cookies and Tracking</h3>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul>
                <li>Keep you signed in</li>
                <li>Remember your preferences</li>
                <li>Analyze how you use our service</li>
                <li>Improve user experience</li>
              </ul>
              <p>
                You can control cookies through your browser settings.
              </p>

              <h3>7. Data Retention</h3>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymize your data within 90 days, except where required by law.
              </p>

              <h3>8. Children's Privacy</h3>
              <p>
                Our service is not intended for children under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>

              <h3>9. Changes to Privacy Policy</h3>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h3>10. Contact Us</h3>
              <p>
                If you have questions about this privacy policy or our data practices, please contact us at:
                <br />
                Email: privacy@nhis.gov.gh
                <br />
                Phone: 0800 123 456
                <br />
                Address: National Health Insurance Authority, Accra, Ghana
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

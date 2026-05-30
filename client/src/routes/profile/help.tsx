import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Search, Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/profile/help")({
  head: () => ({
    meta: [
      { title: "Help Center - NHIS Booking" },
      { name: "description", content: "Get help and find answers to common questions." },
    ],
  }),
  component: HelpPage,
});

const FAQ_ITEMS = [
  {
    question: "How do I book an appointment?",
    answer:
      "To book an appointment, sign in to your account, click 'Book centre visit', select your service type (New registration or Card Update), choose your preferred date and time, and confirm your booking. You'll receive a confirmation email with your appointment details.",
  },
  {
    question: "Can I reschedule my appointment?",
    answer:
      "Yes, you can cancel your current appointment from the 'My bookings' page and book a new one. We recommend doing this at least 24 hours before your scheduled appointment.",
  },
  {
    question: "What documents do I need to bring?",
    answer:
      "For new registration, bring your valid Ghana Card and proof of residence. For card updates, bring your Ghana Card and existing NHIS card. All documents should be originals where possible.",
  },
  {
    question: "How early should I arrive?",
    answer:
      "Please arrive 10 minutes before your scheduled time slot. This gives you time to check in and ensures your appointment starts on time.",
  },
  {
    question: "What if I miss my appointment?",
    answer:
      "If you miss your appointment, you'll need to book a new one through the system. We recommend setting reminders to avoid missing your scheduled time.",
  },
  {
    question: "Can I book for someone else?",
    answer:
      "Yes, when booking, select 'On behalf of someone' and enter the beneficiary's full name. You'll need to bring their documents to the appointment.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Go to Profile > Change Password. You'll receive a verification code via email to confirm your identity before setting a new password.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes, we use industry-standard encryption to protect your data. Your information is only used for NHIS services and is never shared with third parties.",
  },
];

function HelpPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-24 md:pb-8 md:py-8">
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
        <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Contact Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <ContactCard
          icon={Mail}
          title="Email"
          description="support@nhis.gov.gh"
          action="Send Email"
        />
        <ContactCard
          icon={Phone}
          title="Phone"
          description="0800 123 456"
          action="Call Now"
        />
        <ContactCard
          icon={MessageCircle}
          title="Live Chat"
          description="Mon-Fri, 8AM-5PM"
          action="Start Chat"
        />
      </div>

      {/* FAQ */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? "question" : "questions"}
            </p>
          </div>
        </div>

        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No results found for "{searchQuery}"
            </p>
          </div>
        )}
      </Card>

      {/* Still Need Help */}
      <Card className="mt-6 bg-muted/30 p-6 text-center">
        <h3 className="font-semibold">Still need help?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our support team is here to assist you
        </p>
        <Button className="mt-4">
          <Mail className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </Card>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Card className="p-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <Button variant="ghost" size="sm" className="mt-3 w-full">
        {action}
      </Button>
    </Card>
  );
}

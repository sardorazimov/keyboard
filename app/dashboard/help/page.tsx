import { MessageCircle, Mail, HelpCircle } from "lucide-react";
import FeedbackForm from "../../../components/shared/feedback-form";


export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 mt-10">
      <section>
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="text-primary" /> Help & Support
        </h1>
        <p className="text-muted-foreground">Do you have questions about the game? You can get support here.</p>
      </section>

      {/* FAQ - Sıkça Sorulan Sorular */}
      <div className="grid gap-4">
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-semibold">Why isn&lsquo;t my score being saved?</h3>
          <p className="text-sm text-muted-foreground">Make sure you are logged in and have an active internet connection.</p>
        </div>
        {/* Other questions... */}
      </div>

      {/* Contact Form */}
      <section className="bg-secondary/30 p-8 rounded-2xl border border-border">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Send Feedback</h2>
          <p className="text-sm text-muted-foreground">Your feedback is valuable to us. We manually respond to every message.</p>
        </div>
        <FeedbackForm />
      </section>
    </div>
  );
}
import { MessageCircle, Mail, HelpCircle } from "lucide-react";
import FeedbackForm from "../../../components/shared/feedback-form";


export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 mt-10">
      <section>
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="text-primary" /> Yardım Merkezi
        </h1>
        <p className="text-muted-foreground">Oyun hakkında sorularınız mı var? Buradan destek alabilirsiniz.</p>
      </section>

      {/* FAQ - Sıkça Sorulan Sorular */}
      <div className="grid gap-4">
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-semibold">Skorum neden kaydedilmiyor?</h3>
          <p className="text-sm text-muted-foreground">Giriş yaptığınızdan ve internet bağlantınızın olduğundan emin olun.</p>
        </div>
        {/* Diğer sorular... */}
      </div>

      {/* İletişim Formu */}
      <section className="bg-secondary/30 p-8 rounded-2xl border border-border">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Geri Bildirim Gönder</h2>
          <p className="text-sm text-muted-foreground">Görüşleriniz bizim için değerli. Her mesaja manuel olarak dönüyoruz.</p>
        </div>
        <FeedbackForm />
      </section>
    </div>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  
  // Rastgele bir bilet numarası üretelim (Görsellik için)
  const ticketNo = "0023"; 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const response = await fetch("https://formspree.io/f/mlgwgjgp", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      setShowModal(true); // Modal'ı aç
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="name" placeholder="Adınız" required />
          <Input name="email" type="email" placeholder="Email Adresiniz" required />
        </div>
        <Textarea name="message" placeholder="Mesajınız..." required className="min-h-[120px]" />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Gönderiliyor..." : "Geri Bildirim Gönder"}
        </Button>
      </form>

      {/* Başarı Modalı */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-300" />
            <DialogTitle className="text-2xl font-bold">Mesaj İletildi!</DialogTitle>
            <DialogDescription className="text-base text-center">
              Geri bildiriminiz başarıyla alındı. En kısa sürede dönüş yapacağız.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center justify-center border border-border">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Bilet Numarası</span>
            <span className="text-2xl font-mono font-black text-primary">#{ticketNo}</span>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button 
              type="button" 
              variant="default" 
              className="w-full font-bold"
              onClick={() => router.push("/dashboard")}
            >
              Go Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
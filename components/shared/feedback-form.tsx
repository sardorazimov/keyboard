"use client";
import { useState } from "react";

import { toast } from "sonner"; // veya kullandığın bildirim kütüphanesi
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Mesajınız başarıyla iletildi!");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error("Bir hata oluştu.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input name="name" placeholder="Adınız" required />
        <Input name="email" type="email" placeholder="Email Adresiniz" required />
      </div>
      <Textarea name="message" placeholder="Mesajınız..." className="min-h-[120px]" required />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
      </Button>
    </form>
  );
}
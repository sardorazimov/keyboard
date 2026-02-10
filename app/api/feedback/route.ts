// app/api/feedback/route.ts
import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Lütfen tüm alanları doldurun." }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Feedback <onboarding@resend.dev>', // Başlangıçta bu adresi kullanmana izin verir
      to: 'sardorazimov2901@gmail.com', // Mesajın nereye gelmesini istiyorsan o adres
      subject: `🎮 KeyType Feedback: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">Yeni Geri Bildirim!</h2>
          <p><strong>Gönderen:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email}</p>
          <hr />
          <p><strong>Mesaj:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend Hatası:", error);
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
}
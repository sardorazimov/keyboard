"use client";

import { ShieldCheck, Lock, EyeOff, Database, XCircle, CheckCircle2, } from "lucide-react";
import { LightRays } from "../../components/ui/light-rays";
import { Footer } from "../../components/shared/footer";


export default function PrivacyPage() {
  return (
    <div className="max-w-full mx-auto py-20 px-6 relative overflow-hidden">
      {/* Arka Plan Efekti */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="text-center mb-20 space-y-6">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-foreground">
          Privacy <span className="text-primary">Policy</span>
        </h1>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs max-w-lg mx-auto leading-relaxed">
          Transparent, Minimal, and Secure. <br /> We care about your speed, not your identity.
        </p>
      </div>
      <h1 className="text-2xl font-bold text-foreground/80 mb-12 text-center max-w-2xl mx-auto leading-relaxed">

        The project is completely open source; you can access all the code on GitHub and do something similar on your own computer. Don&apos;t forget to give it a star rating for the Pull Request.

      </h1>

      <div className="grid md:grid-cols-12 gap-8 items-start">

        {/* SOL TARAF: ANA KARTLAR */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-8 rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-md shadow-2xl relative group overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Data Sovereignty</h2>
            </div>
            <p className="text-muted-foreground font-medium leading-relaxed">
              At KeyType, we follow the principle of <span className="text-foreground font-bold">Data Minimization</span>.
              We only store what&lsquo;s necessary for the leaderboard. Your typing flow is processed
              entirely in your browser memory and is never recorded or streamed to any server.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-[2rem] border border-border bg-card/40 backdrop-blur-sm">
              <EyeOff className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-black uppercase text-sm mb-2">No Tracking</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed"> No Facebook Pixels, No hidden cookies.</p>
            </div>
            <div className="p-6 rounded-[2rem] border border-border bg-card/40 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-black uppercase text-sm mb-2">Secure Storage</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">SSL encrypted database connections and secure servers.</p>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF: "NE TOPLAMIYORUZ" LİSTESİ */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-8 rounded-[2.5rem] border-2 border-primary/20 bg-primary/5 backdrop-blur-sm relative">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
              <XCircle className="text-red-500 w-5 h-5" /> What we DON&lsquo;T collect
            </h3>
            <ul className="space-y-4">
              {[
                "Email Addresses",
                "Personal Names",
                "IP Addresses (Logged)",
                "Browser History",
                "Keystroke Logs (Outside games)",
                "Precise Geolocation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-black text-foreground/70 group">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500/50 group-hover:bg-red-500 transition-colors" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-border bg-card/40">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-green-500 w-5 h-5" /> Public Data
            </h3>
            <p className="text-xs text-muted-foreground font-bold leading-relaxed mb-4">
              When you submit a score, the following becomes public:
            </p>
            <div className="flex flex-wrap gap-2">
              {["Username", "Country", "Score", "WPM"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-black uppercase tracking-widest">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-30">
          Last Revision: February 11, 2026 • KeyType Dev Team
        </p>
      </div>

      <LightRays />
      <Footer />
    </div>
  );
}
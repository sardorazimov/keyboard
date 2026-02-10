"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CountrySelect from "../../../components/shared/country-select";
import { Card } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-patern";
import { ShineBorder } from "@/components/ui/shine-border";
import { Globe2, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CountryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔒 Username Guard: Kullanıcı adı yoksa geri gönder
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.replace("/onboarding/username");
    }
  }, [router]);

  async function handleSelect(code: string) {
    const username = localStorage.getItem("username");
    if (!username) return;

    setLoading(true);

    try {
      await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          country: code,
          language: typeof navigator !== "undefined" ? navigator.language : "en",
        }),
      });

      localStorage.setItem("country", code);
      router.replace("/onboarding/tutorial");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-background">
      {/* Dashboard ile uyumlu arka plan deseni */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="w-full max-w-[440px] z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 mb-4 text-primary">
            <Globe2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Region Selection</h1>
          <p className="text-muted-foreground font-medium">
            Select the country you want to represent.
          </p>
        </div>

        <Card className="relative p-8 rounded-[2.5rem] border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl">
          <ShineBorder shineColor={["#22c55e", "#10b981", "#3b82f6"]} />
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                <MapPin className="w-3 h-3" /> Location
              </label>
              
              <div className={cn("transition-all", loading && "opacity-50 pointer-events-none")}>
                <CountrySelect onSelect={handleSelect} />
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary font-bold animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Your Profile...</span>
              </div>
            )}
          </div>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground/60 font-medium">
          Country selection will affect your leaderboard ranking.
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-patern";
import { ShineBorder } from "@/components/ui/shine-border";
import { Loader2, UserCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");

    if (username.length < 3) {
      setError("En az 3 karakter olmalı");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (data.taken) {
        setError("Bu efsane isim çoktan kapılmış.");
        return;
      }

      localStorage.setItem("username", username);
      router.push("/onboarding/country");
    } catch {
      setError("Bir bağlantı sorunu oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-background">
      {/* Arka plan deseni */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="w-full max-w-[440px] z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 mb-4">
            <UserCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">
            Username Selection
          </h1>
          <p className="text-muted-foreground font-medium">
            This is the name that will represent you on the leaderboard.
          </p>
        </div>

        <Card className="relative p-8 rounded-[2.5rem] border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder=": ghost_typer"
                className="h-14 px-6 rounded-2xl bg-background/50 border-border/60 focus:ring-primary/20 text-lg font-mono"
              />
              {error && (
                <p className="text-red-500 text-xs font-bold animate-pulse ml-1 italic">
                  ⚠ {error}
                </p>
              )}
            </div>

            <Button
              onClick={submit}
              disabled={loading || !username}
              className="w-full h-14 rounded-2xl text-lg font-bold transition-all group active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground/60 font-medium">
          By registering, you agree to our community guidelines.
        </p>
      </div>
    </div>
  );
}
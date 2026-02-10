"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-patern";
import { ShineBorder } from "@/components/ui/shine-border";
import { ChevronRight, Rocket, Keyboard, Gamepad2, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Typing Test",
    desc: "Measure your speed and accuracy in real-time. Elevate your coding pace to professional levels!",
    icon: <Keyboard className="w-10 h-10 text-blue-500" />,
    color: "from-blue-500/20 to-transparent"
  },
  {
    title: "Game Mode",
    desc: "Test your reflexes! Catch falling characters before they hit the ground and stack up points.",
    icon: <Gamepad2 className="w-10 h-10 text-emerald-500" />,
    color: "from-emerald-500/20 to-transparent"
  },
  {
    title: "Leaderboard",
    desc: "Enter the global arena. Represent your country and rank among the fastest typers in the world!",
    icon: <Trophy className="w-10 h-10 text-amber-500" />,
    color: "from-amber-500/20 to-transparent"
  },
];

export default function TutorialPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const country = localStorage.getItem("country");

    if (!username || !country) {
      router.replace("/onboarding/username");
    }
  }, [router]);

  function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("onboarded", "true");
      router.push("/"); 
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="w-full max-w-[480px] z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
            <Sparkles className="w-3 h-3" /> Welcome to KeyType! <Sparkles className="w-3 h-3" />
          </div>
        </div>

        <Card className="relative p-10 rounded-[3rem] border-border/40 bg-card/40 backdrop-blur-2xl shadow-3xl overflow-hidden">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          
          {/* Adım İçeriği */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className={cn(
              "p-6 rounded-[2rem] bg-gradient-to-b transition-all duration-500 shadow-inner",
              steps[step].color
            )}>
              {steps[step].icon}
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic italic italic">
                {steps[step].title}
              </h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {steps[step].desc}
              </p>
            </div>

            {/* İlerleme Çubuğu */}
            <div className="flex gap-2 w-full justify-center py-4">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === step ? "w-8 bg-primary" : "w-2 bg-muted-foreground/20"
                  )} 
                />
              ))}
            </div>

            <Button
              onClick={next}
              className="w-full h-14 rounded-2xl text-lg font-bold group"
            >
              {step === steps.length - 1 ? (
                <span className="flex items-center gap-2">
                  LET&lsquo;S GET STARTED <Rocket className="w-5 h-5 animate-bounce" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  NEXT <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground/40 font-bold uppercase tracking-widest">
           Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
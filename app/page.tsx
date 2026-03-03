/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Keyboard,
  Gamepad2,
  Trophy,
  Zap,
  Target,
  Globe,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { DotPattern } from "../components/ui/dot-patern";
import { cn } from "../lib/utils";
import { ModeToggle } from "../components/provider/modde-toggle";

// Animated typing demo text
const DEMO_TEXT = "the quick brown fox jumps over the lazy dog";

function TypingDemo() {
  const [index, setIndex] = useState(0);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (resetting) {
      const t = setTimeout(() => { setIndex(0); setResetting(false); }, 600);
      return () => clearTimeout(t);
    }
    if (index >= DEMO_TEXT.length) {
      const t = setTimeout(() => setResetting(true), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), 80 + Math.random() * 60);
    return () => clearTimeout(t);
  }, [index, resetting]);

  return (
    <div className="font-mono text-base md:text-lg leading-relaxed tracking-tight select-none">
      {DEMO_TEXT.split("").map((char, i) => (
        <span
          key={i}
          className={cn(
            "transition-colors duration-75",
            i < index
              ? "text-foreground"
              : i === index
              ? "bg-primary/20 text-primary rounded-sm ring-1 ring-primary/30"
              : "text-muted-foreground/30"
          )}
        >
          {char}
        </span>
      ))}
      {index < DEMO_TEXT.length && (
        <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
}

const features = [
  {
    icon: Keyboard,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "Typing Test",
    desc: "60-second precision tests with real-time WPM and accuracy tracking across Easy, Medium, Hard, and Ultra modes.",
    href: "/dashboard",
    cta: "Start Typing",
  },
  {
    icon: Gamepad2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "Keyboard Game",
    desc: "Catch falling letters before they hit the ground. Survive as long as you can and post your high score.",
    href: "/dashboard/game",
    cta: "Play Game",
  },
  {
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Leaderboard",
    desc: "Compete globally or filter by country. See where you rank and climb to the top of the board.",
    href: "/dashboard/leaderboard",
    cta: "View Rankings",
  },
];

const stats = [
  { icon: Zap, label: "Avg WPM", value: "94", color: "text-emerald-500" },
  { icon: Target, label: "Accuracy", value: "98%", color: "text-blue-500" },
  { icon: Globe, label: "Countries", value: "60+", color: "text-purple-500" },
  { icon: Trophy, label: "Players", value: "10K+", color: "text-amber-500" },
];

function FadeInSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const country = localStorage.getItem("country");
    const onboarded = localStorage.getItem("onboarded");

    if (username && country && onboarded) {
      router.replace("/dashboard");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo1.png" alt="KeyType" className="w-14" />
        </Link>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Link
            href="/onboarding/username"
            className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-16 px-6 text-center overflow-hidden">
        <DotPattern className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] opacity-60" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 space-y-8 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-[11px] font-black uppercase tracking-widest text-muted-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Typing speed trainer · Global leaderboards
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Type Faster.
            <br />
            <span className="text-primary">Rank Higher.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            A minimalist typing test with real-time WPM tracking, a falling-letters arcade game, and global leaderboards. Built for developers who want to type at the speed of thought.
          </p>

          {/* Live typing demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative mx-auto max-w-2xl bg-card/60 backdrop-blur-xl border border-border rounded-[2rem] p-8 shadow-2xl text-left"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Live Demo
              </span>
            </div>
            <TypingDemo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/onboarding/username"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black text-lg px-10 py-5 rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg"
            >
              Start Typing Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard/leaderboard"
              className="flex items-center justify-center gap-2 bg-secondary text-foreground font-bold text-lg px-10 py-5 rounded-2xl hover:bg-secondary/80 transition-all border border-border"
            >
              View Leaderboard <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <FadeInSection>
        <section className="py-12 border-y border-border/40 bg-muted/20">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
                <stat.icon className={cn("w-7 h-7", stat.color)} />
                <span className="text-4xl font-black tracking-tighter">{stat.value}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          <FadeInSection className="text-center space-y-3">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Everything you need</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three powerful tools to help you become a faster, more accurate typist.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <FadeInSection key={f.title}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative h-full bg-card border border-border rounded-[2rem] p-8 shadow-lg hover:shadow-2xl transition-shadow flex flex-col gap-6"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", f.bg)}>
                    <f.icon className={cn("w-7 h-7", f.color)} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-black tracking-tight">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                  <Link
                    href={f.href}
                    className="flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-3 transition-all"
                  >
                    {f.cta} <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/40">
        <div className="max-w-5xl mx-auto space-y-16">
          <FadeInSection className="text-center space-y-3">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Get started in under a minute. No account required to play.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Pick a Mode", desc: "Choose Easy, Medium, Hard, or Ultra difficulty." },
              { step: "02", title: "Start Typing", desc: "The timer starts on your first keystroke." },
              { step: "03", title: "See Your Stats", desc: "WPM and accuracy update in real time." },
              { step: "04", title: "Get Ranked", desc: "Submit your score to the global leaderboard." },
            ].map((item) => (
              <FadeInSection key={item.step}>
                <div className="relative flex flex-col gap-4 p-6 rounded-[1.5rem] bg-card border border-border h-full">
                  <span className="text-5xl font-black tracking-tighter text-primary/20">{item.step}</span>
                  <div>
                    <h3 className="font-black text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <FadeInSection>
        <section className="py-32 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
              Ready to <span className="text-primary">rank #1</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of typists competing for the top spot. It&apos;s free, fast, and addictive.
            </p>
            <Link
              href="/onboarding/username"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-black text-xl px-12 py-6 rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-2xl"
            >
              Start For Free <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </FadeInSection>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <img src="/logo1.png" alt="KeyType" className="w-14" />
            <span>© 2025–2026 KeyType · v2.1.0</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/updates" className="hover:text-foreground transition-colors">Updates</Link>
            <Link href="https://github.com/sardorazimov/keyboard" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

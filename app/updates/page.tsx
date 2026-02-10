"use client";

import { CheckCircle2, Circle, Rocket, Zap, Sparkles, Code2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "../../components/shared/footer";


const UPDATES = [
  {
    date: "2026-02-11",
    version: "v2.1.0",
    title: "The Intelligence Era",
    description: "Started the new year with a massive update focusing on player insights and ranking systems.",
    changes: [
      "Advanced Performance Analytics (Graphical data) integrated.",
      "Dynamic Achievement Badges system is now live.",
      "Full Light/Dark Mode visual stabilization completed."
    ],
    icon: Sparkles,
    type: "feature"
  },
  {
    date: "2025-12-12",
    version: "v2.0.0",
    title: "Game & Arena Launch",
    description: "The Great Arena update is live! It's no longer just typing; it's a battle against letters.",
    changes: [
      "Speed Typer (Falling Letters) game mode added.",
      "Global Game Arena leaderboard launched for real-time competition.",
      "Difficulty levels (Easy to Ultra) re-balanced for optimal flow."
    ],
    icon: Rocket,
    type: "update"
  },
  {
    date: "2025-10-12",
    version: "v1.5.0",
    title: "Global Leaderboard",
    description: "Global ranking system for standard typing tests is now operational.",
    changes: [
      "WPM (Words Per Minute) based ranking algorithm implemented.",
      "Local (Country-based) and Global filtering options added.",
      "User profile synchronization with LocalStorage enabled."
    ],
    icon: Trophy,
    type: "feature"
  },
  {
    date: "2025-08-01", 
    version: "v1.0.0",
    title: "KeyType Origins",
    description: "The foundation of KeyType.app was laid.",
    changes: [
      "Core Typing Test engine developed.",
      "PostgreSQL database architecture established.",
      "Initial UI/UX design language defined."
    ],
    icon: Code2,
    type: "launch"
  }
];

export default function UpdatesPage() {
  return (
    <div className="max-w-full mx-auto py-20 px-6">
      <div className="space-y-4 mb-16 text-center">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase">Changelog</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
          KeyType.app Evolution Journey
        </p>
      </div>

      <div className="relative space-y-12">
        {/* Dikey Çizgi */}
        <div className="absolute left-6 top-2 bottom-2 w-px bg-border md:left-1/2" />

        {UPDATES.map((update, idx) => (
          <div key={idx} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
            
            {/* İkon / Nokta */}
            <div className="absolute left-6 -translate-x-1/2 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 md:left-1/2">
              <update.icon className="w-5 h-5 text-primary" />
            </div>

            {/* İçerik Kartı */}
            <div className={cn(
              "ml-16 md:ml-0 md:w-[42%] p-6 rounded-[2rem] border border-border bg-card/50 backdrop-blur-sm shadow-xl hover:border-primary/50 transition-all",
              idx % 2 === 0 ? "md:text-right" : "md:order-last md:text-left"
            )}>
              <div className="flex flex-col gap-1 mb-4">
                <span className="text-primary font-mono text-xs font-black uppercase tracking-widest">{update.date}</span>
                <h3 className="text-xl font-black tracking-tight">{update.title}</h3>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full w-fit font-bold md:inline-block hidden">
                   {update.version}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {update.description}
              </p>

              <ul className={cn(
                "space-y-2",
                idx % 2 === 0 ? "md:items-end" : "md:items-start"
              )}>
                {update.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-bold text-foreground/80">
                    <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
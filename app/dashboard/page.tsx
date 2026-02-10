/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { DotPattern } from "../../components/ui/dot-patern";
import { cn } from "../../lib/utils";
import { ShineBorder } from "../../components/ui/shine-border";
import { 
  CheckCircle2, 
  RefreshCcw, 
  Timer, 
  Zap, 
  Target, 
  ChevronRight 
} from "lucide-react";
import { url } from "inspector/promises";

// ===== CONFIG =====
const TEST_TIME = 60;
const TEXT = "programming teaches patience precision and problem solving at the same time typing fast requires focus rhythm and accuracy";

// ===== SOUNDS =====
let clickAudio: HTMLAudioElement | null = null;
let errorAudio: HTMLAudioElement | null = null;

function playCorrect() {
  if (!clickAudio) { clickAudio = new Audio("/sounds/click.mp3"); clickAudio.volume = 0.3; }
  clickAudio.currentTime = 0; clickAudio.play().catch(() => {});
}

function playWrong() {
  if (!errorAudio) { errorAudio = new Audio("/sounds/error.mp3"); errorAudio.volume = 0.4; }
  errorAudio.currentTime = 0; errorAudio.play().catch(() => {});
}

export default function DashboardPage() {
  // Oyun State'leri
  const [mode, setMode] = useState<"easy" | "medium" | "hard" | "ultra">("medium");
  const [time, setTime] = useState(TEST_TIME);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [wrongIndexes, setWrongIndexes] = useState<Set<number>>(new Set());
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const router = useRouter();
  const { theme } = useTheme();
  const currentChar = TEXT[index];

  // Timer Döngüsü
  useEffect(() => {
    if (!started || finished) return;
    if (time === 0) { setFinished(true); return; }
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [started, time, finished]);

  // Klavye Dinleyicisi
  useEffect(() => {
  function handleKey(e: KeyboardEvent) {
    // 1. Tab tuşunun varsayılan odağını ve geçişini tamamen iptal et
    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation(); // Olayın yukarı yayılmasını durdur
      return;
    }

    // Alt, Control, Meta gibi sistem tuşlarını engelle
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    // Sadece tek karakterler ve Backspace'e izin ver
    if (e.key.length > 1 && e.key !== "Backspace") return;

    if (finished) return;
    if (!started) setStarted(true);
    if (index >= TEXT.length) return;

    const key = e.key;

    if (key === currentChar) {
      setCorrect((c) => c + 1);
      playCorrect();
    } else {
      setWrong((w) => w + 1);
      playWrong();
      setWrongIndexes((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
    }
    setIndex((i) => i + 1);
  }

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [index, currentChar, finished, started]);
// DashboardPage içindeki useEffect'lerin yanına ekle
useEffect(() => {
  if (finished) {
    saveScoreToDB();
  }
}, [finished]);

async function saveScoreToDB() {
  const username = localStorage.getItem("username");
  const country = localStorage.getItem("country");

  if (!username) return; // Kullanıcı adı yoksa kaydetme

  try {
    await fetch("/api/leaderboard", { // Sendeki API yolu farklıysa burayı düzelt (örn: /api/leaderboard)
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        country,
        wpm: wpm,
        accuracy: accuracy,
        mode: mode, // Easy, Medium vb.
      }),
    });
    console.log("Skor başarıyla kaydedildi!");
  } catch (error) {
    console.error("Skor kaydedilirken hata oluştu:", error);
  }
}
  // Hesaplamalar
  const elapsed = TEST_TIME - time || 1;
  const wpm = Math.round((correct / 5) / (elapsed / 60));
  const accuracy = Math.round((correct / (correct + wrong || 1)) * 100);
// Leaderboard sayfasındaki fetch kısmını böyle yapabilirsin:

  const reset = () => {
    setTime(TEST_TIME); setStarted(false); setFinished(false);
    setIndex(0); setCorrect(0); setWrong(0);
    setWrongIndexes(new Set());
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-10 overflow-hidden font-sans">
      <DotPattern className={cn("[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]")} />

      {/* 1. Zorluk Seçici (Top Bar) */}
      <div className="z-20 mb-10 flex bg-card/40 backdrop-blur-md p-1.5 rounded-2xl border border-border shadow-sm">
        {["easy", "medium", "hard", "ultra"].map((m) => (
          <button
            key={m}
            onClick={() => { reset(); setMode(m as any); }}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
              mode === m 
                ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl z-10 space-y-6">
        {/* 2. Stat Kartları */}
        <div className="grid grid-cols-3 gap-4 bg-card/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
          <Stat icon={<Timer className="text-blue-500 w-4 h-4" />} label="Süre" value={`${time}s`} />
          <Stat icon={<Zap className="text-emerald-500 w-4 h-4" />} label="Hız (WPM)" value={isNaN(wpm) ? 0 : wpm} />
          <Stat icon={<Target className="text-amber-500 w-4 h-4" />} label="Doğruluk" value={`%${accuracy}`} />
          
          <button onClick={reset} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 hover:bg-secondary rounded-full transition-all group">
            <RefreshCcw className="w-5 h-5 text-muted-foreground group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* 3. Metin Alanı (Boşluk Problemi Çözüldü) */}
        <div className="relative bg-card/40 backdrop-blur-sm rounded-[3rem] border border-border shadow-2xl">
          <ShineBorder shineColor={theme === "dark" ? "#ffffff" : "#000000"} />
          <div className="p-10 md:p-14 text-2xl md:text-3xl font-mono leading-[1.7] tracking-tight max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="flex flex-wrap items-center">
              {TEXT.split("").map((char, i) => {
                let stateClass = "text-muted-foreground/30";
                if (i < index) {
                  stateClass = wrongIndexes.has(i) ? "text-red-500 underline decoration-2 offset-4" : "text-foreground font-medium";
                }
                
                return (
                  <span 
                    key={i} 
                    className={cn(
                      "relative transition-all duration-75",
                      char === " " ? "inline-block w-[0.5em]" : "", // Boşluğa fiziksel genişlik
                      stateClass,
                      i === index && "bg-primary/20 rounded-md ring-2 ring-primary/20"
                    )}
                  >
                    {char === " " && wrongIndexes.has(i) ? "•" : char}
                    {i === index && (
                      <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary animate-pulse rounded-full" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Başarı Modalı */}
      {finished && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-2xl p-4 animate-in fade-in duration-500">
          <div className="bg-card border border-border p-10 rounded-[3.5rem] w-full max-w-lg shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center">
               <div className="bg-emerald-500/10 p-5 rounded-full ring-8 ring-emerald-500/5">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
               </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight uppercase italic text-primary">Test Finished!</h2>
              <div className="inline-block px-4 py-1.5 bg-secondary rounded-full text-[10px] font-black tracking-[0.2em] text-muted-foreground">
                TICKET NO: #0023-{mode.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-muted/40 p-6 rounded-[2rem] border border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Speed</p>
                  <p className="text-3xl font-black">{wpm} <span className="text-xs">WPM</span></p>
               </div>
               <div className="bg-muted/40 p-6 rounded-[2rem] border border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Accuracy</p>
                  <p className="text-3xl font-black">%{accuracy}</p>
               </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button 
                onClick={reset}
                className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl hover:opacity-90 transition-all active:scale-95"
              >
                Restart 
              </button>
              <button 
                onClick={() => router.push("/dashboard/leaderboard")}
                className="w-full bg-secondary text-foreground font-bold py-5 rounded-2xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
              >
                VIEW LEADERBOARD <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Yardımcı Bileşenler
function Stat({ icon, label, value }: { icon: any, label: string; value: any }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{label}</span>
      </div>
      <span className="text-4xl font-mono font-black tracking-tighter">{value}</span>
    </div>
  );
}
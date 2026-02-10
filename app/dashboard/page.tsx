/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import Keyboard from "@/components/shared/keyboard"; // Daha önce yaptığımız klavyeyi buraya import et
import { DotPattern } from "../../components/ui/dot-patern";
import { cn } from "../../lib/utils";
import { ShineBorder } from "../../components/ui/shine-border";
import { useTheme } from "next-themes";
import { Card } from "../../components/ui/card";

// ===== CONFIG =====
const TEST_TIME = 60;
const TEXT = "programming teaches patience precision and problem solving at the same time typing fast requires focus rhythm and accuracy";

// ===== SOUND (Aynı Kalıyor) =====
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
  const [time, setTime] = useState(TEST_TIME);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [wrongIndexes, setWrongIndexes] = useState<Set<number>>(new Set());
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const currentChar = TEXT[index];
  const savedRef = useRef(false);

  // Timer & Key Handler Logic (Kodun burası aynı kalıyor, sadece UI'ı değiştiriyoruz)
  useEffect(() => {
    if (!started || finished) return;
    if (time === 0) { setFinished(true); return; }
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [started, time, finished]);

  useEffect(() => {
   function handleKey(e: KeyboardEvent) {
  // ⛔ tarayıcı davranışlarını kapat
  if (e.key === "Tab") {
    e.preventDefault();
    return;
  }

  // sadece yazılabilir tuşlar
  if (e.key.length > 1 && e.key !== "Backspace") return;

  if (finished) return;
  if (!started) setStarted(true);

  if (index >= TEXT.length) return;

  const key = e.key;

  // SPACE geçerli
  if (key === " ") {
    if (currentChar === " ") {
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
    return;
  }

  // normal harfler
  if (key.length === 1) {
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
}


    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, currentChar, finished, started]);

  const elapsed = TEST_TIME - time || 1;
  const wpm = Math.round((correct / 5) / (elapsed / 60));
  const accuracy = Math.round((correct / (correct + wrong || 1)) * 100);

  function reset() {
    setTime(TEST_TIME); setStarted(false); setFinished(false);
    setIndex(0); setCorrect(0); setWrong(0);
    setWrongIndexes(new Set()); savedRef.current = false;
  }
   const theme = useTheme()

  return (
    <div className="min-h-screen transition-colors duration-500 font-sans">
        <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
        )}
      />
      {/* Üst Alan: Skorlar */}
     
      <div className="max-w-4xl mx-auto pt-12 px-6">
        <div className="flex  justify-between items-center mb-12  backdrop-blur-xl p-6 rounded-3xl border-primary-foreground border shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex bg-card gap-12">
              <ShineBorder className="rotate-shine " shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <Stat label="TIME" value={`${time}s`} color="text-blue-500" />
            <Stat label="WPM" value={isNaN(wpm) ? 0 : wpm} color="text-emerald-500" />
            <Stat label="ACCURACY" value={`%${accuracy}`} color="text-amber-500" />
          </div>
          <button onClick={reset} className="p-3 hover:rotate-180 transition-transform duration-500 text-slate-400">
            🔄
          </button>
        </div>

        {/* Metin Alanı */}
        <div className="relative mb-12 group bg-card p-6 rounded-3xl border-primary-foreground border shadow-xl shadow-slate-200/50 dark:shadow-none">
          <ShineBorder shineColor={theme.theme === "dark" ? "white" : "black"} />
          <div className="w-full p-10 rounded-[2rem] bshadow-inner text-2xl font-mono leading-relaxed tracking-wide min-h-[200px]">
            <div className="flex flex-wrap gap-x-[0.25em]">
              {TEXT.split("").map((char, i) => {
                let stateClass = "text-slate-900 dark:text-slate-600";
                if (i < index) {
                  stateClass = wrongIndexes.has(i) 
                    ? "text-red-500 border-b-2 border-red-500/50" 
                    : "text-slate-800 dark:text-slate-100";
                }

                return (
                  <span key={i} className={`relative transition-colors duration-150 ${stateClass}`}>
                    {char === " " && wrongIndexes.has(i) ? "_" : char}
                    {i === index && (
                      <span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-500 animate-pulse rounded-full" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Klavye (Ortalanmış) */}
        <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
          {/* <Keyboard expectedKey={currentChar} /> */}
        </div>
      </div>

      {/* Modern Sonuç Modalı */}
      {finished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] w-full max-w-lg shadow-2xl scale-in-center">
            <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent text-center">
              Test Tamamlandı!
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <ResultCard label="Hız" value={wpm} unit="WPM" />
              <ResultCard label="Doğruluk" value={accuracy} unit="%" />
              <ResultCard label="Yanlış" value={wrong} unit="Adet" />
              <ResultCard label="Süre" value={elapsed} unit="Sn" />
            </div>

            <button
              onClick={reset}
              className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
            >
              Yeniden Başlat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Yardımcı Alt Bileşenler
function Stat({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{label}</span>
      <span className={`text-3xl font-mono font-bold ${color}`}>{value}</span>
    </div>
  );
}

function ResultCard({ label, value, unit }: { label: string; value: any; unit: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
      <div className="text-slate-400 text-xs font-bold uppercase mb-1">{label}</div>
      <div className="text-3xl font-black dark:text-white">{value}<span className="text-sm ml-1 text-slate-500 font-normal">{unit}</span></div>
    </div>
  );
}
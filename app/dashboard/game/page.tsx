/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { DIFFICULTY, Difficulty } from "@/lib/difficulty";
import { LightRays } from "../../../components/ui/light-rays";
import { Button } from "../../../components/ui/button";

type Letter = {
  id: number;
  char: string;
  y: number;
  lane: number;
  isCorrect?: boolean; // Görsel efekt için
};

// Ultra Hard için semboller eklendi
const CHARS = {
  easy: "asdfjkl",
  medium: "asdfjklqwertyuiop",
  hard: "abcdefghijklmnopqrstuvwxyz",
  ultra: "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
};

const HEIGHT = 420;

export default function GamePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(false);

  const idRef = useRef(0);
  const config = DIFFICULTY[difficulty];

  // API Kayıt ve Game Over Kontrolü
  useEffect(() => {
    if (lives <= 0 && running) {
      setRunning(false);
      const username = localStorage.getItem("username");
      if (username) {
        fetch("/api/game-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, score, difficulty }),
        });
      }
    }
  }, [lives, running]);

  /* 🎲 GELİŞMİŞ SPAWN - Mod odaklı karakter seçimi */
  useEffect(() => {
    if (!running) return;

    const spawn = setInterval(() => {
      const charPool = CHARS[difficulty as keyof typeof CHARS] || CHARS.easy;
      const char = charPool[Math.floor(Math.random() * charPool.length)];
      const lane = Math.floor(Math.random() * config.lanes);

      setLetters((l) => [
        ...l,
        { id: idRef.current++, char, y: 0, lane },
      ]);
    }, config.spawnInterval);

    return () => clearInterval(spawn);
  }, [running, difficulty, config.spawnInterval]);

  /* ⏱️ AKICI DÜŞÜŞ */
  useEffect(() => {
    if (!running) return;

    const tick = setInterval(() => {
      setLetters((prev) =>
        prev
          .map((l) => ({ ...l, y: l.y + config.speed }))
          .filter((l) => {
            if (l.y > HEIGHT) {
              setLives((v) => Math.max(0, v - 1)); // Canı azalt ama 0'ın altına inme
              return false;
            }
            return true;
          })
      );
    }, 30); // 50ms'den 30ms'ye çekerek daha akıcı yaptık

    return () => clearInterval(tick);
  }, [running, config.speed]);

  /* ⌨️ INPUT KONTROLÜ - Yanlış tuş cezası eklendi */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!running) return;
      
      const key = e.key.toLowerCase();
      // ESC ile oyunu durdurma özelliği
      if (key === "escape") setRunning(false);

      setLetters((prev) => {
        // En aşağıya en yakın olan aynı harfi bul
        const targetIndex = prev.findIndex((l) => l.char === key);

        if (targetIndex !== -1) {
          setScore((s) => s + (difficulty === "ultra" ? 5 : 1));
          return prev.filter((_, i) => i !== targetIndex);
        } else {
          // YANLIŞ TUŞ CEZASI (Opsiyonel: Hard ve Ultra'da can götürür)
          if (difficulty === "hard" || difficulty === "ultra") {
            setLives(v => Math.max(0, v - 1));
          }
          return prev;
        }
      });
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, difficulty]);

  function start() {
    setLetters([]);
    setScore(0);
    setLives(3);
    setRunning(true);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black italic text-primary tracking-tighter">⌨️ SPEED TYPER</h1>
        <div className="flex gap-4 font-mono bg-black/40 p-2 rounded-lg border border-white/10">
          <div className="text-yellow-400">SCORE: {score.toString().padStart(4, '0')}</div>
          <div className="text-red-500">LIVES: {"❤️".repeat(lives)}</div>
        </div>
      </div>

      {/* MOD SEÇİMİ */}
      <div className="flex gap-2 p-1  bg-white/5 rounded-xl border dark:border-white/10 ">
        {(["easy", "medium", "hard", "ultra"] as const).map((d) => (
          <button
            key={d}
            disabled={running}
            onClick={() => setDifficulty(d)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              difficulty === d 
                ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                : "dark:text-white/40 text-black hover:bg-white/10"
            }`}
          >
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      {/* OYUN ALANI */}
      <div className="relative rounded-2xl h-[450px] overflow-hidden bg-gradient-to-b from-transparent to-primary/10 border-2 border-white/5 shadow-2xl flex">
        {/* Şerit Çizgileri */}
        {Array.from({ length: config.lanes }).map((_, i) => (
          <div key={i} className="flex-1 border-r border-white/5 last:border-r-0" />
        ))}

        {/* Düşen Harfler */}
        {letters.map((l) => (
          <div
            key={l.id}
            className={`absolute flex items-center justify-center w-12 h-12 rounded-full 
                       text-2xl font-black border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]
                       ${difficulty === 'ultra' ? 'text-purple-400 border-purple-500 bg-purple-950/50' : 'text-green-400 border-green-500 bg-green-950/50'}`}
            style={{
              top: l.y,
              left: `${(l.lane + 0.5) * (100 / config.lanes)}%`,
              transform: "translateX(-50%)",
              transition: "top 0.03s linear" // Daha pürüzsüz hareket
            }}
          >
            {l.char.toUpperCase()}
          </div>
        ))}

        {/* OVERLAY */}
        {!running && (
          <div className="absolute inset-0  backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-50">
            <div className="text-center">
              <h2 className="text-4xl font-black mb-2">{lives <= 0 ? "GAME OVER" : "READY?"}</h2>
              <p className=" font-mono">Final Score: {score}</p>
            </div>
            <Button onClick={start} size="lg" className="px-10 py-6 text-xl font-bold hover:scale-105 transition-transform">
              {lives <= 0 ? "TRY AGAIN" : "START GAME"}
            </Button>
          </div>
        )}
      </div>
      
      <LightRays />
    </div>
  );
}
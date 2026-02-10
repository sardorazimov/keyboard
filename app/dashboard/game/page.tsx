/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { DIFFICULTY, Difficulty } from "@/lib/difficulty";
import { LightRays } from "../../../components/ui/light-rays";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

type Letter = {
  id: number;
  char: string;
  y: number;
  lane: number;
};

const CHARS = {
  easy: "asdfjkl",
  medium: "asdfjklqwertyuiop",
  hard: "abcdefghijklmnopqrstuvwxyz",
  ultra: "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
};

const HEIGHT = 420;

export default function GamePage() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(false);

  const idRef = useRef(0);
  const config = DIFFICULTY[difficulty];

  // 1. API'ye Kayıt Fonksiyonu
  const saveGameScore = useCallback(async (finalScore: number) => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      await fetch("/api/game-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          score: finalScore, 
          difficulty: difficulty // 'easy', 'medium' vb. olarak gider
        }),
      });
    } catch (err) {
      console.error("Score save error:", err);
    }
  }, [difficulty]);

  // 2. Oyun Bitiş Kontrolü
  useEffect(() => {
    if (lives <= 0 && running) {
      setRunning(false);
      saveGameScore(score);
    }
  }, [lives, running, score, saveGameScore]);

  // 3. Harf Oluşturma (Spawn)
  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(() => {
      const charPool = CHARS[difficulty as keyof typeof CHARS] || CHARS.easy;
      const char = charPool[Math.floor(Math.random() * charPool.length)];
      const lane = Math.floor(Math.random() * config.lanes);
      setLetters((l) => [...l, { id: idRef.current++, char, y: 0, lane }]);
    }, config.spawnInterval);
    return () => clearInterval(spawn);
  }, [running, difficulty, config.spawnInterval]);

  // 4. Akıcı Düşüş (Tick)
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setLetters((prev) =>
        prev
          .map((l) => ({ ...l, y: l.y + config.speed }))
          .filter((l) => {
            if (l.y > HEIGHT) {
              setLives((v) => Math.max(0, v - 1));
              return false;
            }
            return true;
          })
      );
    }, 30);
    return () => clearInterval(tick);
  }, [running, config.speed]);

  // 5. Klavye Kontrolü
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!running) return;
      const key = e.key.toLowerCase();
      if (key === "escape") setRunning(false);

      setLetters((prev) => {
        const targetIndex = prev.findIndex((l) => l.char === key);
        if (targetIndex !== -1) {
          setScore((s) => s + (difficulty === "ultra" ? 5 : 1));
          return prev.filter((_, i) => i !== targetIndex);
        } else {
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
    <div className="p-6 max-w-3xl mx-auto space-y-6 mt-10 relative z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black italic text-primary tracking-tighter uppercase">Speed Typer</h1>
        <div className="flex gap-4 font-mono bg-black/40 p-2 px-4 rounded-xl border border-white/10">
          <div className="text-yellow-400 font-bold">SCORE: {score.toString().padStart(4, '0')}</div>
          <div className="text-red-500 font-bold">LIVES: {"❤️".repeat(lives)}</div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
        {(["easy", "medium", "hard", "ultra"] as const).map((d) => (
          <button
            key={d}
            disabled={running}
            onClick={() => setDifficulty(d)}
            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              difficulty === d ? "bg-primary text-primary-foreground shadow-lg" : "text-white/40 hover:bg-white/10"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="relative rounded-[2rem] h-[450px] overflow-hidden bg-black/20 border-2 border-white/5 shadow-2xl flex">
        {Array.from({ length: config.lanes }).map((_, i) => (
          <div key={i} className="flex-1 border-r border-white/5 last:border-r-0" />
        ))}

        {letters.map((l) => (
          <div
            key={l.id}
            className={`absolute flex items-center justify-center w-12 h-12 rounded-full text-2xl font-black border-2 shadow-xl ${
              difficulty === 'ultra' ? 'text-purple-400 border-purple-500 bg-purple-900/40' : 'text-green-400 border-green-500 bg-green-900/40'
            }`}
            style={{
              top: l.y,
              left: `${(l.lane + 0.5) * (100 / config.lanes)}%`,
              transform: "translateX(-50%)",
              transition: "top 0.03s linear"
            }}
          >
            {l.char.toUpperCase()}
          </div>
        ))}

        {!running && (
          <div className="absolute inset-0 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center gap-6 z-50">
            <h2 className="text-5xl font-black italic tracking-tighter">{lives <= 0 ? "GAME OVER" : "READY?"}</h2>
            {lives <= 0 && <p className="text-2xl font-mono text-primary font-bold">Final Score: {score}</p>}
            <div className="flex gap-4">
              <Button onClick={start} size="lg" className="px-10 h-16 text-xl font-bold rounded-2xl">
                {lives <= 0 ? "RETRY" : "START"}
              </Button>
              {lives <= 0 && (
                <Button variant="outline" onClick={() => router.push("/dashboard/game-leaderboard")} className="h-16 px-8 rounded-2xl font-bold">
                  SCORES
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <LightRays />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

type KeyState = "idle" | "active" | "correct" | "wrong";

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

export default function Keyboard({
  expectedKey,
}: {
  expectedKey?: string;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [states, setStates] = useState<Record<string, KeyState>>({});
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);


  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (!/^[a-z]$/.test(key)) return;

      setActiveKey(key);

      if (!expectedKey) return;

      setStates((prev) => ({
        ...prev,
        [key]: key === expectedKey.toLowerCase() ? "correct" : "wrong",
      }));
    }

    function handleKeyUp() {
      setActiveKey(null);
      setTimeout(() => setStates({}), 200); // Biraz daha uzun bir feedback süresi
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [expectedKey]);

  function getKeyStyles(key: string) {
    const state = states[key];
    const isActive = activeKey === key;

    // Durum Bazlı Renkler
    if (state === "correct") return "bg-emerald-500 text-white shadow-[0_4px_0_0_#059669] translate-y-[2px]";
    if (state === "wrong") return "bg-rose-500 text-white shadow-[0_4px_0_0_#e11d48] translate-y-[2px]";
    
    // Basılma (Active) Durumu
    if (isActive) return "bg-blue-500 text-white shadow-none translate-y-[4px]";

    // Varsayılan (Idle) Durum - Dark/Light Mode Uyumlu
    return `
      bg-white dark:bg-slate-800 
      text-slate-600 dark:text-slate-300 
      shadow-[0_4px_0_0_#e2e8f0] dark:shadow-[0_4px_0_0_#1e293b]
      hover:bg-slate-50 dark:hover:bg-slate-700
    `;
  }

  return (
    <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-3xl backdrop-blur-sm select-none inline-block border border-slate-200 dark:border-slate-800">
      <div className="space-y-3">
        {KEYS.map((row, i) => (
          <div key={i} className="flex justify-center gap-2">
            {row.map((key) => (
              <div
                key={key}
                className={`
                  w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center
                  font-bold uppercase transition-all duration-75 ease-out
                  border border-transparent text-lg
                  ${getKeyStyles(key)}
                `}
              >
                {key}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "Typing Test ⌨️",
    desc: "Burada ne kadar hızlı yazdığını ölçersin.",
  },
  {
    title: "Game 🎮",
    desc: "Yukarıdan harfler düşer, doğru tuşa bas.",
  },
  {
    title: "Leaderboard 🏆",
    desc: "En iyiler burada, skorunu gör.",
  },
];

export default function TutorialPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // 🔒 Guard
  useEffect(() => {
    const username = localStorage.getItem("username");
    const country = localStorage.getItem("country");

    if (!username || !country) {
      router.replace("/onboarding/username");
    }
  }, []);

  function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("onboarded", "true");
      router.push("/"); // siteye gir
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-neutral-800 w-full max-w-md p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {steps[step].title}
        </h2>

        <p className="text-neutral-300 mb-6">
          {steps[step].desc}
        </p>

        <button
          onClick={next}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded transition"
        >
          {step === steps.length - 1 ? "Başla 🚀" : "Devam Et"}
        </button>

        <p className="text-neutral-500 text-sm mt-3">
          {step + 1} / {steps.length}
        </p>
      </div>
    </div>
  );
}

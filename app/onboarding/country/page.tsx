"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CountrySelect from "../../../components/shared/country-select";


export default function CountryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔒 username guard
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.replace("/onboarding/username");
    }
  }, []);

  async function handleSelect(code: string) {
  const username = localStorage.getItem("username");
  if (!username) return;

  setLoading(true);

  try {
    await fetch("/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        country: code,
        language: navigator.language || "en",
      }),
    });

    localStorage.setItem("country", code);

    // ❗ burada replace kullan
    router.replace("/onboarding/tutorial");
  } catch (e) {
    console.error(e);
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">
          Ülkeni Seç
        </h1>
        <p className="text-neutral-400 mb-4">
          Leaderboard için gerekli
        </p>

        <CountrySelect onSelect={handleSelect} />

        {loading && (
          <p className="text-neutral-400 text-sm mt-3">
            Kaydediliyor...
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");

    if (username.length < 3) {
      setError("En az 3 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (data.taken) {
        setError("Bu kullanıcı adı alınmış");
        return;
      }

      // ✔️ burada username artık VAR
      localStorage.setItem("username", username);
      router.push("/onboarding/country");
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">
          Kullanıcı Adı
        </h1>

        <p className="text-neutral-400 mb-4">
          Leaderboard’da görünecek isim
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="örn: fastfinger"
          className="w-full p-3 rounded bg-neutral-900 text-white border border-neutral-700 focus:border-green-500 outline-none"
        />

        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded"
        >
          {loading ? "Kontrol ediliyor..." : "Devam"}
        </button>
      </div>
    </div>
  );
}

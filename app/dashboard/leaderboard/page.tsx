/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Loader } from "lucide-react";

type Row = {
  username: string;
  country: string;
  wpm: number;
  accuracy: number;
};

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"global" | "local">("global");

  // rank animasyonu için
  const [rankChange, setRankChange] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);

    const country =
      mode === "local"
        ? localStorage.getItem("country")
        : null;

    const url =
      mode === "local" && country
        ? `/api/leaderboard?country=${country}`
        : `/api/leaderboard`;

    fetch(url)
      .then((r) => r.json())
      .then((data: Row[]) => {
        setRows(data);

        // 🔹 RANK HESABI (BEN NEREDEYİM?)
        const username = localStorage.getItem("username");
        if (!username) return;

        const myIndex = data.findIndex(
          (r) => r.username === username
        );

        if (myIndex !== -1) {
          const currentRank = myIndex + 1;
          const prevRank = Number(
            localStorage.getItem("prevRank")
          );

          if (prevRank && prevRank !== currentRank) {
            const diff = prevRank - currentRank;
            setRankChange(diff);

            // 2.5 sn sonra kaybolsun
            setTimeout(() => {
              setRankChange(null);
            }, 2500);
          }

          localStorage.setItem(
            "prevRank",
            String(currentRank)
          );
        }
      })
      .finally(() => setLoading(false));
  }, [mode]);

  return (
    <div className="space-y-6 relative px-6 mt-10">
      <h1 className="text-2xl font-bold">🏆 Leaderboard</h1>

      {/* MODE SWITCH */}
      <div className="flex gap-4">
        <Button
          onClick={() => setMode("global")}
          className={`px-4 py-2 rounded ${
            mode === "global"
              ? ""
              : "bg-default text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap lg:text-lg  dark:text-white/80 text-black border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-primary border-primary"
          }`}
        >
          🌍 Global
        </Button>

        <Button
          onClick={() => setMode("local")}
          className={`px-4 py-2 rounded ${
            mode === "local"
              ? ""
              : "bg-default text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap lg:text-lg  dark:text-white/80 text-black border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-primary border-primary"
          }`}
        >
          📍 Local
        </Button>
      </div>

      {/* RANK CHANGE BADGE */}
      {rankChange !== null && (
        <div
          className={`
            fixed top-6 right-6 z-50
            px-4 py-2 rounded-lg text-lg font-bold
            transition-all duration-500
            ${
              rankChange > 0
                ? "bg-green-600 text-white animate-bounce"
                : "bg-red-600 text-white animate-pulse"
            }
          `}
        >
          {rankChange > 0 ? "⬆️ +" : "⬇️ "}
          {Math.abs(rankChange)} rank
        </div>
      )}

      {/* TABLE */}
      {loading ? (
  
        <p className="text-xl ">
          <Loader className="animate-spin mr-2" />
        </p>
      ) : (
        <div className="bg-primary-foreground rounded-lg overflow-hidden">
          <table className="w-full ">
            <thead className="text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">User</th>
                <th className="p-3">Country</th>
                <th className="p-3">WPM</th>
                <th className="p-3">Accuracy</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => {
                const isMe =
                  r.username ===
                  localStorage.getItem("username");

                return (
                  <tr
                    key={i}
                    className={`
                      border-t border-neutral-700
                      ${isMe ? "bg-primary-foreground cursor-pointer hover:bg-primary/10" : ""}
                    `}
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-semibold">
                      {r.username}
                      {isMe && " 👈 you"}
                    </td>
                    <td className="p-3">{r.country}</td>
                    <td className="p-3">{r.wpm}</td>
                    <td className="p-3">
                      {r.accuracy}%
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-neutral-400"
                  >
                    No data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

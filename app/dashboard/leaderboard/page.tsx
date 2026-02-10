/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Loader, Trophy, Globe, MapPin, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBadges } from "../../../lib/badges";
import { StatsModal } from "../../../components/shared/stats-modal";

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
  const [rankChange, setRankChange] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  // Client-side güvenli localStorage erişimi
  const getStorageItem = (key: string) => {
    if (typeof window !== "undefined") return localStorage.getItem(key);
    return null;
  };

  useEffect(() => {
    // useEffect içindeki fetchData fonksiyonunu böyle güncelle:
    const fetchData = async () => {
      setLoading(true);
      try {
        const country = mode === "local" ? getStorageItem("country") : null;

        // 1. ADIM: Hangi sayfadayız? (URL'den veya bir prop'tan anlayabilirsin)
        // Eğer bu dosya sadece Game Leaderboard içinse direkt 'game' yazabilirsin.
        const boardType = "game";

        // 2. ADIM: URL'ye mutlaka type=game ekle
        let url = `/api/leaderboard?type=${boardType}`;
        if (mode === "local" && country) {
          url += `&country=${country}`;
        }

        const res = await fetch(url, { cache: 'no-store' }); // Cache'i kapat ki yeni skorlar anında düşsün
        const data = await res.json();
        setRows(data);

        // ... (Rank hesaplama kısmı aynı kalabilir)
      } catch (error) {
        console.error("Leaderboard yüklenemedi", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode]);

  return (
    <div className="space-y-8 relative px-6 mt-12 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
          <Trophy className="text-yellow-500 w-8 h-8" />
          LEADERBOARD
        </h1>

        {/* MODE SWITCH - Temizlendi */}
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border">
          <Button
            variant={mode === "global" ? "default" : "ghost"}
            onClick={() => setMode("global")}
            className="rounded-lg px-6 font-bold gap-2"
          >
            <Globe className="w-4 h-4" /> Global
          </Button>
          <Button
            variant={mode === "local" ? "default" : "ghost"}
            onClick={() => setMode("local")}
            className="rounded-lg px-6 font-bold gap-2"
          >
            <MapPin className="w-4 h-4" /> Local
          </Button>
        </div>
      </div>

      {/* RANK NOTIFICATION */}
      {rankChange !== null && (
        <div className={cn(
          "fixed top-24 right-10 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-500",
          rankChange > 0 ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        )}>
          {rankChange > 0 ? <ArrowUpCircle /> : <ArrowDownCircle />}
          <span className="font-black tracking-tight">
            {rankChange > 0 ? `RANK YÜKSELDİ! +${rankChange}` : `RANK DÜŞTÜ! ${rankChange}`}
          </span>
        </div>
      )}

      {/* MODERN TABLE */}
      <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader className="animate-spin w-10 h-10 text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Scores loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30 text-muted-foreground text-[11px] uppercase tracking-[0.2em] font-black">
                  <th className="p-5 text-center w-16">#</th>
                  <th className="p-5 text-left">Player</th>
                  <th className="p-5 text-left">Country</th>
                  <th className="p-5 text-center">WPM</th>
                  <th className="p-5 text-center text-primary">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rows.map((r, i) => {
                  const isMe = r.username === getStorageItem("username");
                  const userBadges = getBadges(r)
                  return (
                    <tr
                    onClick={() => setSelectedUser(r.username)}
                      key={i}
                      className={cn(
                        "transition-colors group",
                        isMe ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/20"
                      )}
                    >
                      <td className="p-5 text-center">
                        <span className={cn(
                          "font-mono font-bold",
                          i === 0 ? "text-yellow-500 text-xl" :
                            i === 1 ? "text-slate-400 text-lg" :
                              i === 2 ? "text-amber-700 text-lg" : "text-muted-foreground"
                        )}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-bold tracking-tight", isMe && "text-primary italic")}>
                            {r.username}
                          </span>
                          {isMe && (
                            <span className="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded-full font-black uppercase">You</span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {userBadges.map(badge => (
                            <div key={badge.id} title={badge.label}>
                              <badge.icon
                                className={cn("w-4 h-4", badge.color)}
                              />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-muted-foreground font-medium uppercase tracking-tighter">
                        {r.country || "—"}
                      </td>
                      <td className="p-5 text-center font-black text-xl tracking-tighter">
                        {/* Eğer wpm varsa onu bas, yoksa score bas (Oyun modunda score dolu gelir) */}
                        {r.wpm || (r as any).score || 0}
                      </td>
                      <td className="p-5 text-center font-mono font-bold text-primary/80">
                        %{r.accuracy}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
              {selectedUser && (
                                        <StatsModal
                                            username={selectedUser}
                                            isOpen={!!selectedUser}
                                            onClose={() => setSelectedUser(null)}
                                        />
                                    )}
            {rows.length === 0 && (
              <div className="p-20 text-center text-muted-foreground font-medium italic">
                No scores recorded in this category yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
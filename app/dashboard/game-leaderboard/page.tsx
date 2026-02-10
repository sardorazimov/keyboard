/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Loader, Trophy, Globe, MapPin } from "lucide-react";

type Row = {
    username: string;
    country: string;
    score: number;
    difficulty: string;
};

export default function LeaderboardPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<"global" | "local">("global");
    const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
    const [rankChange, setRankChange] = useState<number | null>(null);

    useEffect(() => {
        fetchLeaderboard();
    }, [mode, filterDifficulty]);

    const fetchLeaderboard = () => {
        setLoading(true);
        const country = mode === "local" ? localStorage.getItem("country") : null;

        // API URL'ine zorluk filtresini de ekliyoruz
        let url = `/api/leaderboard?`;
        if (mode === "local" && country) url += `country=${country}&`;
        if (filterDifficulty !== "all") url += `difficulty=${filterDifficulty}`;

        fetch(url)
            .then((r) => r.json())
            .then((data: Row[]) => {
                setRows(data);
                checkRankChange(data);
            })
            .finally(() => setLoading(false));
    };

    const checkRankChange = (data: Row[]) => {
        const username = localStorage.getItem("username");
        if (!username) return;

        const myIndex = data.findIndex((r) => r.username === username);
        if (myIndex !== -1) {
            const currentRank = myIndex + 1;
            const prevRank = Number(localStorage.getItem("prevRank"));

            if (prevRank && prevRank !== currentRank) {
                setRankChange(prevRank - currentRank);
                setTimeout(() => setRankChange(null), 3000);
            }
            localStorage.setItem("prevRank", String(currentRank));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6 mt-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black flex items-center gap-2">
                    <Trophy className="text-yellow-500" /> LEADERBOARD
                </h1>

                {/* MOD SEÇİCİ (Global / Local) */}
                <div className="flex bg-secondary/50 p-1 rounded-xl border border-border w-fit backdrop-blur-sm">
                    <Button
                        onClick={() => setMode("global")}
                        variant={mode === "global" ? "default" : "ghost"}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${mode === "global"
                                ? "shadow-md scale-105"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Globe className="inline-block w-4 h-4 mr-2" />
                        GLOBAL
                    </Button>

                    <Button
                        onClick={() => setMode("local")}
                        variant={mode === "local" ? "default" : "ghost"}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${mode === "local"
                                ? "shadow-md scale-105"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <MapPin className="inline-block w-4 h-4 mr-2" />
                        LOCAL
                    </Button>
                </div>
            </div>

            {/* ZORLUK FİLTRESİ */}
            <div className="flex flex-wrap gap-2">
                {["all", "easy", "medium", "hard", "ultra"].map((d) => (
                    <Button
                        key={d}
                        variant={filterDifficulty === d ? "default" : "outline"}
                        onClick={() => setFilterDifficulty(d)}
                        className="capitalize"
                    >
                        {d}
                    </Button>
                ))}
            </div>

            {/* RANK CHANGE POPUP */}
            {rankChange !== null && (
                <div className={`fixed bottom-10 right-10 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold animate-bounce ${rankChange > 0 ? "bg-green-500" : "bg-red-500"}`}>
                    {rankChange > 0 ? "🚀 Sıralaman yükseldi! +" : "📉 Sıralaman düştü: "}
                    {Math.abs(rankChange)} Leaderboard
                </div>
            )}

            {/* LİSTE */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader className="animate-spin w-10 h-10 text-primary" />
                </div>
            ) : (
                <div className=" bg-primary-foreground  border rounded-2xl overflow-hidden backdrop-blur-md">
                    <table className="w-full text-left">
                        <thead className="bg-primary-foreground/5  text-xs uppercase tracking-widest">
                            <tr className="  bg-primary-foreground  text-xs uppercase tracking-widest">
                                <th className="p-4">Leaderboard</th>
                                <th className="p-4">Player</th>
                                <th className="p-4">Country</th>
                                <th className="p-4 text-right">Score</th>
                                <th className="p-4 text-center">Mod</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {rows.map((r, i) => {
                                const isMe = r.username === localStorage.getItem("username");
                                return (
                                    <tr key={i} className={`transition-colors bg-primary-foreground cursor-pointer hover:bg-primary/10 ${isMe ? "bg-primary-foreground cursor-pointer hover:bg-primary/10" : ""}`}>
                                        <td className="p-4 font-mono">{i + 1}</td>
                                        <td className="p-4 font-bold flex items-center gap-2">
                                            {r.username}
                                            {isMe && <span className="text-[10px] bg-primary-foreground px-2 py-0.5 rounded-full uppercase">You</span>}
                                        </td>
                                        <td className="p-4 ">{r.country}</td>
                                        <td className="p-4 text-right font-black text-yellow-400 font-mono">
                                            {r.score?.toLocaleString() ?? "0"}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase border bg-green-900 ${r.difficulty === 'ultra' ? 'border-purple-500 text-purple-400' :
                                                r.difficulty === 'hard' ? 'border-red-500 text-red-400' : 'border rounded-xl'
                                                }`}>
                                                {r.difficulty}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {rows.length === 0 && (
                        <div className="p-20 text-center text-white/20 font-bold uppercase tracking-tighter text-2xl">
                            No Data
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
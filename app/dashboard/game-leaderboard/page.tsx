/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Loader, Trophy, Globe, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsModal } from "../../../components/shared/stats-modal";

type Row = {
    username: string;
    country: string;
    score: number;
    difficulty: string;
};

export default function GameLeaderboardPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<"global" | "local">("global");
    const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboard();
    }, [mode, filterDifficulty]);

    const fetchLeaderboard = () => {
        setLoading(true);
        const country = mode === "local" ? localStorage.getItem("country") : null;
        let url = `/api/leaderboard?type=game&`;
        if (mode === "local" && country) url += `country=${country}&`;
        if (filterDifficulty !== "all") url += `difficulty=${filterDifficulty}`;

        fetch(url, { cache: 'no-store' })
            .then((r) => r.json())
            .then((data: Row[]) => setRows(data))
            .finally(() => setLoading(false));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6 mt-12 pb-20 transition-colors">
            {/* BAŞLIK KISMI */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3 uppercase text-foreground">
                        <Trophy className="text-yellow-500 w-10 h-10" /> Game Arena
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-black tracking-[0.4em] uppercase ml-1 opacity-70">Global Rankings</p>
                </div>

                {/* MOD SEÇİCİ - Light/Dark Uyumlu */}
                <div className="flex bg-muted/50 p-1 rounded-2xl border border-border backdrop-blur-md">
                    <Button
                        onClick={() => setMode("global")}
                        variant={mode === "global" ? "default" : "ghost"}
                        className={cn("px-8 font-black rounded-xl italic", mode === "global" && "shadow-lg")}
                    >
                        <Globe className="w-4 h-4 mr-2" /> GLOBAL
                    </Button>
                    <Button
                        onClick={() => setMode("local")}
                        variant={mode === "local" ? "default" : "ghost"}
                        className={cn("px-8 font-black rounded-xl italic", mode === "local" && "shadow-lg")}
                    >
                        <MapPin className="w-4 h-4 mr-2" /> LOCAL
                    </Button>
                </div>
            </div>

            {/* ZORLUK FİLTRELERİ - Cam Efekti Light Mode uyumlu */}
            <div className="flex flex-wrap gap-2 bg-muted/30 p-2 rounded-2xl border border-border">
                {["all", "easy", "medium", "hard", "ultra"].map((d) => (
                    <Button
                        key={d}
                        variant={filterDifficulty === d ? "default" : "ghost"}
                        onClick={() => setFilterDifficulty(d)}
                        className={cn(
                            "capitalize flex-1 font-bold rounded-xl transition-all",
                            filterDifficulty !== d && "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {d}
                    </Button>
                ))}
            </div>

            {/* TABLO - Kilit Nokta Burası */}
            <div className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] shadow-2xl transition-all">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-32 gap-4">
                        <Loader className="animate-spin w-12 h-12 text-primary" />
                        <span className="text-[10px] font-black tracking-widest text-muted-foreground animate-pulse uppercase">Syncing Arena...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-border">
                                    <th className="p-6 text-center w-20">#</th>
                                    <th className="p-6 text-left">Survivor</th>
                                    <th className="p-6 text-center">Country</th>
                                    <th className="p-6 text-right">Points</th>
                                    <th className="p-6 text-center w-32">Rank</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {rows.map((r, i) => {
                                    const isMe = r.username === localStorage.getItem("username");
                                    return (
                                        <tr
                                            onClick={() => setSelectedUser(r.username)}
                                            key={i} className={cn(
                                                "group transition-all",

                                                isMe ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-muted/30"
                                            )}>
                                            <td className="p-6 text-center font-mono font-bold text-muted-foreground group-hover:text-primary">
                                                {i + 1}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "font-black tracking-tight transition-colors",
                                                        isMe ? "text-primary italic" : "text-foreground"
                                                    )}>
                                                        {r.username}
                                                    </span>
                                                    {isMe && <Sparkles className="w-3 h-3 text-primary animate-pulse" />}
                                                </div>
                                            </td>
                                            <td className="p-6 text-center text-muted-foreground font-bold uppercase tracking-tighter italic">
                                                {r.country || "—"}
                                            </td>
                                            <td className="p-6 text-right font-black text-2xl text-primary tracking-tighter">
                                                {r.score?.toLocaleString() ?? "0"}
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={cn(
                                                    "text-[9px] font-black px-3 py-1.5 rounded-full border tracking-widest uppercase",
                                                    r.difficulty === 'ultra' ? 'bg-purple-500/10 border-purple-500/50 text-purple-600 dark:text-purple-400' :
                                                        r.difficulty === 'hard' ? 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400' :
                                                            'bg-muted border-border text-muted-foreground'
                                                )}>
                                                    {r.difficulty}
                                                </span>
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
                            <div className="p-32 text-center opacity-20 font-black uppercase tracking-[0.5em] text-foreground italic text-xl">
                                Arena Empty
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
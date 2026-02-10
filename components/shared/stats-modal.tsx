/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "lucide-react";

export function StatsModal({ username, isOpen, onClose }: { username: string, isOpen: boolean, onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && username) {
      setLoading(true);
      fetch(`/api/user-stats/${username}`)
        .then(res => res.json())
        .then(json => {
          setData(json);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [username, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-[2rem] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <span className="text-primary">@</span>{username}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader className="animate-spin text-primary" />
          </div>
        ) : data?.stats ? (
          <div className="space-y-6 py-4">
            {/* Özet Kartları */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                <p className="text-[10px] font-black uppercase text-muted-foreground italic">Best Score</p>
                <p className="text-3xl font-black text-primary">{data.stats.maxScore || 0}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                <p className="text-[10px] font-black uppercase text-muted-foreground italic">Avg. WPM</p>
                <p className="text-3xl font-black text-yellow-500">{Math.round(data.stats.avgWpm || 0)}</p>
              </div>
            </div>

            {/* Grafik */}
            <div className="h-[200px] w-full bg-muted/20 rounded-2xl p-4 border border-border relative overflow-hidden">
              <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Performance Trend</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.history}>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={4}
                    dot={{ r: 4, fill: '#22c55e' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center p-10 text-muted-foreground font-bold italic">No stats found for this survivor.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
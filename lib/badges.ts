/* eslint-disable @typescript-eslint/no-explicit-any */
import { Zap, Target, Crown, Flame, Trophy } from "lucide-react";

export const BADGE_RULES = [
  {
    id: "speed_demon",
    label: "Hız İblisi",
    description: "100 WPM barajını geçtin!",
    icon: Zap,
    color: "text-yellow-400",
    check: (s: any) => s.wpm >= 100,
  },
  {
    id: "sniper",
    label: "Keskin Nişancı",
    description: "%100 doğrulukla oyun bitirdin!",
    icon: Target,
    color: "text-emerald-400",
    check: (s: any) => s.accuracy === 100 && s.score > 50,
  },
  {
    id: "ultra_king",
    label: "Ultra Kral",
    description: "Ultra modun efendisi!",
    icon: Crown,
    color: "text-purple-400",
    check: (s: any) => s.difficulty === "ultra" && s.score >= 300,
  },
  {
    id: "marathon",
    label: "Maratoncu",
    description: "Tek seferde 1000 puana ulaştın!",
    icon: Trophy,
    color: "text-blue-400",
    check: (s: any) => s.score >= 1000,
  }
];

export function getBadges(score: any) {
  return BADGE_RULES.filter(rule => rule.check(score));
}
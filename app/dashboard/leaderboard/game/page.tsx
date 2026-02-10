"use client";

import { useEffect, useState } from "react";

type Row = {
  username: string;
  score: number;
  difficulty: string;
};

export default function GameLeaderboard() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard?mode=game")
      .then((r) => r.json())
      .then(setRows);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        🏆 Game Leaderboard
      </h1>

      <table className="w-full bg-neutral-800 rounded">
        <thead>
          <tr className="text-left">
            <th>#</th>
            <th>User</th>
            <th>Score</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{r.username}</td>
              <td>{r.score}</td>
              <td>{r.difficulty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

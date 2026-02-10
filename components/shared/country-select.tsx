"use client";

import { useMemo, useState } from "react";
import { countries } from "../../lib/db/countres";


type Props = {
  onSelect: (code: string) => void;
};

export default function CountrySelect({ onSelect }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return countries.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="space-y-3">
      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ülke ara..."
        className="w-full p-3 rounded bg-neutral-900 text-white border border-neutral-700 focus:border-green-500 outline-none"
      />

      {/* LIST */}
      <div className="max-h-64 overflow-y-auto space-y-1">
        {filtered.map((c) => (
          <button
            key={c.code}
            onClick={() => onSelect(c.code)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-700 text-left"
          >
            <span className="text-lg">{c.flag}</span>
            <span className="text-white">{c.name}</span>
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="text-neutral-400 text-sm px-2">
            Sonuç bulunamadı
          </p>
        )}
      </div>
    </div>
  );
}

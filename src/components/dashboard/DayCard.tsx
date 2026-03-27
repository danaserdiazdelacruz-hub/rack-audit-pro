"use client";

import { TurnOption } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface RoundData {
  name: TurnOption;
  val: number;
  color: string;
}

interface DayCardProps {
  label: string;
  date: string;
  rounds: RoundData[];
}

export default function DayCard({ label, date, rounds }: DayCardProps) {
  return (
    <div className="bg-white border border-border-custom rounded-custom-lg p-6 shadow-card">
      {/* Header */}
      <div className="text-lg font-extrabold text-primary uppercase border-b-2 border-surface pb-2 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-accent">{label}</span>
        </div>
        <span className="text-xs font-semibold text-text-secondary">
          {formatDate(date)}
        </span>
      </div>

      {/* Mini Chart */}
      <div className="flex items-end gap-3 h-[120px] mb-6 pb-1 border-b border-border-custom">
        {rounds.map((round) => (
          <div key={round.name} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-xs font-extrabold mb-1">
              {round.val > 0 ? `${round.val}%` : ""}
            </span>
            <div
              className="w-full rounded-t min-h-[4px] transition-all duration-300"
              style={{
                height: `${round.val || 4}%`,
                backgroundColor: round.color,
              }}
            />
            <span className="text-xs text-text-secondary mt-1 font-bold">
              {round.name.replace("Ronda ", "R")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

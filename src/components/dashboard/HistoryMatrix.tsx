"use client";

import { TurnOption, Thresholds } from "@/lib/types";
import { getStatus, formatDate } from "@/lib/utils";

interface HistoryMatrixProps {
  days: (string | null)[];
  turns: TurnOption[];
  matrix: Record<string, Record<string, number | null>>;
  thresholds: Thresholds;
}

export default function HistoryMatrix({ days, turns, matrix, thresholds }: HistoryMatrixProps) {
  const cellStatusClass = (value: number | null) => {
    if (value === null) return "text-text-neutral text-sm";
    const status = getStatus(value, thresholds);
    if (status === "ok") return "border-t-4 border-t-success text-success";
    if (status === "warning") return "border-t-4 border-t-warning text-warning";
    return "border-t-4 border-t-danger text-danger";
  };

  return (
    <div className="bg-white border border-border-custom rounded-custom-lg p-6 shadow-card">
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-border-custom">
        <h3 className="text-lg font-semibold text-primary uppercase">
          Tendencia Histórica — Últimos 30 Días
        </h3>
        <div className="flex gap-3 text-[0.72rem] font-bold items-center">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-success rounded-sm" />OK
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-warning rounded-sm" />ATENCIÓN
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-danger rounded-sm" />CRÍTICO
          </span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-3">
        <div
          className="grid gap-px bg-border-custom border border-border-custom rounded-custom overflow-hidden"
          style={{
            gridTemplateColumns: `52px repeat(30, minmax(40px, 1fr))`,
            minWidth: "1272px",
          }}
        >
          {/* Header Row */}
          <div className="bg-[#dce3ee] text-xs font-extrabold p-2 text-left pl-2 text-primary uppercase">
            Turno
          </div>
          {days.map((date, i) => {
            const dayNum = i + 1;
            const displayDate = date ? formatDate(date) : "-";
            return (
              <div
                key={i}
                className="bg-[#dce3ee] text-xs font-extrabold p-1.5 text-center text-text-secondary uppercase"
                title={displayDate}
              >
                {dayNum}
              </div>
            );
          })}

          {/* Data Rows */}
          {turns.map((turn) => (
            <>
              <div
                key={`label-${turn}`}
                className="bg-[#e4eaf4] flex items-center justify-center font-extrabold text-sm text-primary tracking-wide"
              >
                {turn.replace("Ronda ", "R")}
              </div>
              {days.map((date, i) => {
                const dayNum = i + 1;
                if (!date) {
                  return (
                    <div key={`${turn}-${i}`} className="bg-white h-[46px] flex items-center justify-center text-text-neutral text-sm">
                      ·
                    </div>
                  );
                }
                const value = matrix[turn]?.[date] ?? null;
                return (
                  <div
                    key={`${turn}-${i}`}
                    className={`bg-white h-[46px] flex items-center justify-center text-sm font-bold hover:bg-[#d5dcea] transition-colors ${cellStatusClass(value)}`}
                    title={`Día ${dayNum} · ${formatDate(date)}${value !== null ? ` · ${value}%` : ""}`}
                  >
                    {value !== null ? `${value}%` : "·"}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

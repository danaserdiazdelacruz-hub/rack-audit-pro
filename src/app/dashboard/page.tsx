"use client";

import { useEffect } from "react";
import { useAuditStore } from "@/store/auditStore";
import { useDashboard } from "@/hooks/useDashboard";
import { AuditMode, AREA_COLORS, AREA_LABELS } from "@/lib/types";
import { cn, getStatusTextClass } from "@/lib/utils";
import KPICard from "@/components/dashboard/KPICard";
import DayCard from "@/components/dashboard/DayCard";
import HistoryMatrix from "@/components/dashboard/HistoryMatrix";

export default function DashboardPage() {
  const { dashboardMode, setDashboardMode, loadData } = useAuditStore();
  const { kpis, complianceStatus, panoramicData, matrixData, thresholds } = useDashboard();

  useEffect(() => { loadData(); }, [loadData]);

  const modes: AuditMode[] = ["pasillo", "ubicacion", "producto"];
  const borderColor = AREA_COLORS[dashboardMode];

  return (
    <div className="animate-fadeIn">
      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-2 rounded-custom shadow-card border border-border-custom overflow-x-auto max-md:gap-1">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setDashboardMode(mode)}
            className={cn(
              "flex-1 py-3.5 border-none font-bold text-[0.95rem] rounded uppercase tracking-wide cursor-pointer transition-all whitespace-nowrap",
              dashboardMode === mode
                ? "text-white"
                : "bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary"
            )}
            style={dashboardMode === mode ? { backgroundColor: AREA_COLORS[mode] } : {}}
          >
            {AREA_LABELS[mode]}
          </button>
        ))}
      </div>

      {/* Section Label */}
      <div className="text-xs font-bold text-text-secondary uppercase mb-2 tracking-wider">
        Resumen de Auditoría — Últimas 72 Horas
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Auditorías" value={kpis.evaluations} status={kpis.evaluations === 0 ? "empty" : undefined} borderColor={borderColor} />
        <KPICard label="Desviaciones" value={kpis.deviations} status={complianceStatus} borderColor={borderColor} />
        <KPICard label="Cumplimiento" value={`${kpis.compliance}%`} status={complianceStatus} borderColor={borderColor} />
        <KPICard label="Ronda Crítica" value={kpis.criticalTurn} status={kpis.evaluations === 0 ? "empty" : undefined} borderColor={borderColor} />
      </div>

      {/* Panoramic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {panoramicData.map((day) => (
          <DayCard key={day.date} label={day.label} date={day.date} rounds={day.rounds} />
        ))}
      </div>

      {/* History Matrix */}
      <HistoryMatrix
        days={matrixData.days}
        turns={matrixData.turns}
        matrix={matrixData.matrix}
        thresholds={thresholds}
      />
    </div>
  );
}

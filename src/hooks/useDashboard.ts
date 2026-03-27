"use client";

import { useMemo } from "react";
import { useAuditStore } from "@/store/auditStore";
import { Evaluation, KPIData, StatusLevel, TurnOption } from "@/lib/types";
import { getLocalYYYYMMDD, getStatus } from "@/lib/utils";

export function useDashboard() {
  const { evaluations, dashboardMode, config } = useAuditStore();
  const thresholds = config.umbrales;

  const modeEvaluations = useMemo(
    () => evaluations.filter((e) => e.modo === dashboardMode),
    [evaluations, dashboardMode]
  );

  const today = useMemo(() => getLocalYYYYMMDD(new Date()), []);
  const yesterday = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return getLocalYYYYMMDD(d);
  }, []);
  const twoDaysAgo = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 2);
    return getLocalYYYYMMDD(d);
  }, []);

  const last72h = useMemo(
    () => modeEvaluations.filter(
      (e) => e.fecha === today || e.fecha === yesterday || e.fecha === twoDaysAgo
    ),
    [modeEvaluations, today, yesterday, twoDaysAgo]
  );

  const kpis: KPIData = useMemo(() => {
    let deviations = 0;
    let maxPoints = 0;
    let totalPoints = 0;
    const turnFails: Record<string, number> = { "Ronda 1": 0, "Ronda 2": 0, "Ronda 3": 0 };

    last72h.forEach((ev) => {
      maxPoints += ev.respuestas.length * 2;
      totalPoints += ev.puntaje;
      ev.respuestas.forEach((a) => {
        if (a !== null && a < 2) {
          deviations++;
          if (ev.turno) turnFails[ev.turno] = (turnFails[ev.turno] || 0) + 1;
        }
      });
    });

    const compliance = maxPoints > 0 ? Math.round(totalPoints / maxPoints * 100) : 0;
    let criticalTurn = "-";
    let maxFails = 0;
    Object.entries(turnFails).forEach(([turn, fails]) => {
      if (fails > maxFails) { maxFails = fails; criticalTurn = turn; }
    });

    return { evaluations: last72h.length, deviations, compliance, criticalTurn };
  }, [last72h]);

  const complianceStatus: StatusLevel = useMemo(() => {
    if (kpis.evaluations === 0) return "empty";
    return getStatus(kpis.compliance, thresholds);
  }, [kpis, thresholds]);

  const panoramicData = useMemo(() => {
    const dates = [
      { label: "HOY", date: today },
      { label: "AYER", date: yesterday },
      { label: "ANTEAYER", date: twoDaysAgo },
    ];
    return dates.map(({ label, date }) => {
      const dayEvals = modeEvaluations.filter((e) => e.fecha === date);
      const getRoundData = (turn: TurnOption) => {
        const turnEvals = dayEvals.filter((e) => e.turno === turn);
        if (!turnEvals.length) return { val: 0, color: "var(--color-danger)" };
        const avg = Math.round(
          turnEvals.reduce((s, e) => s + e.porcentaje, 0) / turnEvals.length
        );
        let color = "var(--color-danger)";
        if (avg >= thresholds.warning) color = "var(--color-success)";
        else if (avg >= thresholds.danger) color = "var(--color-warning)";
        return { val: avg, color };
      };
      return {
        label,
        date,
        rounds: (["Ronda 1", "Ronda 2", "Ronda 3"] as TurnOption[]).map((t) => ({
          name: t,
          ...getRoundData(t),
        })),
      };
    });
  }, [modeEvaluations, today, yesterday, twoDaysAgo, thresholds]);

  // 30-day matrix
  const matrixData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const days: (string | null)[] = [];
    for (let i = 1; i <= 30; i++) {
      const d = new Date(year, month, i);
      days.push(d.getMonth() === month ? getLocalYYYYMMDD(d) : null);
    }

    const turns: TurnOption[] = ["Ronda 1", "Ronda 2", "Ronda 3"];
    const matrix: Record<string, Record<string, number | null>> = {};
    turns.forEach((turn) => {
      matrix[turn] = {};
      days.forEach((date) => {
        if (!date) return;
        const dayTurnEvals = modeEvaluations.filter(
          (e) => e.fecha === date && e.turno === turn
        );
        matrix[turn][date] = dayTurnEvals.length
          ? Math.round(dayTurnEvals.reduce((s, e) => s + e.porcentaje, 0) / dayTurnEvals.length)
          : null;
      });
    });

    return { days, turns, matrix };
  }, [modeEvaluations]);

  return {
    modeEvaluations,
    kpis,
    complianceStatus,
    panoramicData,
    matrixData,
    thresholds,
    today,
  };
}

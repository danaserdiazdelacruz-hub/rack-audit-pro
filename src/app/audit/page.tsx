"use client";

import { useEffect, useCallback } from "react";
import { useAuditStore } from "@/store/auditStore";
import { useAudit } from "@/hooks/useAudit";
import { AuditMode, TurnOption, AnswerValue, AREA_CODES, AREA_LABELS, AREA_COLORS } from "@/lib/types";
import { cn, getStatus } from "@/lib/utils";
import { TURNS, MAX_AISLES } from "@/lib/constants";
import { showToast } from "@/components/ui/Toast";

export default function AuditPage() {
  const { loadData } = useAuditStore();
  const audit = useAudit();

  useEffect(() => { loadData(); }, [loadData]);

  const handleModeSelect = (mode: AuditMode) => {
    audit.setSelectedMode(mode);
    audit.setSelectedTurn(null);
    audit.setSelectedPasilloNum(null);
    setTimeout(() => audit.nextStep(), 200);
  };

  const handleTurnSelect = (turn: TurnOption) => {
    audit.setSelectedTurn(turn);
  };

  const handlePasilloSelect = (num: number) => {
    audit.setSelectedPasilloNum(num);
  };

  useEffect(() => {
    if (audit.selectedTurn && audit.selectedPasilloNum) {
      if (audit.checkDuplicate()) {
        showToast(`Ya existe auditoría para ${audit.selectedMode?.toUpperCase()} P${String(audit.selectedPasilloNum).padStart(2, "0")} ${audit.selectedTurn} hoy.`, "error");
        return;
      }
      audit.initChecklist();
      setTimeout(() => audit.nextStep(), 200);
    }
  }, [audit.selectedTurn, audit.selectedPasilloNum]);

  const handleAnswer = (index: number, value: AnswerValue) => {
    audit.setAnswer(index, value);
  };

  const handleGoToSummary = () => {
    if (!audit.allAnswered) return;
    audit.nextStep();
  };

  const handleSave = () => {
    const result = audit.saveEvaluation();
    showToast(result.message, result.success ? "success" : "error");
  };

  const thresholds = useAuditStore((s) => s.config.umbrales);
  const steps = [
    { num: 1, label: "Área" },
    { num: 2, label: "Ronda" },
    { num: 3, label: "Checklist" },
    { num: 4, label: "Resumen" },
  ];

  const progressPercent = audit.answers.length > 0
    ? Math.round(audit.answeredCount / audit.answers.length * 100)
    : 0;

  const barColor = audit.percentage >= thresholds.warning
    ? "var(--color-success)"
    : audit.percentage >= thresholds.danger
      ? "var(--color-warning)"
      : "var(--color-danger)";

  return (
    <div className="max-w-[900px] mx-auto animate-fadeIn">
      {/* Wizard Steps Indicator */}
      <div className="flex justify-between relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border-custom z-0" />
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col items-center gap-2 relative z-10 bg-surface px-4">
            <div
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm",
                audit.currentStep === step.num && "bg-accent border-accent text-white",
                audit.currentStep > step.num && "bg-success border-success text-white",
                audit.currentStep < step.num && "bg-white border-border-custom text-text-secondary"
              )}
            >
              {audit.currentStep > step.num ? "✓" : step.num}
            </div>
            <span className="text-xs font-semibold text-text-secondary uppercase">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Wizard Content */}
      <div className="bg-white rounded-custom-lg p-8 shadow-card border border-border-custom max-sm:p-5">
        {/* STEP 1: Select Area */}
        {audit.currentStep === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-1 text-primary uppercase">Selecciona Área</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {(["pasillo", "ubicacion", "producto"] as AuditMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeSelect(mode)}
                  className={cn(
                    "border-2 rounded-custom p-6 text-center cursor-pointer transition-all bg-white shadow-sm relative hover:-translate-y-0.5",
                    audit.selectedMode === mode
                      ? "border-accent bg-accent/5"
                      : "border-gray-400 hover:border-primary"
                  )}
                  style={audit.selectedMode === mode ? { borderColor: AREA_COLORS[mode] } : {}}
                >
                  <div
                    className="w-16 h-16 border-2 rounded-lg flex items-center justify-center mx-auto mb-4 text-lg font-extrabold tracking-wide"
                    style={{ borderColor: AREA_COLORS[mode], color: AREA_COLORS[mode] }}
                  >
                    {AREA_CODES[mode]}
                  </div>
                  <div className="font-bold text-base">{AREA_LABELS[mode]}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Select Turn & Aisle */}
        {audit.currentStep === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-1 text-primary uppercase">Selecciona Ronda</h2>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {TURNS.map((turn, i) => (
                <button
                  key={turn}
                  onClick={() => handleTurnSelect(turn)}
                  className={cn(
                    "border-2 rounded-custom p-6 text-center cursor-pointer transition-all bg-white shadow-sm relative",
                    audit.selectedTurn === turn ? "border-accent bg-accent/5" : "border-gray-400 hover:border-primary"
                  )}
                >
                  <div className="w-16 h-16 border-2 border-border-custom rounded-lg flex items-center justify-center mx-auto mb-4 text-lg font-extrabold text-primary">
                    R{i + 1}
                  </div>
                  <div className="font-bold">RONDA {i + 1}</div>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
                Pasillo a auditar <span className="text-danger">*</span>
              </label>
              <select
                className="px-3 py-2.5 border border-border-custom rounded-custom text-sm bg-white max-w-[220px] w-full focus:outline-none focus:border-accent focus:ring-2 focus:ring-blue-200"
                value={audit.selectedPasilloNum ?? ""}
                onChange={(e) => handlePasilloSelect(e.target.value ? parseInt(e.target.value) : 0)}
              >
                <option value="">— Seleccionar pasillo —</option>
                {Array.from({ length: MAX_AISLES }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>Pasillo {String(n).padStart(2, "0")}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={audit.prevStep} className="px-5 py-2.5 border border-border-custom rounded-custom font-semibold text-sm bg-surface hover:bg-gray-200 transition-all uppercase">
                Anterior
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Checklist */}
        {audit.currentStep === 3 && (
          <div className="animate-fadeIn">
            {/* Sticky Progress */}
            <div className="sticky top-16 bg-white p-5 -mx-8 -mt-8 mb-8 border-b border-border-custom z-50 max-sm:-mx-5 max-sm:-mt-5">
              <div className="flex justify-between items-center mb-3 text-sm font-semibold uppercase">
                <span>Progreso de Auditoría</span>
                <div className="flex gap-4 text-xs">
                  <span>{audit.answeredCount}/{audit.answers.length} completadas</span>
                  <span>Puntaje: {audit.score}/{audit.maxScore}</span>
                  <span className="font-bold text-accent">{audit.percentage}%</span>
                </div>
              </div>
              <div className="h-2 bg-border-custom rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-6 uppercase">
              {audit.selectedMode ? AREA_LABELS[audit.selectedMode] : ""}
              {audit.selectedPasilloNum ? ` — P${String(audit.selectedPasilloNum).padStart(2, "0")}` : ""}
              {` — ${audit.selectedTurn}`}
            </h3>

            {/* Questions */}
            <div className="space-y-4">
              {audit.activeQuestions.map((question, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "bg-white rounded-custom p-5 border border-border-custom",
                    audit.answers[idx] !== null && "border-l-4 border-l-accent"
                  )}
                >
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-7 h-7 bg-primary text-white rounded flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="font-medium flex-1 leading-relaxed">{question}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                    {([
                      { value: 2 as AnswerValue, label: "CUMPLE", selClass: "bg-success border-success text-white" },
                      { value: 1 as AnswerValue, label: "PARCIAL", selClass: "bg-warning border-warning text-white" },
                      { value: 0 as AnswerValue, label: "NO CUMPLE", selClass: "bg-danger border-danger text-white" },
                    ]).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(idx, opt.value)}
                        className={cn(
                          "p-4 border-2 rounded-custom cursor-pointer transition-all flex flex-col items-center gap-1 text-sm font-semibold",
                          audit.answers[idx] === opt.value
                            ? `${opt.selClass} scale-[1.02] animate-select-pulse shadow-lg`
                            : "border-gray-400 bg-white hover:border-primary hover:bg-gray-50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={audit.prevStep} className="px-5 py-2.5 border border-border-custom rounded-custom font-semibold text-sm bg-surface hover:bg-gray-200 transition-all uppercase">
                Anterior
              </button>
              <button
                onClick={handleGoToSummary}
                disabled={!audit.allAnswered}
                className="px-5 py-2.5 bg-accent text-white rounded-custom font-semibold text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
              >
                Resumen
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Summary */}
        {audit.currentStep === 4 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-1 text-primary uppercase">Resumen de Auditoría</h2>

            <div className="grid grid-cols-2 gap-4 my-6 max-sm:grid-cols-1">
              {[
                { label: "Fecha", value: new Date().toLocaleDateString("es-ES") },
                { label: "Área", value: audit.selectedMode ? AREA_LABELS[audit.selectedMode] : "-" },
                { label: "Pasillo", value: audit.selectedPasilloNum ? `P${String(audit.selectedPasilloNum).padStart(2, "0")}` : "-" },
                { label: "Ronda", value: audit.selectedTurn || "-" },
                { label: "Puntaje", value: `${audit.score}/${audit.maxScore}` },
              ].map((item) => (
                <div key={item.label} className="bg-surface p-4 rounded-custom border border-border-custom">
                  <div className="text-xs font-semibold uppercase text-text-secondary mb-1">{item.label}</div>
                  <div className="text-lg font-bold text-primary">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-surface p-6 rounded-custom border border-border-custom">
              <div className="flex justify-between items-center">
                <span className="font-semibold uppercase">Resultado de Auditoría</span>
                <span
                  className={cn(
                    "text-4xl font-extrabold",
                    audit.percentage >= thresholds.warning ? "text-success" :
                    audit.percentage >= thresholds.danger ? "text-warning" : "text-danger"
                  )}
                >
                  {audit.percentage}%
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <button onClick={audit.prevStep} className="px-5 py-2.5 border border-border-custom rounded-custom font-semibold text-sm bg-surface hover:bg-gray-200 transition-all uppercase">
                Corregir
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3.5 bg-success text-white rounded-custom font-semibold text-base uppercase hover:bg-green-700 transition-all"
              >
                Guardar Auditoría
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

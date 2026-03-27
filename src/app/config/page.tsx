"use client";

import { useEffect, useState } from "react";
import { useAuditStore } from "@/store/auditStore";
import { AuditMode, AREA_LABELS } from "@/lib/types";
import { MODES } from "@/lib/constants";
import { showToast } from "@/components/ui/Toast";

export default function ConfigPage() {
  const { config, loadData, setQuestions, setThresholds, setActiveCount, resetQuestionsToDefault, saveConfig } = useAuditStore();
  const [selectedArea, setSelectedArea] = useState<AuditMode>("pasillo");
  const [localQuestions, setLocalQuestions] = useState<string[]>([]);
  const [warnThreshold, setWarnThreshold] = useState(config.umbrales.warning);
  const [dangerThreshold, setDangerThreshold] = useState(config.umbrales.danger);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    setLocalQuestions([...config.preguntas[selectedArea]]);
    setWarnThreshold(config.umbrales.warning);
    setDangerThreshold(config.umbrales.danger);
  }, [config, selectedArea]);

  const activeCount = config.activeCount[selectedArea] || 5;

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...localQuestions];
    updated[index] = value;
    setLocalQuestions(updated);
  };

  const handleAddQuestion = () => {
    if (localQuestions.length >= 10) {
      showToast("Máximo 10 preguntas por categoría", "warning");
      return;
    }
    setLocalQuestions([...localQuestions, "Nueva pregunta — edita el texto"]);
  };

  const handleDeleteQuestion = (index: number) => {
    if (localQuestions.length <= 5) {
      showToast("Mínimo 5 preguntas por categoría", "warning");
      return;
    }
    if (!confirm("¿Eliminar esta pregunta de la categoría?")) return;
    const updated = localQuestions.filter((_, i) => i !== index);
    setLocalQuestions(updated);
  };

  const handleMoveQuestion = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= localQuestions.length) return;
    const updated = [...localQuestions];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setLocalQuestions(updated);
  };

  const handleSave = () => {
    if (warnThreshold <= dangerThreshold) {
      showToast("El nivel aceptable debe ser mayor al nivel crítico", "error");
      return;
    }
    const newQuestions = { ...config.preguntas, [selectedArea]: localQuestions };
    setQuestions(newQuestions);
    setThresholds({ warning: warnThreshold, danger: dangerThreshold });
    saveConfig();
    showToast("Configuración guardada correctamente", "success");
  };

  const handleReset = () => {
    if (!confirm("¿Restaurar todos los criterios a los valores por defecto?")) return;
    resetQuestionsToDefault();
    showToast("Criterios restaurados correctamente", "success");
  };

  return (
    <div className="animate-fadeIn">
      {/* Questions Config */}
      <div className="bg-white rounded-custom-lg p-6 shadow-card border border-border-custom mb-6">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-border-custom">
          <h3 className="text-lg font-semibold text-primary uppercase">Criterios de Auditoría</h3>
          <button onClick={handleAddQuestion} className="px-4 py-2 bg-accent text-white rounded-custom font-semibold text-sm uppercase hover:bg-blue-700 transition-all">
            + Añadir
          </button>
        </div>

        <div className="flex gap-4 items-end flex-wrap mb-4">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Área</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value as AuditMode)}
              className="w-full px-3 py-2.5 border border-border-custom rounded-custom text-sm bg-white focus:outline-none focus:border-accent"
            >
              {MODES.map((m) => (
                <option key={m} value={m}>{AREA_LABELS[m]}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Preguntas activas (5–10)</label>
            <select
              value={activeCount}
              onChange={(e) => setActiveCount(selectedArea, parseInt(e.target.value))}
              className="w-full px-3 py-2.5 border border-border-custom rounded-custom text-sm bg-white focus:outline-none focus:border-accent"
            >
              {[5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n} preguntas</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-text-secondary mb-4 p-3 bg-surface rounded-custom border-l-4 border-l-accent">
          Las primeras <strong>{activeCount}</strong> preguntas están activas en el checklist. Las restantes {localQuestions.length - activeCount > 0 ? localQuestions.length - activeCount : 0} están inactivas.
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {localQuestions.map((q, idx) => {
            const isActive = idx < activeCount;
            return (
              <div key={idx} className={`bg-white rounded-custom p-4 border border-border-custom ${!isActive ? "opacity-60" : ""}`}>
                <div className="flex gap-3 items-start mb-2">
                  <span className="text-sm font-bold text-text-secondary">{idx + 1}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-success/15 text-success border border-success/30" : "bg-gray-100 text-text-neutral border border-border-custom"}`}>
                    {isActive ? "ACTIVA" : "INACTIVA"}
                  </span>
                </div>
                <textarea
                  value={q}
                  onChange={(e) => handleQuestionChange(idx, e.target.value)}
                  className="w-full border border-border-custom rounded-custom p-2.5 text-sm resize-none min-h-[60px] focus:outline-none focus:border-accent"
                  rows={2}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => handleMoveQuestion(idx, -1)}
                    disabled={idx === 0}
                    className="px-3 py-1.5 border border-border-custom rounded text-sm font-semibold bg-surface hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >↑</button>
                  <button
                    onClick={() => handleMoveQuestion(idx, 1)}
                    disabled={idx === localQuestions.length - 1}
                    className="px-3 py-1.5 border border-border-custom rounded text-sm font-semibold bg-surface hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >↓</button>
                  <button
                    onClick={() => handleDeleteQuestion(idx)}
                    className="px-3 py-1.5 border border-danger/30 rounded text-sm font-semibold text-danger bg-danger/5 hover:bg-danger/15"
                  >✕</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={handleReset} className="px-5 py-2.5 bg-danger text-white rounded-custom font-semibold text-sm uppercase hover:bg-red-700 transition-all">
            Restaurar Default
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 bg-accent text-white rounded-custom font-semibold text-sm uppercase hover:bg-blue-700 transition-all">
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Thresholds */}
      <div className="bg-white rounded-custom-lg p-6 shadow-card border border-border-custom">
        <div className="mb-5 pb-4 border-b border-border-custom">
          <h3 className="text-lg font-semibold text-primary uppercase">Parámetros de Rendimiento</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Nivel Aceptable (%)</label>
            <input
              type="number"
              value={warnThreshold}
              onChange={(e) => setWarnThreshold(parseInt(e.target.value) || 0)}
              min={0} max={100}
              className="w-full px-3 py-2.5 border border-border-custom rounded-custom text-sm bg-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Nivel Crítico (%)</label>
            <input
              type="number"
              value={dangerThreshold}
              onChange={(e) => setDangerThreshold(parseInt(e.target.value) || 0)}
              min={0} max={100}
              className="w-full px-3 py-2.5 border border-border-custom rounded-custom text-sm bg-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

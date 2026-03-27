"use client";

import { useCallback, useMemo } from "react";
import { useAuditStore } from "@/store/auditStore";
import { AnswerValue, AuditMode, TurnOption, Evaluation } from "@/lib/types";
import { calculateScore, calculateMaxScore, calculatePercentage, generateId, getLocalYYYYMMDD } from "@/lib/utils";

export function useAudit() {
  const store = useAuditStore();
  const { config, evaluations, selectedMode, selectedTurn, selectedPasilloNum, answers, currentStep } = store;

  const activeQuestions = useMemo(() => {
    if (!selectedMode) return [];
    const allQ = config.preguntas[selectedMode];
    const count = config.activeCount[selectedMode] || 5;
    return allQ.slice(0, count);
  }, [selectedMode, config]);

  const score = useMemo(() => calculateScore(answers), [answers]);
  const maxScore = useMemo(() => calculateMaxScore(answers), [answers]);
  const percentage = useMemo(() => calculatePercentage(answers), [answers]);
  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const allAnswered = useMemo(() => answers.length > 0 && answers.every((a) => a !== null), [answers]);

  const checkDuplicate = useCallback((): boolean => {
    if (!selectedMode || !selectedTurn || !selectedPasilloNum) return false;
    const todayStr = getLocalYYYYMMDD(new Date());
    return evaluations.some(
      (e) =>
        e.modo === selectedMode &&
        e.turno === selectedTurn &&
        parseInt(String(e.pasillo_num)) === selectedPasilloNum &&
        e.fecha === todayStr
    );
  }, [evaluations, selectedMode, selectedTurn, selectedPasilloNum]);

  const initChecklist = useCallback(() => {
    store.setAnswers(new Array(activeQuestions.length).fill(null));
  }, [activeQuestions.length, store]);

  const saveEvaluation = useCallback((): { success: boolean; message: string } => {
    if (!selectedMode || !selectedTurn || !selectedPasilloNum) {
      return { success: false, message: "Faltan campos obligatorios. Verifica los pasos anteriores." };
    }
    if (answers.some((a) => a === null)) {
      return { success: false, message: "Todas las preguntas deben ser respondidas antes de guardar." };
    }
    if (checkDuplicate()) {
      return { success: false, message: "Esta combinación ya fue auditada hoy. No se permite duplicar." };
    }

    const evaluation: Evaluation = {
      id: generateId(),
      fecha: getLocalYYYYMMDD(new Date()),
      timestamp: Date.now(),
      modo: selectedMode,
      turno: selectedTurn,
      pasillo_num: selectedPasilloNum,
      respuestas: [...answers] as AnswerValue[],
      puntaje: score,
      porcentaje: percentage,
    };

    store.addEvaluation(evaluation);
    store.resetWizard();
    return { success: true, message: "Auditoría guardada correctamente" };
  }, [selectedMode, selectedTurn, selectedPasilloNum, answers, score, percentage, checkDuplicate, store]);

  return {
    currentStep,
    selectedMode,
    selectedTurn,
    selectedPasilloNum,
    answers,
    activeQuestions,
    score,
    maxScore,
    percentage,
    answeredCount,
    allAnswered,
    checkDuplicate,
    initChecklist,
    saveEvaluation,
    setAnswer: store.setAnswer,
    setSelectedMode: store.setSelectedMode,
    setSelectedTurn: store.setSelectedTurn,
    setSelectedPasilloNum: store.setSelectedPasilloNum,
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    resetWizard: store.resetWizard,
    setCurrentStep: store.setCurrentStep,
  };
}

"use client";

import { create } from "zustand";
import {
  Evaluation, AuditMode, TurnOption, AnswerValue,
  AppConfig, Thresholds, ActiveCounts, QuestionsConfig,
  DataTableState,
} from "@/lib/types";
import {
  DEFAULT_QUESTIONS, DEFAULT_ACTIVE_COUNT, DEFAULT_THRESHOLDS,
} from "@/lib/constants";

interface AuditStore {
  // Data
  evaluations: Evaluation[];
  config: AppConfig;

  // Wizard
  currentStep: number;
  selectedMode: AuditMode | null;
  selectedTurn: TurnOption | null;
  selectedPasilloNum: number | null;
  answers: AnswerValue[];

  // Dashboard
  dashboardMode: AuditMode;

  // Data table
  dataTable: DataTableState;

  // Planogram
  planogramCurrentP: number | null;

  // Actions - Data
  loadData: () => void;
  saveData: () => void;
  addEvaluation: (evaluation: Evaluation) => void;
  deleteEvaluation: (id: string) => void;
  deleteSelected: () => void;
  deleteAll: () => void;
  deleteByDateRange: (start: string, end: string) => number;
  deleteByProcess: (mode: AuditMode) => number;
  deleteLastEvaluation: () => void;

  // Actions - Config
  setQuestions: (questions: QuestionsConfig) => void;
  setThresholds: (thresholds: Thresholds) => void;
  setActiveCount: (mode: AuditMode, count: number) => void;
  resetQuestionsToDefault: () => void;
  saveConfig: () => void;

  // Actions - Wizard
  setCurrentStep: (step: number) => void;
  setSelectedMode: (mode: AuditMode | null) => void;
  setSelectedTurn: (turn: TurnOption | null) => void;
  setSelectedPasilloNum: (num: number | null) => void;
  setAnswer: (index: number, value: AnswerValue) => void;
  setAnswers: (answers: AnswerValue[]) => void;
  resetWizard: () => void;
  nextStep: () => void;
  prevStep: () => void;

  // Actions - Dashboard
  setDashboardMode: (mode: AuditMode) => void;

  // Actions - Data Table
  setDataTablePage: (page: number) => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Actions - Planogram
  setPlanogramCurrentP: (p: number | null) => void;

  // Actions - Import
  importData: (data: {
    evaluations?: Evaluation[];
    questions?: QuestionsConfig;
    thresholds?: Thresholds;
    activeCount?: ActiveCounts;
  }) => { imported: number; duplicates: number; invalid: number };
}

export const useAuditStore = create<AuditStore>((set, get) => ({
  evaluations: [],
  config: {
    preguntas: JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)),
    umbrales: { ...DEFAULT_THRESHOLDS },
    activeCount: { ...DEFAULT_ACTIVE_COUNT },
  },

  currentStep: 1,
  selectedMode: null,
  selectedTurn: null,
  selectedPasilloNum: null,
  answers: [],

  dashboardMode: "pasillo",

  dataTable: { page: 1, perPage: 10, selected: new Set() },

  planogramCurrentP: null,

  // ─── Data Actions ───
  loadData: () => {
    try {
      const evals = localStorage.getItem("inv_evaluations");
      if (evals) set({ evaluations: JSON.parse(evals) });

      const questions = localStorage.getItem("inv_questions_config");
      const thresholds = localStorage.getItem("inv_thresholds");
      const activeCount = localStorage.getItem("inv_activecount");

      set((state) => ({
        config: {
          preguntas: questions ? JSON.parse(questions) : state.config.preguntas,
          umbrales: thresholds ? JSON.parse(thresholds) : state.config.umbrales,
          activeCount: activeCount ? JSON.parse(activeCount) : state.config.activeCount,
        },
      }));
    } catch (e) {
      console.error("Error loading data:", e);
    }
  },

  saveData: () => {
    localStorage.setItem("inv_evaluations", JSON.stringify(get().evaluations));
  },

  addEvaluation: (evaluation) => {
    set((state) => ({ evaluations: [...state.evaluations, evaluation] }));
    get().saveData();
  },

  deleteEvaluation: (id) => {
    set((state) => ({
      evaluations: state.evaluations.filter((e) => e.id !== id),
    }));
    get().saveData();
  },

  deleteSelected: () => {
    const selected = get().dataTable.selected;
    set((state) => ({
      evaluations: state.evaluations.filter((e) => !selected.has(e.id)),
      dataTable: { ...state.dataTable, selected: new Set() },
    }));
    get().saveData();
  },

  deleteAll: () => {
    set({ evaluations: [] });
    get().saveData();
  },

  deleteByDateRange: (start, end) => {
    const before = get().evaluations.length;
    set((state) => ({
      evaluations: state.evaluations.filter(
        (e) => e.fecha < start || e.fecha > end
      ),
    }));
    get().saveData();
    return before - get().evaluations.length;
  },

  deleteByProcess: (mode) => {
    const before = get().evaluations.length;
    set((state) => ({
      evaluations: state.evaluations.filter((e) => e.modo !== mode),
    }));
    get().saveData();
    return before - get().evaluations.length;
  },

  deleteLastEvaluation: () => {
    const sorted = [...get().evaluations].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    if (sorted.length > 0) {
      sorted.pop();
      set({ evaluations: sorted });
      get().saveData();
    }
  },

  // ─── Config Actions ───
  setQuestions: (questions) => {
    set((state) => ({
      config: { ...state.config, preguntas: questions },
    }));
    localStorage.setItem("inv_questions_config", JSON.stringify(questions));
  },

  setThresholds: (thresholds) => {
    set((state) => ({
      config: { ...state.config, umbrales: thresholds },
    }));
    localStorage.setItem("inv_thresholds", JSON.stringify(thresholds));
  },

  setActiveCount: (mode, count) => {
    set((state) => ({
      config: {
        ...state.config,
        activeCount: { ...state.config.activeCount, [mode]: count },
      },
    }));
    localStorage.setItem(
      "inv_activecount",
      JSON.stringify(get().config.activeCount)
    );
  },

  resetQuestionsToDefault: () => {
    const newQuestions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    const newActiveCount = { ...DEFAULT_ACTIVE_COUNT };
    set((state) => ({
      config: {
        ...state.config,
        preguntas: newQuestions,
        activeCount: newActiveCount,
      },
    }));
    localStorage.setItem("inv_questions_config", JSON.stringify(newQuestions));
    localStorage.setItem("inv_activecount", JSON.stringify(newActiveCount));
  },

  saveConfig: () => {
    const { config } = get();
    localStorage.setItem("inv_questions_config", JSON.stringify(config.preguntas));
    localStorage.setItem("inv_thresholds", JSON.stringify(config.umbrales));
    localStorage.setItem("inv_activecount", JSON.stringify(config.activeCount));
  },

  // ─── Wizard Actions ───
  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedMode: (mode) => set({ selectedMode: mode }),
  setSelectedTurn: (turn) => set({ selectedTurn: turn }),
  setSelectedPasilloNum: (num) => set({ selectedPasilloNum: num }),

  setAnswer: (index, value) => {
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[index] = value;
      return { answers: newAnswers };
    });
  },

  setAnswers: (answers) => set({ answers }),

  resetWizard: () =>
    set({
      currentStep: 1,
      selectedMode: null,
      selectedTurn: null,
      selectedPasilloNum: null,
      answers: [],
    }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  // ─── Dashboard Actions ───
  setDashboardMode: (mode) => set({ dashboardMode: mode }),

  // ─── Data Table Actions ───
  setDataTablePage: (page) =>
    set((state) => ({ dataTable: { ...state.dataTable, page } })),

  toggleSelection: (id) =>
    set((state) => {
      const newSelected = new Set(state.dataTable.selected);
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
      return { dataTable: { ...state.dataTable, selected: newSelected } };
    }),

  toggleSelectAll: (ids) =>
    set((state) => {
      const allSelected = ids.every((id) => state.dataTable.selected.has(id));
      const newSelected = new Set(state.dataTable.selected);
      ids.forEach((id) => {
        if (allSelected) newSelected.delete(id);
        else newSelected.add(id);
      });
      return { dataTable: { ...state.dataTable, selected: newSelected } };
    }),

  clearSelection: () =>
    set((state) => ({
      dataTable: { ...state.dataTable, selected: new Set() },
    })),

  // ─── Planogram Actions ───
  setPlanogramCurrentP: (p) => set({ planogramCurrentP: p }),

  // ─── Import Actions ───
  importData: (data) => {
    let imported = 0, duplicates = 0, invalid = 0;
    const requiredKeys = ["id", "fecha", "modo", "turno", "respuestas", "puntaje", "porcentaje"];
    const validModes = ["pasillo", "ubicacion", "producto"];
    const validTurns = ["Ronda 1", "Ronda 2", "Ronda 3"];
    const currentEvals = get().evaluations;

    if (data.evaluations && Array.isArray(data.evaluations)) {
      const newEvals: Evaluation[] = [];
      data.evaluations.forEach((ev) => {
        if (requiredKeys.some((k) => (ev as any)[k] === undefined)) { invalid++; return; }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(ev.fecha)) { invalid++; return; }
        if (!validModes.includes(ev.modo) || !validTurns.includes(ev.turno)) { invalid++; return; }
        if (currentEvals.some((e) => e.id === ev.id)) { duplicates++; return; }
        newEvals.push(ev);
        imported++;
      });
      set((state) => ({ evaluations: [...state.evaluations, ...newEvals] }));
    }

    if (data.questions) get().setQuestions(data.questions);
    if (data.thresholds?.warning) get().setThresholds(data.thresholds);
    if (data.activeCount) {
      set((state) => ({
        config: { ...state.config, activeCount: data.activeCount! },
      }));
      localStorage.setItem("inv_activecount", JSON.stringify(data.activeCount));
    }

    get().saveData();
    return { imported, duplicates, invalid };
  },
}));

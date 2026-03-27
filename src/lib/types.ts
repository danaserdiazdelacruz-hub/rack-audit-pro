// ═══════════════════════════════════════════════════════════
// RACK AUDIT PRO — Type Definitions
// ═══════════════════════════════════════════════════════════

export type AuditMode = "pasillo" | "ubicacion" | "producto";
export type TurnOption = "Ronda 1" | "Ronda 2" | "Ronda 3";
export type AnswerValue = 0 | 1 | 2 | null; // 0=No Cumple, 1=Parcial, 2=Cumple
export type StatusLevel = "ok" | "warning" | "danger" | "empty";
export type ToastType = "success" | "error" | "warning";

export interface Evaluation {
  id: string;
  fecha: string;          // YYYY-MM-DD
  timestamp: number;
  modo: AuditMode;
  turno: TurnOption;
  pasillo_num: number | null;
  respuestas: AnswerValue[];
  puntaje: number;
  porcentaje: number;
}

export interface Thresholds {
  warning: number;  // default 70
  danger: number;   // default 50
}

export interface ActiveCounts {
  pasillo: number;
  ubicacion: number;
  producto: number;
}

export interface QuestionsConfig {
  pasillo: string[];
  ubicacion: string[];
  producto: string[];
}

export interface AppConfig {
  preguntas: QuestionsConfig;
  umbrales: Thresholds;
  activeCount: ActiveCounts;
}

export interface KPIData {
  evaluations: number;
  deviations: number;
  compliance: number;
  criticalTurn: string;
}

export interface DayCardData {
  label: string;
  date: string;
  rounds: {
    name: TurnOption;
    val: number;
    color: string;
  }[];
}

export interface DataTableState {
  page: number;
  perPage: number;
  selected: Set<string>;
}

export interface WizardState {
  currentStep: number;
  selectedMode: AuditMode | null;
  selectedTurn: TurnOption | null;
  selectedPasilloNum: number | null;
  answers: AnswerValue[];
}

export interface MatrixCell {
  date: string | null;
  value: number | null;
  status: StatusLevel;
}

export const AREA_COLORS: Record<AuditMode, string> = {
  pasillo: "#92400e",
  ubicacion: "#1e40af",
  producto: "#7e22ce",
};

export const AREA_LABELS: Record<AuditMode, string> = {
  pasillo: "PASILLO",
  ubicacion: "UBICACIÓN",
  producto: "PRODUCTO",
};

export const AREA_CODES: Record<AuditMode, string> = {
  pasillo: "PSL",
  ubicacion: "UBK",
  producto: "SKU",
};

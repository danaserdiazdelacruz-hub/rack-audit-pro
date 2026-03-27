import { AnswerValue, StatusLevel, Thresholds, AuditMode, AREA_COLORS } from "./types";

export function calculateScore(answers: AnswerValue[]): number {
  return answers.reduce((sum, a) => sum + (a || 0), 0);
}

export function calculateMaxScore(answers: AnswerValue[]): number {
  return answers.length * 2;
}

export function calculatePercentage(answers: AnswerValue[]): number {
  const max = calculateMaxScore(answers);
  if (max === 0) return 0;
  return Math.round(calculateScore(answers) / max * 100);
}

export function getStatus(percentage: number, thresholds: Thresholds): StatusLevel {
  if (percentage >= thresholds.warning) return "ok";
  if (percentage >= thresholds.danger) return "warning";
  return "danger";
}

export function getStatusColor(status: StatusLevel): string {
  const colors: Record<StatusLevel, string> = {
    ok: "var(--color-success, #16a34a)",
    warning: "var(--color-warning, #ca8a04)",
    danger: "var(--color-danger, #dc2626)",
    empty: "var(--color-text-neutral, #94a3b8)",
  };
  return colors[status];
}

export function getStatusBadgeClasses(status: StatusLevel): string {
  const classes: Record<StatusLevel, string> = {
    ok: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
    empty: "bg-gray-100 text-text-neutral border border-gray-200",
  };
  return classes[status];
}

export function getStatusTextClass(status: StatusLevel): string {
  const classes: Record<StatusLevel, string> = {
    ok: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    empty: "text-text-neutral",
  };
  return classes[status];
}

export function getAreaColor(mode: AuditMode): string {
  return AREA_COLORS[mode];
}

export function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function getLocalYYYYMMDD(date: Date): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

export function generateId(): string {
  return `eval_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

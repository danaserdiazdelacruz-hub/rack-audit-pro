"use client";

import { StatusLevel } from "@/lib/types";
import { getStatusTextClass } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  status?: StatusLevel;
  borderColor?: string;
}

export default function KPICard({ label, value, status = "empty", borderColor }: KPICardProps) {
  const textClass = getStatusTextClass(status);
  const leftBorder = borderColor ? { borderLeftColor: borderColor } : {};

  return (
    <div
      className="bg-white border border-border-custom rounded-custom p-5 flex flex-col items-center justify-center text-center shadow-card border-l-4"
      style={leftBorder}
    >
      <div className="text-[0.75rem] text-text-secondary uppercase font-bold mb-1 tracking-wide">
        {label}
      </div>
      <div className={`text-4xl font-extrabold leading-none ${textClass}`}>
        {value}
      </div>
    </div>
  );
}

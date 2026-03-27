"use client";

import { useEffect, useState, useCallback } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
}

let addToastFn: ((message: string, type?: "success" | "error" | "warning") => void) | null = null;

export function showToast(message: string, type: "success" | "error" | "warning" = "success") {
  if (addToastFn) addToastFn(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error" | "warning" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  useEffect(() => { addToastFn = addToast; return () => { addToastFn = null; }; }, [addToast]);

  const borderColor = (type: string) => {
    if (type === "success") return "border-l-success";
    if (type === "error") return "border-l-danger";
    return "border-l-warning";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1001] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-enter bg-primary text-white px-5 py-4 rounded shadow-card-lg flex items-center gap-3 min-w-[300px] border-l-4 ${borderColor(t.type)} font-medium text-sm`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

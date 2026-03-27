"use client";

import { useEffect, useRef, useMemo } from "react";
import { useAuditStore } from "@/store/auditStore";
import { AREA_LABELS, Evaluation } from "@/lib/types";
import { getStatus, getStatusBadgeClasses, formatDate, cn } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";

export default function DataPage() {
  const store = useAuditStore();
  const { evaluations, config, dataTable, loadData } = store;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, [loadData]);

  const thresholds = config.umbrales;
  const totalPages = Math.ceil(evaluations.length / dataTable.perPage);

  const pageData = useMemo(() => {
    const sorted = [...evaluations].reverse();
    const start = (dataTable.page - 1) * dataTable.perPage;
    return sorted.slice(start, start + dataTable.perPage);
  }, [evaluations, dataTable.page, dataTable.perPage]);

  const handleExportJSON = () => {
    const payload = {
      version: "RAP_1.0",
      date: new Date().toISOString(),
      evaluations,
      questions: config.preguntas,
      thresholds: config.umbrales,
      activeCount: config.activeCount,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RackAudit_Backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup JSON exportado", "success");
  };

  const handleExportCSV = () => {
    if (!evaluations.length) { showToast("No hay datos para exportar", "warning"); return; }
    const headers = ["ID", "Fecha", "Área", "Pasillo", "Ronda", "Puntaje", "Porcentaje"];
    const rows = evaluations.map((e) => [
      e.id, e.fecha, AREA_LABELS[e.modo] || e.modo,
      e.pasillo_num ? `P${String(e.pasillo_num).padStart(2, "0")}` : "-",
      e.turno, e.puntaje, e.porcentaje,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RackAudit_Reporte_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exportado", "success");
  };

  const handleImport = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) { showToast("Selecciona un archivo JSON", "warning"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.evaluations || !Array.isArray(data.evaluations)) throw new Error("Formato inválido");
        const result = store.importData(data);
        let msg = `${result.imported} importados`;
        if (result.duplicates) msg += `, ${result.duplicates} duplicados`;
        if (result.invalid) msg += `, ${result.invalid} inválidos`;
        showToast(msg, result.imported > 0 ? "success" : "warning");
      } catch (e: any) {
        showToast("Error de importación: " + e.message, "error");
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteSelected = () => {
    if (dataTable.selected.size === 0) { showToast("Selecciona registros para eliminar", "warning"); return; }
    if (!confirm(`¿Eliminar ${dataTable.selected.size} registros seleccionados?`)) return;
    store.deleteSelected();
    showToast("Registros eliminados", "success");
  };

  const handleDeleteAll = () => {
    if (!confirm("¿VACIAR toda la base de datos?")) return;
    if (!confirm("CONFIRMACIÓN FINAL: ¿Estás seguro? Esta acción es irreversible.")) return;
    store.deleteAll();
    showToast("Base de datos reseteada", "success");
  };

  const getStatusForEval = (e: Evaluation) => getStatus(e.porcentaje, thresholds);

  return (
    <div className="animate-fadeIn">
      {/* Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Backup Completo", icon: "JSON", onClick: handleExportJSON },
          { label: "Exportar Excel", icon: "CSV", onClick: handleExportCSV },
          { label: "Importar Datos", icon: "IN", onClick: () => fileInputRef.current?.click() },
          { label: "Vaciar Base", icon: "DEL", onClick: handleDeleteAll, danger: true },
        ].map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="bg-white border border-border-custom rounded-custom p-5 text-center cursor-pointer transition-all hover:border-accent hover:shadow-card"
          >
            <div className={cn(
              "w-12 h-12 bg-surface rounded flex items-center justify-center mx-auto mb-3 text-sm font-extrabold border border-border-custom",
              action.danger ? "text-danger" : "text-primary"
            )}>
              {action.icon}
            </div>
            <div className="font-semibold text-sm">{action.label}</div>
          </button>
        ))}
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-300 border-l-4 border-l-warning rounded-custom p-4 mb-6 flex justify-between items-center gap-4">
        <div>
          <div className="font-bold text-sm text-accent uppercase mb-1">⚠ Datos almacenados solo en este navegador</div>
          <div className="text-xs text-amber-900 leading-relaxed">Exporta el backup <strong>JSON semanalmente</strong> y guárdalo en Drive o WhatsApp.</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-custom-lg p-6 shadow-card border border-border-custom">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-border-custom flex-wrap gap-2">
          <h3 className="text-lg font-semibold text-primary uppercase">Historial de Auditorías</h3>
          <div className="flex gap-2">
            <button onClick={() => store.setDataTablePage(1)} className="px-3 py-2 border border-border-custom rounded-custom text-sm font-semibold bg-surface hover:bg-gray-200 uppercase">
              Refrescar
            </button>
            <button onClick={handleDeleteSelected} className="px-3 py-2 bg-danger text-white rounded-custom text-sm font-semibold uppercase hover:bg-red-700">
              Eliminar Sel.
            </button>
          </div>
        </div>

        {evaluations.length === 0 ? (
          <div className="text-center py-12 text-text-neutral font-medium">
            No hay auditorías registradas
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-custom border border-border-custom">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="bg-surface p-3 text-left font-bold text-primary text-xs uppercase">
                      <input
                        type="checkbox"
                        onChange={() => store.toggleSelectAll(pageData.map((e) => e.id))}
                        checked={pageData.length > 0 && pageData.every((e) => dataTable.selected.has(e.id))}
                      />
                    </th>
                    <th className="bg-surface p-3 text-left font-bold text-primary text-xs uppercase">Fecha</th>
                    <th className="bg-surface p-3 text-left font-bold text-primary text-xs uppercase">Área</th>
                    <th className="bg-surface p-3 text-left font-bold text-primary text-xs uppercase">Pasillo</th>
                    <th className="bg-surface p-3 text-left font-bold text-primary text-xs uppercase">Ronda</th>
                    <th className="bg-surface p-3 text-left font-bold text-primary text-xs uppercase">Score</th>
                    <th className="bg-surface p-3 text-left font-bold text-primary text-xs uppercase">%</th>
                    <th className="bg-surface p-3 text-left font-bold text-primary text-xs uppercase">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((ev) => {
                    const status = getStatusForEval(ev);
                    const badgeClass = getStatusBadgeClasses(status);
                    return (
                      <tr key={ev.id} className="border-b border-border-custom hover:bg-gray-50">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={dataTable.selected.has(ev.id)}
                            onChange={() => store.toggleSelection(ev.id)}
                          />
                        </td>
                        <td className="p-3">{formatDate(ev.fecha)}</td>
                        <td className="p-3 font-semibold" style={{ color: ev.modo === "pasillo" ? "#92400e" : ev.modo === "ubicacion" ? "#1e40af" : "#7e22ce" }}>
                          {AREA_LABELS[ev.modo] || ev.modo}
                        </td>
                        <td className="p-3">{ev.pasillo_num ? `P${String(ev.pasillo_num).padStart(2, "0")}` : "-"}</td>
                        <td className="p-3">{ev.turno}</td>
                        <td className="p-3">{ev.puntaje}/{ev.respuestas.length * 2}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase ${badgeClass}`}>
                            {ev.porcentaje}%
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              if (confirm("¿Eliminar esta auditoría?")) {
                                store.deleteEvaluation(ev.id);
                                showToast("Auditoría eliminada", "success");
                              }
                            }}
                            className="px-3 py-1.5 border border-danger/30 rounded text-xs font-semibold text-danger bg-danger/5 hover:bg-danger/15"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm">
              <span className="text-text-secondary">
                Página {dataTable.page}/{totalPages} · {evaluations.length} registros
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => store.setDataTablePage(Math.max(1, dataTable.page - 1))}
                  disabled={dataTable.page <= 1}
                  className="px-3 py-1.5 border border-border-custom rounded text-sm font-semibold bg-surface hover:bg-gray-200 disabled:opacity-40"
                >
                  Ant
                </button>
                <button
                  onClick={() => store.setDataTablePage(Math.min(totalPages, dataTable.page + 1))}
                  disabled={dataTable.page >= totalPages}
                  className="px-3 py-1.5 border border-border-custom rounded text-sm font-semibold bg-surface hover:bg-gray-200 disabled:opacity-40"
                >
                  Sig
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

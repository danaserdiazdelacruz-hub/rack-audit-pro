import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Rack Audit Pro",
  description: "Sistema de Auditoría de Inventario y Racks — FLOWFORCELOGISTIC",
  authors: [{ name: "FLOWFORCELOGISTIC" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-surface">
        <Header />
        <main className="max-w-[1400px] mx-auto p-6 max-sm:p-4">
          {children}
        </main>
        <footer className="text-center py-6 px-4 text-[0.7rem] text-text-neutral border-t border-border-custom mt-8 bg-surface">
          <div className="font-bold uppercase tracking-widest mb-1">Rack Audit Pro v1.0</div>
          <div>Desarrollado por <strong className="text-primary">FLOWFORCELOGISTIC</strong> — Todos los derechos reservados © 2025</div>
        </footer>
        <ToastContainer />
      </body>
    </html>
  );
}

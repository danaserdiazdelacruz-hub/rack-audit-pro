"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/audit",
    label: "Auditar",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    href: "/config",
    label: "Config",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
      </svg>
    ),
  },
  {
    href: "/data",
    label: "Datos",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gradient-to-r from-primary to-blue-700 text-white sticky top-0 z-[100] shadow-card-lg">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 h-16 max-sm:flex-wrap max-sm:h-auto max-sm:px-3 max-sm:py-2 max-sm:gap-1">
        <div className="flex items-center gap-3 font-bold text-lg tracking-wide max-sm:text-base">
          <div className="bg-white/15 px-2 py-0.5 rounded text-xs font-extrabold border border-white/30 flex items-center justify-center">
            RAP
          </div>
          <span className="max-md:hidden">RACK AUDIT PRO</span>
        </div>

        <nav className="flex gap-0.5 bg-black/20 p-[3px] rounded-lg max-sm:w-full max-sm:overflow-x-auto max-sm:bg-transparent max-sm:border-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-all whitespace-nowrap",
                  isActive
                    ? "bg-white text-primary font-bold shadow-md"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {item.icon}
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

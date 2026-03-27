# Rack Audit Pro

> Warehouse rack auditing system built with Next.js 14, TypeScript, Tailwind CSS and Zustand.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-4.5-orange)

## Overview

Rack Audit Pro enables warehouse auditors to perform structured rack inspections through a 4-step wizard, track compliance metrics via a real-time dashboard, and manage historical audit data with export/import capabilities.

## Features

- **Dashboard** — KPIs for the last 72 hours, panoramic daily view with bar charts, 30-day historical matrix by shift
- **Audit Wizard** — 4-step guided evaluation: Area → Round → Checklist → Summary
- **Configuration** — Customizable questions per area (5-10), adjustable compliance thresholds
- **Data Management** — Full CRUD, JSON/CSV export, JSON import, pagination, bulk operations

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | App Router, file-based routing, hybrid rendering |
| **TypeScript** | Type safety across the entire codebase |
| **Tailwind CSS** | Utility-first styling with custom industrial theme |
| **Zustand** | Lightweight global state management |
| **localStorage** | Client-side data persistence |

## Project Structure

```
src/
├── app/                    # Pages (App Router)
│   ├── layout.tsx          # Global layout (header + footer)
│   ├── page.tsx            # Root redirect → /dashboard
│   ├── dashboard/page.tsx  # Dashboard with KPIs & matrix
│   ├── audit/page.tsx      # 4-step audit wizard
│   ├── config/page.tsx     # Questions & thresholds config
│   └── data/page.tsx       # Data management & export
├── components/             # Reusable UI components
│   ├── layout/Header.tsx   # Navigation header
│   ├── dashboard/          # KPICard, DayCard, HistoryMatrix
│   └── ui/Toast.tsx        # Toast notification system
├── hooks/                  # Custom React hooks
│   ├── useAudit.ts         # Wizard logic & validation
│   └── useDashboard.ts     # Dashboard calculations
├── store/                  # Zustand global store
│   └── auditStore.ts       # All state & actions
└── lib/                    # Utilities & config
    ├── types.ts            # TypeScript type definitions
    ├── constants.ts        # Default questions & thresholds
    └── utils.ts            # Calculation & formatting helpers
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/rack-audit-pro.git
cd rack-audit-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Connect repository at [vercel.com](https://vercel.com)
3. Deploy automatically on every push

## Author

**FLOWFORCELOGISTIC** — All rights reserved © 2025

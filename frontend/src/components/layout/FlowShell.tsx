import type { ReactNode } from 'react';
import { SidebarPanel } from '@/components/shared/SidebarPanel';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

interface FlowShellProps {
  title: string;
  subtitle: string;
  accent: 'coral' | 'sage';
  onBack: () => void;
  stepRail: ReactNode;
  sidebar: ReactNode;
  sidebarFooter?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

const ACCENT_MAP = {
  coral: 'from-coral/20 via-paper-deep/50 to-transparent border-coral/35',
  sage: 'from-sage/15 via-paper-deep/50 to-transparent border-sage/30',
} as const;

export function FlowShell({
  title,
  subtitle,
  accent,
  onBack,
  stepRail,
  sidebar,
  sidebarFooter,
  children,
  footer,
}: FlowShellProps) {
  return (
    <div className="h-dvh flex flex-col overflow-hidden grain bg-paper text-ink">
      <header
        className={`shrink-0 border-b border-paper-muted/70 bg-gradient-to-br ${ACCENT_MAP[accent]}`}
      >
        <div className="max-w-[1800px] mx-auto px-5 lg:px-10 pt-5 pb-0">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-3">
            <div className="min-w-0">
              <button
                type="button"
                onClick={onBack}
                className="btn-ghost -ml-2 mb-2 text-ink hover:text-ink text-ui-sm py-1"
              >
                ← Inicio
              </button>
              <h1 className="font-display text-3xl lg:text-[2.25rem] font-semibold text-ink tracking-tight">
                {title}
              </h1>
              <p className="text-ink-soft text-ui-lg mt-1 max-w-xl text-balance">
                {subtitle}
              </p>
            </div>
            <div className="hidden lg:flex items-end gap-3 shrink-0">
              <ThemeToggle />
              {stepRail}
            </div>
          </div>
          <div className="lg:hidden flex items-center justify-between gap-3 pb-1">
            <div className="overflow-x-auto overscroll-x-none flex-1 min-w-0">{stepRail}</div>
            <ThemeToggle className="shrink-0" />
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 max-w-[1800px] mx-auto w-full px-5 lg:px-10 py-4 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(320px,400px)_1fr] gap-6 min-w-0">
          <SidebarPanel footer={sidebarFooter}>{sidebar}</SidebarPanel>

          <main className="min-h-0 min-w-0 h-full flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-5 pr-1">
              {children}
            </div>
            {footer && <div className="shrink-0 pt-2">{footer}</div>}
          </main>
        </div>
      </div>
    </div>
  );
}

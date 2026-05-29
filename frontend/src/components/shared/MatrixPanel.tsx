import type { ReactNode } from 'react';

interface MatrixPanelProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export function MatrixPanel({ title, description, action, children }: MatrixPanelProps) {
  return (
    <section className="panel h-full min-h-0 flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center justify-between gap-4 px-6 py-5 border-b border-paper-muted/60">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold text-ink leading-tight">{title}</h2>
          <p className="text-ui-base text-ink-faint mt-1.5">{description}</p>
        </div>
        {action}
      </header>
      <div className="flex-1 min-h-0 overflow-auto p-6 flex items-start justify-stretch">
        <div className="w-full">{children}</div>
      </div>
    </section>
  );
}

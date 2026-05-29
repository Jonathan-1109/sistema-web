import type { ReactNode } from 'react';

interface SidebarPanelProps {
  children: ReactNode;
  footer?: ReactNode;
}

export function SidebarPanel({ children, footer }: SidebarPanelProps) {
  return (
    <aside className="panel h-full min-w-0 w-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-x-none p-5 space-y-5">
        {children}
      </div>
      {footer && (
        <div className="shrink-0 p-5 border-t border-paper-muted/60 space-y-3 bg-paper-elevated/50">
          {footer}
        </div>
      )}
    </aside>
  );
}

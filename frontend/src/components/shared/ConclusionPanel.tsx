interface ConclusionPanelProps {
  text: string | null;
  loading: boolean;
  onRequest?: () => void;
  showRequestButton?: boolean;
}

export function ConclusionPanel({
  text,
  loading,
  onRequest,
  showRequestButton = false,
}: ConclusionPanelProps) {
  if (loading) {
    return (
      <div className="panel p-6 animate-pulse-soft">
        <p className="font-mono text-xs text-violet uppercase tracking-widest mb-3">
          Sintetizando conclusión
        </p>
        <div className="space-y-2">
          <div className="h-3 bg-paper-muted rounded-full w-full" />
          <div className="h-3 bg-paper-muted rounded-full w-4/5" />
          <div className="h-3 bg-paper-muted rounded-full w-3/5" />
        </div>
      </div>
    );
  }

  if (!text && showRequestButton && onRequest) {
    return (
      <div className="panel p-6 border-dashed border-2 border-violet/40 bg-violet/10">
        <p className="font-display text-lg text-ink mb-2">Análisis interpretativo</p>
        <p className="text-sm text-ink-soft mb-4">
          Genera una conclusión en lenguaje natural sobre la solución obtenida.
        </p>
        <button
          type="button"
          onClick={onRequest}
          className="btn-primary !bg-violet hover:!bg-violet-soft"
        >
          Generar con Groq
        </button>
      </div>
    );
  }

  if (!text) return null;

  return (
    <article className="panel p-6 relative overflow-hidden animate-fade-up">
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet/8 rounded-full -translate-y-1/2 translate-x-1/2" />
      <header className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-violet animate-pulse-soft" />
        <h3 className="font-mono text-xs text-violet uppercase tracking-widest">
          Conclusión analítica
        </h3>
      </header>
      <div className="prose-sm text-ink-soft leading-relaxed whitespace-pre-wrap font-sans text-[15px]">
        {text}
      </div>
    </article>
  );
}

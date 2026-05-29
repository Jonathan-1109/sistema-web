interface DimensionPickerProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function DimensionPicker({
  label,
  value,
  min = 2,
  max = 8,
  onChange,
}: DimensionPickerProps) {
  return (
    <div className="flex items-center justify-between gap-3 min-w-0">
      <span className="font-mono text-ui-sm text-ink-soft uppercase tracking-wider truncate shrink">
        {label}
      </span>
      <div className="flex items-center gap-1 bg-paper-elevated rounded-xl p-1 border border-paper-muted/70 shrink-0">
        <button
          type="button"
          aria-label={`Reducir ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-soft text-lg
            hover:bg-paper-muted/50 hover:text-ink disabled:opacity-30 transition-colors"
        >
          −
        </button>
        <span className="font-mono text-ui-lg font-semibold w-7 text-center tabular-nums text-ink">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Aumentar ${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-soft text-lg
            hover:bg-paper-muted/50 hover:text-ink disabled:opacity-30 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

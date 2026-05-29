import { TRANSPORT_METHODS, type TransportMethod } from '@/types/domain';

interface MethodSelectorProps {
  selected: TransportMethod;
  onSelect: (method: TransportMethod) => void;
  compact?: boolean;
}

export function MethodSelector({ selected, onSelect, compact = true }: MethodSelectorProps) {
  if (compact) {
    return (
      <div className="space-y-2">
        <label
          htmlFor="transport-method"
          className="font-mono text-ui-sm uppercase tracking-wider text-ink-soft"
        >
          Método heurístico
        </label>
        <select
          id="transport-method"
          value={selected}
          onChange={(e) => onSelect(e.target.value as TransportMethod)}
          className="w-full max-w-full text-ui-base font-medium text-ink bg-paper-elevated border border-paper-muted/80
            rounded-xl px-3.5 py-3 outline-none cursor-pointer
            focus:border-coral/60 focus:ring-2 focus:ring-coral/25"
        >
          {TRANSPORT_METHODS.map((method) => (
            <option key={method.id} value={method.id}>
              {method.label}
            </option>
          ))}
        </select>
        <p className="text-ui-sm text-ink-faint leading-relaxed">
          {TRANSPORT_METHODS.find((m) => m.id === selected)?.description}
        </p>
      </div>
    );
  }

  return null;
}

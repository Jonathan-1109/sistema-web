interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
}

export function ToggleSwitch({ checked, onChange, label, hint }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer min-w-0">
      <div className="min-w-0">
        <p className="text-ui-base font-medium text-ink truncate">{label}</p>
        {hint && <p className="text-ui-sm text-ink-faint truncate">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200
          ${checked ? 'bg-violet' : 'bg-paper-muted'}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-ink shadow-sm transition-transform duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </label>
  );
}

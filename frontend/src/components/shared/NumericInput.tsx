import { useEffect, useState } from 'react';

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  'aria-label'?: string;
}

function formatDisplay(value: number): string {
  return value === 0 ? '' : String(value);
}

export function NumericInput({
  value,
  onChange,
  className = 'cell-input',
  min = 0,
  'aria-label': ariaLabel,
}: NumericInputProps) {
  const [text, setText] = useState(() => formatDisplay(value));

  useEffect(() => {
    setText(formatDisplay(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      min={min}
      aria-label={ariaLabel}
      className={className}
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '' || raw === '-' || /^-?\d*\.?\d*$/.test(raw)) {
          setText(raw);
          if (raw === '' || raw === '-') {
            onChange(0);
          } else {
            const parsed = Number(raw);
            if (Number.isFinite(parsed) && parsed >= min) onChange(parsed);
          }
        }
      }}
      onBlur={() => setText(formatDisplay(value))}
    />
  );
}

import type { FlowStep } from '@/types/domain';

interface StepRailProps {
  current: FlowStep;
  onNavigate: (step: FlowStep) => void;
  access: Record<FlowStep, boolean>;
}

const STEPS: { id: FlowStep; label: string; num: string }[] = [
  { id: 'datos', label: 'Datos', num: '01' },
  { id: 'resultado', label: 'Resultado', num: '02' },
];

export function StepRail({ current, onNavigate, access }: StepRailProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Progreso del flujo" className="flex items-end gap-2">
      {STEPS.map((step, index) => {
        const isActive = step.id === current;
        const isPast = index < currentIndex;
        const isEnabled = access[step.id] === true;

        return (
          <button
            key={step.id}
            type="button"
            disabled={!isEnabled}
            onClick={() => isEnabled && onNavigate(step.id)}
            className={`
              group relative flex flex-col items-start px-6 py-3.5 min-w-[7.5rem]
              transition-all duration-200 rounded-t-xl
              ${isActive ? 'bg-paper-elevated shadow-panel -mb-px z-10' : 'hover:bg-paper-elevated/40'}
              ${!isEnabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span
              className={`font-mono text-ui-sm tracking-widest uppercase mb-1
                ${isActive ? 'text-coral' : isPast ? 'text-sage' : 'text-ink-faint'}`}
            >
              {step.num}
            </span>
            <span
              className={`font-display text-ui-lg
                ${isActive ? 'text-ink font-semibold' : 'text-ink-soft'}`}
            >
              {step.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-coral rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

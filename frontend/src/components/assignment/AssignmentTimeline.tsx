import { orderedLogKeys } from '@/lib/matrix';
import type { AssignmentLog } from '@/types/api';

interface AssignmentTimelineProps {
  log: AssignmentLog | null;
}

const STEP_LABELS: Record<string, string> = {
  step1: 'Reducción por filas',
  step2: 'Reducción por columnas',
  final: 'Asignación final',
};

function labelForKey(key: string, index: number): string {
  if (STEP_LABELS[key]) return STEP_LABELS[key];
  if (key.startsWith('iter') || key.includes('cover')) return `Cobertura ${index + 1}`;
  return key;
}

export function AssignmentTimeline({ log }: AssignmentTimelineProps) {
  if (!log || Object.keys(log).length === 0) {
    return (
      <p className="text-ui-base text-ink-faint italic">
        Ejecuta la resolución para ver los pasos del algoritmo húngaro.
      </p>
    );
  }

  const keys = orderedLogKeys(log);

  return (
    <div className="space-y-3">
      {keys.map((key, index) => {
        const step = log[key];
        if (!step?.matrix) return null;

        const rowsCovers = step.rowsCovers;
        const colsCovers = step.colsCovers;

        return (
          <details
            key={key}
            className="panel group"
            open={index === keys.length - 1}
          >
            <summary className="px-4 py-3 cursor-pointer font-medium text-ui-base text-ink
              hover:text-ink list-none flex items-center justify-between">
              <span>{labelForKey(key, index)}</span>
              <span className="font-mono text-ui-sm text-ink-faint uppercase">{key}</span>
            </summary>
            <div className="px-4 pb-4 overflow-x-auto">
              <table className="border-separate border-spacing-1 font-mono text-ui-base mx-auto">
                <tbody>
                  {step.matrix.map((row, i) => (
                    <tr
                      key={i}
                      className={rowsCovers?.[i] ? 'opacity-50' : undefined}
                    >
                      {row.map((cell, j) => {
                        const colCovered = colsCovers?.[j];
                        const isZero = cell === 0;
                        return (
                          <td
                            key={j}
                            className={`
                              px-3 py-1.5 rounded text-center
                              ${colCovered ? 'bg-paper-muted/40 text-ink-faint' : ''}
                              ${isZero && !colCovered ? 'bg-sage/15 text-sage font-semibold' : 'text-ink'}
                            `}
                          >
                            {Number.isInteger(cell) ? cell : cell.toFixed(1)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        );
      })}
    </div>
  );
}

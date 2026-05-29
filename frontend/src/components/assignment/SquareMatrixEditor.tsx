import { NumericInput } from '@/components/shared/NumericInput';

interface SquareMatrixEditorProps {
  size: number;
  matrix: number[][];
  workerLabels: string[];
  taskLabels: string[];
  positions: number[][] | null;
  onCellChange: (row: number, col: number, value: number) => void;
  onWorkerLabelChange: (index: number, value: string) => void;
  onTaskLabelChange: (index: number, value: string) => void;
}

function isAssignedPosition(
  positions: number[][] | null,
  row: number,
  col: number,
): boolean {
  if (!positions) return false;
  return positions.some(([r, c]) => r === row && c === col);
}

export function SquareMatrixEditor({
  size,
  matrix,
  workerLabels,
  taskLabels,
  positions,
  onCellChange,
  onWorkerLabelChange,
  onTaskLabelChange,
}: SquareMatrixEditorProps) {
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-separate border-spacing-2.5">
        <thead>
          <tr>
            <th className="w-[18%]" />
            {taskLabels.map((label, j) => (
              <th key={j}>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => onTaskLabelChange(j, e.target.value)}
                  className="w-full text-center font-mono text-ui-sm uppercase tracking-wide
                    text-ink bg-transparent border-none outline-none focus:text-violet"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: size }).map((_, i) => (
            <tr key={i}>
              <td className="align-middle pr-1">
                <input
                  type="text"
                  value={workerLabels[i] ?? ''}
                  onChange={(e) => onWorkerLabelChange(i, e.target.value)}
                  className="w-full font-semibold text-ui-sm uppercase tracking-wide text-ink
                    bg-transparent border-none outline-none focus:text-violet text-right"
                />
              </td>
              {Array.from({ length: size }).map((_, j) => {
                const assigned = isAssignedPosition(positions, i, j);
                return (
                  <td key={j} className="align-middle">
                    <div
                      className={`
                        min-h-[3.5rem] rounded-xl border flex items-center justify-center transition-all
                        ${assigned
                          ? 'bg-violet/25 border-violet/50 ring-2 ring-violet/35'
                          : 'bg-paper-elevated border-paper-muted/80 hover:border-violet/40'
                        }
                      `}
                    >
                      <NumericInput
                        value={matrix[i]?.[j] ?? 0}
                        onChange={(v) => onCellChange(i, j, v)}
                        className="cell-input text-lg font-medium"
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

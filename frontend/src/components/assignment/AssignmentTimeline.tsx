import { orderedLogKeys } from '@/lib/matrix';
import type { AssignmentLog } from '@/types/api';

interface AssignmentTimelineProps {
  log: AssignmentLog | null;
  originalMatrix: number[][];
  positions: number[][] | null;
  workerLabels: string[];
  taskLabels: string[];
}

function isAssignedPosition(
  positions: number[][] | null,
  row: number,
  col: number,
): boolean {
  if (!positions) return false;
  return positions.some(([r, c]) => r === row && c === col);
}

function MatrixTable({
  matrix,
  rowsCovers,
  colsCovers,
  positions,
}: {
  matrix: number[][];
  rowsCovers?: boolean[];
  colsCovers?: boolean[];
  positions?: number[][] | null;
}) {
  return (
    <table className="border-separate border-spacing-1 font-mono text-ui-base mx-auto">
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i} className={rowsCovers?.[i] ? 'opacity-50' : undefined}>
            {row.map((cell, j) => {
              const colCovered = colsCovers?.[j];
              const isZero = cell === 0;
              const assigned = positions ? isAssignedPosition(positions, i, j) : false;
              return (
                <td
                  key={j}
                  className={`
                    px-3 py-1.5 rounded text-center
                    ${assigned ? 'bg-violet/25 ring-2 ring-violet/35 font-semibold' : ''}
                    ${colCovered && !assigned ? 'bg-paper-muted/40 text-ink-faint' : ''}
                    ${isZero && !colCovered && !assigned ? 'bg-sage/15 text-sage font-semibold' : ''}
                    ${!assigned && !colCovered && !isZero ? 'text-ink' : ''}
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
  );
}

export function AssignmentTimeline({
  log,
  originalMatrix,
  positions,
  workerLabels,
  taskLabels,
}: AssignmentTimelineProps) {
  if (!log || Object.keys(log).length === 0) {
    return (
      <p className="text-ui-base text-ink-faint italic">
        Ejecuta la resolución para ver los pasos del algoritmo húngaro.
      </p>
    );
  }
  let keys = orderedLogKeys(log);
  keys.push(keys.shift()!);
  let stepCounter = 0;

  return (
    <div className="space-y-3">
      <details className="panel group" open>
        <summary className="px-4 py-3 cursor-pointer font-medium text-ui-base text-ink
          hover:text-ink list-none">
          <span>paso {++stepCounter}: Matriz original</span>
        </summary>
        <div className="px-4 pb-4 overflow-x-auto">
          <MatrixTable matrix={originalMatrix} />
        </div>
      </details>

      {keys.map((key) => {
        const step = log[key];
        if (!step?.matrix) return null;

        return (

          <details
            key={key}
            className="panel group"
          >
            <summary className="px-4 py-3 cursor-pointer font-medium text-ui-base text-ink
              hover:text-ink list-none flex items-center justify-between">
              <span>paso {++stepCounter}</span>
              <span className="font-mono text-ui-sm text-ink-faint uppercase">{key}</span>
            </summary>
            <div className="px-4 pb-4 overflow-x-auto">
              <MatrixTable
                matrix={step.matrix}
                rowsCovers={step.rowsCovers}
                colsCovers={step.colsCovers}
              />
            </div>
          </details>
        );

      })}

      <details className="panel group" open>
        <summary className="px-4 py-3 cursor-pointer font-medium text-ui-base text-ink
          hover:text-ink list-none">
          <span>paso {++stepCounter}: Resolución final</span>
        </summary>
        <div className="px-4 pb-4 overflow-x-auto">
          <table className="border-separate border-spacing-2 font-mono text-ui-base mx-auto">
            <thead>
              <tr>
                <th className="px-3 py-1.5" />
                {taskLabels.map((label, j) => (
                  <th key={j} className="px-3 py-1.5 text-ui-sm text-ink-faint uppercase">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {originalMatrix.map((row, i) => (
                <tr key={i}>
                  <td className="px-3 py-1.5 text-ui-sm text-ink-faint uppercase font-semibold text-right">
                    {workerLabels[i]}
                  </td>
                  {row.map((cell, j) => {
                    const assigned = isAssignedPosition(positions, i, j);
                    return (
                      <td
                        key={j}
                        className={`
                          px-3 py-1.5 rounded text-center
                          ${assigned
                            ? 'bg-violet/25 ring-2 ring-violet/35 font-semibold text-violet'
                            : 'text-ink'
                          }
                        `}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

import { useState } from 'react';
import { orderedLogKeys } from '@/lib/matrix';
import type { TransportLog } from '@/types/api';

interface SolutionTimelineProps {
  log: TransportLog | null;
  originLabels: string[];
  destinationLabels: string[];
}

export function SolutionTimeline({
  log,
  originLabels,
  destinationLabels,
}: SolutionTimelineProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  if (!log || Object.keys(log).length === 0) {
    return (
      <p className="text-sm text-ink italic">
        Ejecuta la resolución para ver el desglose iterativo.
      </p>
    );
  }

  const keys = orderedLogKeys(log);
  const currentKey = activeKey ?? keys[keys.length - 1] ?? null;
  const iteration = currentKey ? log[currentKey] : null;

  return (
    <div className="space-y-4">
      {/* Horizontal scrubber — asymmetric timeline */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {keys.map((key, index) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveKey(key)}
            className={`
              shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all
              ${currentKey === key
                ? 'border-sage bg-sage/10 text-sage'
                : 'border-paper-muted/50 text-ink hover:border-sage/30'
              }
            `}
          >
            <span className="font-mono text-[10px]">Paso {index + 1}</span>
            {iteration && currentKey === key && (
              <span className="font-mono text-xs font-medium">
                ({iteration.x + 1},{iteration.y + 1}) = {iteration.assign}
              </span>
            )}
          </button>
        ))}
      </div>

{iteration && (
  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 animate-fade-up">
    <div className="panel p-4 overflow-x-auto">
      <p className="font-mono text-[14px] uppercase tracking-widest text-ink mb-3">
        Estado de costos — iteración {currentKey?.replace("iter", "")}
      </p>
      <table className="border-separate border-spacing-1 w-full text-sm font-mono">
        <thead>
          <tr>
            <th />
            {destinationLabels.slice(0, iteration.matrix[0]?.length ?? 0).map((d, j) => (
              <th key={j} className="text-[15px] text-ink font-normal px-2 py-1">
                {d}
              </th>
            ))}
            <th className="text-[15px] text-ink font-normal px-2 py-1">
              Ofertas
            </th>
          </tr>
        </thead>
        <tbody>
          {iteration.matrix.map((row, i) => (
            <tr key={i}>
              <td className="text-[15px] text-ink pr-2">
                {originLabels[i] ?? `Origen ${i + 1}`}
              </td>
              {row.map((cell, j) => {
                const isAssign = i === iteration.y && j === iteration.x;
                console.log(i, j, iteration.x,  iteration.y)
                return (
                  <td
                    key={j}
                    className={`
                      text-center px-2 py-1.5 rounded
                      ${isAssign ? 'bg-sage/25 text-sage font-bold' : 'text-ink'}
                    `}
                  >
                    {cell}
                  </td>
                );
              })}
              <td className="text-center px-2 py-1.5 text-ink">
                {iteration.offers[i]}
              </td>
            </tr>
          ))}

          <tr>
            <td className="text-[15px] text-ink pr-2 font-normal">
              Demandas
            </td>
            {iteration.demands.map((value, i) => (
              <td key={i} className="text-center px-2 py-1.5 text-ink">
                {value}
              </td>
            ))}
            <td />
          </tr>
        </tbody>
      </table>
    </div>

          <aside className="panel p-4 min-w-[180px] space-y-3 self-start">
            <div>
              <p className="font-mono text-[10px] text-ink uppercase">Asignación</p>
              <p className="font-display text-2xl text-sage font-semibold">{iteration.assign}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-ink uppercase">Celda</p>
              <p className="font-mono text text-ink">
                {originLabels[iteration.y] ?? `Origen ${iteration.y + 1}`}
                <span className="text-ink mx-1">→</span>
                {destinationLabels[iteration.x] ?? `Destino ${iteration.x + 1}`}
              </p>
            </div>
            <div>
              <p className="font-mono text-ui text-ink uppercase">Costo unitario</p>
              <p className="font-mono text-ui-base text-ink">{iteration.minimun}</p>
            </div>
            {(iteration.penaltiesRows || iteration.penaltiesColt) && (
              <div>
                <p className="font-mono text-ui-sm text-ink uppercase">Penalizaciones Vogel</p>
                <p className="font-mono text-ui-sm text-ink-soft mt-1">
                  Filas: [{iteration.penaltiesRows?.join(', ') ?? '—'}]
                </p>
                <p className="font-mono text-ui-sm text-ink-soft">
                  Cols: [{iteration.penaltiesColt?.join(', ') ?? '—'}]
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

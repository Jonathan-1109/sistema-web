import { NumericInput } from '@/components/shared/NumericInput';

interface MatrixEditorProps {
  rows: number;
  cols: number;
  matrix: number[][];
  offers: number[];
  demands: number[];
  originLabels: string[];
  destinationLabels: string[];
  values: number[] | null;
  onCellChange: (row: number, col: number, value: number) => void;
  onOfferChange: (index: number, value: number) => void;
  onDemandChange: (index: number, value: number) => void;
  onOriginLabelChange: (index: number, value: string) => void;
  onDestinationLabelChange: (index: number, value: string) => void;
}

function isAllocatedCell(
  values: number[] | null,
  rows: number,
  cols: number,
  row: number,
  col: number,
): boolean {
  if (!values || values.length !== rows * cols) return false;
  const index = row * cols + col;
  return values[index] !== undefined && values[index] > 0;
}

export function MatrixEditor({
  rows,
  cols,
  matrix,
  offers,
  demands,
  originLabels,
  destinationLabels,
  values,
  onCellChange,
  onOfferChange,
  onDemandChange,
  onOriginLabelChange,
  onDestinationLabelChange,
}: MatrixEditorProps) {
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-separate border-spacing-2.5">
        <thead>
          <tr>
            <th className="w-[11%]" />
            {destinationLabels.map((label, j) => (
              <th key={j}>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => onDestinationLabelChange(j, e.target.value)}
                  className="w-full text-center font-mono text-ui-sm uppercase tracking-wide
                    text-ink-faint bg-transparent border-none outline-none focus:text-coral"
                  aria-label={`Nombre destino ${j + 1}`}
                />
              </th>
            ))}
            <th className="font-mono text-ui-sm uppercase tracking-widest text-sage text-center py-2">
              Oferta
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td className="align-middle pr-1">
                <input
                  type="text"
                  value={originLabels[i] ?? ''}
                  onChange={(e) => onOriginLabelChange(i, e.target.value)}
                  className="w-full font-mono text-ui-sm uppercase tracking-wide text-ink-faint
                    bg-transparent border-none outline-none focus:text-coral text-right"
                  aria-label={`Nombre origen ${i + 1}`}
                />
              </td>
              {Array.from({ length: cols }).map((_, j) => {
                const allocated = isAllocatedCell(values, rows, cols, i, j);
                return (
                  <td key={j} className="align-middle">
                    <div
                      className={`
                        min-h-[3.5rem] rounded-xl border flex items-center justify-center transition-all
                        ${allocated
                          ? 'bg-sage/20 border-sage/45 ring-1 ring-sage/30'
                          : 'bg-paper-elevated border-paper-muted/80 hover:border-coral/50'
                        }
                      `}
                    >
                      <NumericInput
                        value={matrix[i]?.[j] ?? 0}
                        onChange={(v) => onCellChange(i, j, v)}
                        className="cell-input text-lg font-medium"
                        aria-label={`Costo ${originLabels[i]} → ${destinationLabels[j]}`}
                      />
                    </div>
                  </td>
                );
              })}
              <td className="align-middle">
                <div className="min-h-[3.5rem] rounded-xl border border-sage/40 bg-sage/15 flex items-center justify-center">
                  <NumericInput
                    value={offers[i] ?? 0}
                    onChange={(v) => onOfferChange(i, v)}
                    className="cell-input text-sage font-semibold text-lg"
                    aria-label={`Oferta ${originLabels[i]}`}
                  />
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td className="font-mono text-ui-sm uppercase tracking-widest text-rose text-right pr-1 align-middle py-2">
              Demanda
            </td>
            {Array.from({ length: cols }).map((_, j) => (
              <td key={j} className="align-middle">
                <div className="min-h-[3.25rem] rounded-xl border border-rose/35 bg-rose/10 flex items-center justify-center">
                  <NumericInput
                    value={demands[j] ?? 0}
                    onChange={(v) => onDemandChange(j, v)}
                    className="cell-input text-rose font-semibold text-lg"
                    aria-label={`Demanda ${destinationLabels[j]}`}
                  />
                </div>
              </td>
            ))}
            <td className="align-middle">
              <div className="min-h-[3.25rem] rounded-xl bg-paper-muted/50 border border-paper-muted flex items-center justify-center font-mono text-ui-lg font-bold text-ink">
                {demands.reduce((a, b) => a + b, 0)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

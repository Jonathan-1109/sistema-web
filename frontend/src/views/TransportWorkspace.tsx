import { ExportPdfButton } from '@/components/shared/ExportPdfButton';
import { FlowShell } from '@/components/layout/FlowShell';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import { ConclusionPanel } from '@/components/shared/ConclusionPanel';
import { DimensionPicker } from '@/components/shared/DimensionPicker';
import { MatrixPanel } from '@/components/shared/MatrixPanel';
import { StepRail } from '@/components/shared/StepRail';
import { ToggleSwitch } from '@/components/shared/ToggleSwitch';
import { BalanceIndicator } from '@/components/transport/BalanceIndicator';
import { MatrixEditor } from '@/components/transport/MatrixEditor';
import { MethodSelector } from '@/components/transport/MethodSelector';
import { SolutionTimeline } from '@/components/transport/SolutionTimeline';
import type { useTransportSolver } from '@/hooks/useTransportSolver';
import { buildStepAccess } from '@/lib/flowSteps';

interface TransportWorkspaceProps {
  solver: ReturnType<typeof useTransportSolver>;
  onBack: () => void;
}

function ResultSummary({
  result,
  values,
  onExportPdf,
  pdfLoading,
}: {
  result: number;
  values: number[] | null;
  onExportPdf: () => void;
  pdfLoading: boolean;
}) {
  return (
    <div className="shrink-0 flex flex-wrap items-center gap-x-8 gap-y-3 panel p-5">
      <div>
        <p className="font-mono text-ui-sm uppercase tracking-widest text-ink">Costo total</p>
        <p className="font-display text-5xl font-semibold text-coral tabular-nums mt-1">{result}</p>
      </div>
      {values && (
        <div className="min-w-0 flex-1">
          <p className="font-mono text-ui-sm text-ink mb-1.5">Asignaciones</p>
          <p className="font-mono text-ui-base text-ink-soft truncate">[{values.join(', ')}]</p>
        </div>
      )}
      <ExportPdfButton onClick={onExportPdf} loading={pdfLoading} />
    </div>
  );
}

export function TransportWorkspace({ solver, onBack }: TransportWorkspaceProps) {
  const hasResult = solver.result != null;
  const hasConclusion = solver.conclusion != null;

  const stepAccess = buildStepAccess({ hasResult });

  const showGenerateAi =
    hasResult && solver.useAi && !hasConclusion && !solver.aiLoading && !solver.loading;

  const sidebar = (
    <>
      <div className="panel-inset p-4 space-y-3">
        <DimensionPicker
          label="Orígenes"
          value={solver.rows}
          onChange={(r) => solver.resize(r, solver.cols)}
        />
        <DimensionPicker
          label="Destinos"
          value={solver.cols}
          onChange={(c) => solver.resize(solver.rows, c)}
        />
      </div>

      <MethodSelector selected={solver.method} onSelect={solver.setMethod} />

      <BalanceIndicator balance={solver.balance} serverBalanced={solver.balanced} />

      <ToggleSwitch
        label="Conclusión con IA"
        hint="Groq"
        checked={solver.useAi}
        onChange={solver.setUseAi}
      />

      {solver.useAi && (
        <textarea
          value={solver.extraContext}
          onChange={(e) => solver.setExtraContext(e.target.value)}
          placeholder="Contexto (opcional)…"
          rows={2}
          className="w-full max-w-full text-ui-base bg-paper-elevated border border-paper-muted/70 rounded-xl
            p-3 resize-none outline-none focus:border-violet/50 placeholder:text-ink box-border"
        />
      )}

      {showGenerateAi && solver.step === 'resultado' && (
        <button
          type="button"
          onClick={() => void solver.requestInsight()}
          className="w-full py-3 rounded-xl border border-violet/40 bg-violet/10 text-violet
            text-ui-base font-medium hover:bg-violet/15 transition-colors"
        >
          Generar análisis IA
        </button>
      )}

      <div className="panel-inset p-4">
        <p className="font-mono text-ui-sm uppercase tracking-widest text-ink mb-2">
          Actividad
        </p>
        <ActivityFeed entries={solver.logs} maxHeight="max-h-24" />
      </div>
    </>
  );

  const sidebarFooter = (
    <>
      <button
        type="button"
        onClick={() => void solver.solve()}
        disabled={solver.loading}
        className="btn-primary w-full"
      >
        {solver.loading ? 'Resolviendo…' : 'Resolver transporte'}
      </button>
      <button type="button" onClick={solver.reset} className="btn-ghost w-full text-ui-sm">
        Reiniciar
      </button>
    </>
  );

  return (
    <FlowShell
      title="Transporte"
      subtitle="Heurísticas de solución inicial sobre una red oferta-demanda."
      accent="coral"
      onBack={onBack}
      stepRail={
        <StepRail
          current={solver.step}
          onNavigate={solver.setStep}
          access={stepAccess}
        />
      }
      sidebar={sidebar}
      sidebarFooter={sidebarFooter}
    >
      {solver.step === 'datos' && (
        <MatrixPanel
          title="Matriz de costos unitarios"
          description="Costos · ofertas · demandas"
        >
          <MatrixEditor
            rows={solver.rows}
            cols={solver.cols}
            matrix={solver.matrix}
            offers={solver.offers}
            demands={solver.demands}
            originLabels={solver.originLabels}
            destinationLabels={solver.destinationLabels}
            values={solver.values}
            onCellChange={solver.updateCell}
            onOfferChange={solver.updateOffer}
            onDemandChange={solver.updateDemand}
            onOriginLabelChange={solver.updateOriginLabel}
            onDestinationLabelChange={solver.updateDestinationLabel}
          />
        </MatrixPanel>
      )}

      {solver.step === 'resultado' && hasResult && solver.result != null && (
        <>
          <ResultSummary
            result={solver.result}
            values={solver.values}
            onExportPdf={() => void solver.exportPdf()}
            pdfLoading={solver.pdfLoading}
          />

          <section className="panel p-5 lg:p-6">
            <h2 className="font-display text-xl font-semibold text-ink mb-1.5">
              Línea de tiempo
            </h2>
            <p className="text-ui-sm text-ink mb-5">
              Recorre cada iteración del método seleccionado.
            </p>
            <SolutionTimeline
              log={solver.solutionLog}
              originLabels={solver.originLabels}
              destinationLabels={solver.destinationLabels}
            />
          </section>

          {(solver.useAi || hasConclusion || solver.aiLoading) && (
            <ConclusionPanel
              text={solver.conclusion}
              loading={solver.aiLoading}
              showRequestButton={solver.useAi && !hasConclusion && !solver.aiLoading}
              onRequest={() => void solver.requestInsight()}
            />
          )}
        </>
      )}
    </FlowShell>
  );
}

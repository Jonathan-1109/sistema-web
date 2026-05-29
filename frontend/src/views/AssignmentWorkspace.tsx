import { ExportPdfButton } from '@/components/shared/ExportPdfButton';
import { AssignmentTimeline } from '@/components/assignment/AssignmentTimeline';
import { SquareMatrixEditor } from '@/components/assignment/SquareMatrixEditor';
import { FlowShell } from '@/components/layout/FlowShell';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import { ConclusionPanel } from '@/components/shared/ConclusionPanel';
import { DimensionPicker } from '@/components/shared/DimensionPicker';
import { MatrixPanel } from '@/components/shared/MatrixPanel';
import { StepRail } from '@/components/shared/StepRail';
import { ToggleSwitch } from '@/components/shared/ToggleSwitch';
import type { useAssignmentSolver } from '@/hooks/useAssignmentSolver';
import { buildStepAccess } from '@/lib/flowSteps';

interface AssignmentWorkspaceProps {
  solver: ReturnType<typeof useAssignmentSolver>;
  onBack: () => void;
}

export function AssignmentWorkspace({ solver, onBack }: AssignmentWorkspaceProps) {
  const hasResult = solver.result != null;
  const hasConclusion = solver.conclusion != null;

  const stepAccess = buildStepAccess({ hasResult });

  const showGenerateAi =
    hasResult && solver.useAi && !hasConclusion && !solver.aiLoading && !solver.loading;

  const sidebar = (
    <>
      <DimensionPicker
        label="Agentes / Tareas"
        value={solver.size}
        onChange={solver.resize}
      />

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
          className="w-full py-2.5 rounded-lg border border-violet/40 bg-violet/10 text-violet
            text-sm font-medium hover:bg-violet/15 transition-colors"
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
        className="btn-primary w-full !bg-violet hover:!bg-violet-soft"
      >
        {solver.loading ? 'Resolviendo…' : 'Resolver asignación'}
      </button>
      <button type="button" onClick={solver.reset} className="btn-ghost w-full text-ui-sm">
        Reiniciar
      </button>
    </>
  );

  return (
    <FlowShell
      title="Asignación"
      subtitle="Método húngaro sobre matriz cuadrada de costos."
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
        <MatrixPanel title="Matriz de costos" description="Agentes × tareas">
          <SquareMatrixEditor
            size={solver.size}
            matrix={solver.matrix}
            workerLabels={solver.workerLabels}
            taskLabels={solver.taskLabels}
            positions={solver.positions}
            onCellChange={solver.updateCell}
            onWorkerLabelChange={solver.updateWorkerLabel}
            onTaskLabelChange={solver.updateTaskLabel}
          />
        </MatrixPanel>
      )}

      {solver.step === 'resultado' && hasResult && solver.result != null && (
        <>
          <div className="shrink-0 panel p-5 flex flex-wrap items-center gap-6">
            <p className="font-mono text-ui-sm uppercase tracking-widest text-ink">
              Costo mínimo
            </p>
            <p className="font-display text-5xl font-semibold text-violet-soft tabular-nums">
              {solver.result}
            </p>
            {solver.positions && (
              <p className="text-ui-base text-ink-soft font-mono hidden sm:block">
                {solver.positions.length} asignaciones
              </p>
            )}
            <div className="ml-auto">
              <ExportPdfButton
                onClick={() => void solver.exportPdf()}
                loading={solver.pdfLoading}
              />
            </div>
          </div>

          <section className="panel p-5 lg:p-6">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              Evolución del algoritmo
            </h2>
            <AssignmentTimeline log={solver.solutionLog} />
          </section>

          <section className="panel p-5 lg:p-6">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              Matriz con asignación
            </h2>
            <SquareMatrixEditor
              size={solver.size}
              matrix={solver.matrix}
              workerLabels={solver.workerLabels}
              taskLabels={solver.taskLabels}
              positions={solver.positions}
              onCellChange={solver.updateCell}
              onWorkerLabelChange={solver.updateWorkerLabel}
              onTaskLabelChange={solver.updateTaskLabel}
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

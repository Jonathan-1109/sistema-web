import { useCallback, useState } from 'react';
import { solveAssignment } from '@/api/assignment';
import { requestHungarianConclusion } from '@/api/groq';
import { downloadHungarianPdf } from '@/api/pdf';
import {
  clampDimension,
  createSquareMatrix,
  defaultTaskLabels,
  defaultWorkerLabels,
} from '@/lib/matrix';
import type { AssignmentLog, ManagementResponse } from '@/types/api';
import type { FlowStep, LogEntry } from '@/types/domain';

function createLog(message: string, tone: LogEntry['tone'] = 'neutral'): LogEntry {
  return {
    id: crypto.randomUUID(),
    message,
    tone,
    timestamp: Date.now(),
  };
}

export interface AssignmentSolverState {
  step: FlowStep;
  size: number;
  matrix: number[][];
  workerLabels: string[];
  taskLabels: string[];
  extraContext: string;
  useAi: boolean;
  logs: LogEntry[];
  loading: boolean;
  aiLoading: boolean;
  pdfLoading: boolean;
  result: number | null;
  values: number[] | null;
  positions: number[][] | null;
  solutionLog: AssignmentLog | null;
  conclusion: string | null;
  setStep: (step: FlowStep) => void;
  setUseAi: (value: boolean) => void;
  setExtraContext: (value: string) => void;
  resize: (size: number) => void;
  updateCell: (row: number, col: number, value: number) => void;
  updateWorkerLabel: (index: number, value: string) => void;
  updateTaskLabel: (index: number, value: string) => void;
  solve: () => Promise<void>;
  requestInsight: () => Promise<void>;
  exportPdf: () => Promise<void>;
  reset: () => void;
}

const INITIAL_SIZE = 4;

export function useAssignmentSolver(): AssignmentSolverState {
  const [step, setStep] = useState<FlowStep>('datos');
  const [size, setSize] = useState(INITIAL_SIZE);
  const [matrix, setMatrix] = useState(() => createSquareMatrix(INITIAL_SIZE));
  const [workerLabels, setWorkerLabels] = useState(() => defaultWorkerLabels(INITIAL_SIZE));
  const [taskLabels, setTaskLabels] = useState(() => defaultTaskLabels(INITIAL_SIZE));
  const [extraContext, setExtraContext] = useState('');
  const [useAi, setUseAi] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    createLog('Espacio de asignación listo.', 'info'),
  ]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [values, setValues] = useState<number[] | null>(null);
  const [positions, setPositions] = useState<number[][] | null>(null);
  const [solutionLog, setSolutionLog] = useState<AssignmentLog | null>(null);
  const [conclusion, setConclusion] = useState<string | null>(null);

  const appendLog = useCallback((message: string, tone: LogEntry['tone'] = 'neutral') => {
    setLogs((prev) => [...prev, createLog(message, tone)]);
  }, []);

  const resize = useCallback(
    (nextSize: number) => {
      const safeSize = clampDimension(nextSize);
      setSize(safeSize);
      setMatrix(createSquareMatrix(safeSize));
      setWorkerLabels(defaultWorkerLabels(safeSize));
      setTaskLabels(defaultTaskLabels(safeSize));
      setResult(null);
      setValues(null);
      setPositions(null);
      setSolutionLog(null);
      setConclusion(null);
      appendLog(`Matriz cuadrada ${safeSize}×${safeSize} creada.`, 'info');
    },
    [appendLog],
  );

  const updateCell = useCallback((row: number, col: number, value: number) => {
    setMatrix((prev) =>
      prev.map((r, ri) =>
        r.map((cell, ci) => (ri === row && ci === col ? value : cell)),
      ),
    );
  }, []);

  const updateWorkerLabel = useCallback((index: number, value: string) => {
    setWorkerLabels((prev) => prev.map((label, i) => (i === index ? value : label)));
  }, []);

  const updateTaskLabel = useCallback((index: number, value: string) => {
    setTaskLabels((prev) => prev.map((label, i) => (i === index ? value : label)));
  }, []);

  const solve = useCallback(async () => {
    setLoading(true);
    setConclusion(null);
    appendLog('Ejecutando algoritmo húngaro…', 'info');

    try {
      const response: ManagementResponse = await solveAssignment({ matrix });

      setResult(response.result);
      setValues(response.values);
      setPositions(response.positions);
      setSolutionLog(response.log);
      setStep('resultado');
      appendLog(`Costo mínimo de asignación: ${response.result ?? '—'}`, 'success');

      if (useAi && response.log && response.result != null && response.values && response.positions) {
        setAiLoading(true);
        appendLog('Generando conclusión con Groq…', 'ai');
        try {
          const groq = await requestHungarianConclusion({
            origins: workerLabels,
            destinations: taskLabels,
            extraContext: extraContext || undefined,
            matrix,
            log: response.log,
            result: response.result,
            values: response.values,
            positions: response.positions,
          });
          setConclusion(groq.conclusionGroq);
          setStep('resultado');
          appendLog('Conclusión generada.', 'ai');
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error desconocido';
          appendLog(`Groq: ${message}`, 'error');
        } finally {
          setAiLoading(false);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      appendLog(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [appendLog, extraContext, matrix, taskLabels, useAi, workerLabels]);

  const requestInsight = useCallback(async () => {
    if (!solutionLog || result == null || !values || !positions) return;

    setAiLoading(true);
    appendLog('Solicitando conclusión analítica…', 'ai');

    try {
      const groq = await requestHungarianConclusion({
        origins: workerLabels,
        destinations: taskLabels,
        extraContext: extraContext || undefined,
        matrix,
        log: solutionLog,
        result,
        values,
        positions,
      });
      setConclusion(groq.conclusionGroq);
      setStep('resultado');
      appendLog('Conclusión generada.', 'ai');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      appendLog(message, 'error');
    } finally {
      setAiLoading(false);
    }
  }, [
    appendLog,
    extraContext,
    matrix,
    positions,
    result,
    solutionLog,
    taskLabels,
    values,
    workerLabels,
  ]);

  const exportPdf = useCallback(async () => {
    if (!solutionLog || result == null || !values || !positions) return;

    setPdfLoading(true);
    appendLog('Generando reporte PDF…', 'info');

    try {
      await downloadHungarianPdf({
        origins: workerLabels,
        destinations: taskLabels,
        extraContext: extraContext || undefined,
        matrix,
        log: solutionLog,
        result,
        values,
        positions,
        conclusion: conclusion ?? '',
      });
      appendLog('PDF descargado correctamente.', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      appendLog(`PDF: ${message}`, 'error');
    } finally {
      setPdfLoading(false);
    }
  }, [
    appendLog,
    conclusion,
    extraContext,
    matrix,
    positions,
    result,
    solutionLog,
    taskLabels,
    values,
    workerLabels,
  ]);

  const reset = useCallback(() => {
    resize(INITIAL_SIZE);
    setStep('datos');
    setUseAi(false);
    setExtraContext('');
    setLogs([createLog('Espacio reiniciado.', 'info')]);
  }, [resize]);

  return {
    step,
    size,
    matrix,
    workerLabels,
    taskLabels,
    extraContext,
    useAi,
    logs,
    loading,
    aiLoading,
    pdfLoading,
    result,
    values,
    positions,
    solutionLog,
    conclusion,
    setStep,
    setUseAi,
    setExtraContext,
    resize,
    updateCell,
    updateWorkerLabel,
    updateTaskLabel,
    solve,
    requestInsight,
    exportPdf,
    reset,
  };
}

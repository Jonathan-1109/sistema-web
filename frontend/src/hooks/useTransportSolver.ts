import { useCallback, useMemo, useState } from 'react';
import { requestTransportConclusion } from '@/api/groq';
import { downloadTransportPdf } from '@/api/pdf';
import { solveTransport } from '@/api/transport';
import {
  clampDimension,
  computeBalance,
  createMatrix,
  createVector,
  defaultDestinationLabels,
  defaultOriginLabels,
} from '@/lib/matrix';
import {
  DEFAULT_COST_MATRIX,
  DEFAULT_DEMANDS,
  DEFAULT_DESTINATION_LABELS,
  DEFAULT_OFFERS,
  DEFAULT_ORIGIN_LABELS,
} from '@/components/transport/default';
import type { ChainResponse, TransportLog } from '@/types/api';
import type { FlowStep, LogEntry, TransportMethod } from '@/types/domain';

function createLog(message: string, tone: LogEntry['tone'] = 'neutral'): LogEntry {
  return {
    id: crypto.randomUUID(),
    message,
    tone,
    timestamp: Date.now(),
  };
}

export interface TransportSolverState {
  step: FlowStep;
  rows: number;
  cols: number;
  method: TransportMethod;
  matrix: number[][];
  offers: number[];
  demands: number[];
  originLabels: string[];
  destinationLabels: string[];
  extraContext: string;
  useAi: boolean;
  logs: LogEntry[];
  loading: boolean;
  aiLoading: boolean;
  pdfLoading: boolean;
  result: number | null;
  values: number[] | null;
  solutionLog: TransportLog | null;
  balanced: boolean | null;
  conclusion: string | null;
  balance: ReturnType<typeof computeBalance>;
  setStep: (step: FlowStep) => void;
  setMethod: (method: TransportMethod) => void;
  setUseAi: (value: boolean) => void;
  setExtraContext: (value: string) => void;
  resize: (rows: number, cols: number) => void;
  updateCell: (row: number, col: number, value: number) => void;
  updateOffer: (index: number, value: number) => void;
  updateDemand: (index: number, value: number) => void;
  updateOriginLabel: (index: number, value: string) => void;
  updateDestinationLabel: (index: number, value: string) => void;
  solve: () => Promise<void>;
  requestInsight: () => Promise<void>;
  exportPdf: () => Promise<void>;
  reset: () => void;
}

const INITIAL_ROWS = 3;
const INITIAL_COLS = 4;

export function useTransportSolver(): TransportSolverState {
  const [step, setStep] = useState<FlowStep>('datos');
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [cols, setCols] = useState(INITIAL_COLS);
  const [method, setMethod] = useState<TransportMethod>('costo_minimo');
  const [matrix, setMatrix] = useState(() => DEFAULT_COST_MATRIX);
  const [offers, setOffers] = useState(() => DEFAULT_OFFERS);
  const [demands, setDemands] = useState(() => DEFAULT_DEMANDS);
  const [originLabels, setOriginLabels] = useState(() => DEFAULT_ORIGIN_LABELS);
  const [destinationLabels, setDestinationLabels] = useState(() => DEFAULT_DESTINATION_LABELS);
  const [extraContext, setExtraContext] = useState('');
  const [useAi, setUseAi] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    createLog('Espacio de trabajo de transporte listo.', 'info'),
  ]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [values, setValues] = useState<number[] | null>(null);
  const [solutionLog, setSolutionLog] = useState<TransportLog | null>(null);
  const [balanced, setBalanced] = useState<boolean | null>(null);
  const [conclusion, setConclusion] = useState<string | null>(null);

  const appendLog = useCallback((message: string, tone: LogEntry['tone'] = 'neutral') => {
    setLogs((prev) => [...prev, createLog(message, tone)]);
  }, []);

  const balance = useMemo(() => computeBalance(offers, demands), [offers, demands]);

  const resize = useCallback(
    (nextRows: number, nextCols: number) => {
      const safeRows = clampDimension(nextRows);
      const safeCols = clampDimension(nextCols);
      setRows(safeRows);
      setCols(safeCols);
      setMatrix(createMatrix(safeRows, safeCols));
      setOffers(createVector(safeRows));
      setDemands(createVector(safeCols));
      setOriginLabels(defaultOriginLabels(safeRows));
      setDestinationLabels(defaultDestinationLabels(safeCols));
      setResult(null);
      setValues(null);
      setSolutionLog(null);
      setConclusion(null);
      appendLog(`Matriz redimensionada a ${safeRows}×${safeCols}.`, 'info');
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

  const updateOffer = useCallback((index: number, value: number) => {
    setOffers((prev) => prev.map((v, i) => (i === index ? value : v)));
  }, []);

  const updateDemand = useCallback((index: number, value: number) => {
    setDemands((prev) => prev.map((v, i) => (i === index ? value : v)));
  }, []);

  const updateOriginLabel = useCallback((index: number, value: string) => {
    setOriginLabels((prev) => prev.map((label, i) => (i === index ? value : label)));
  }, []);

  const updateDestinationLabel = useCallback((index: number, value: string) => {
    setDestinationLabels((prev) => prev.map((label, i) => (i === index ? value : label)));
  }, []);

  const solve = useCallback(async () => {
    setLoading(true);
    setConclusion(null);
    appendLog(`Resolviendo con método ${method.replace('_', ' ')}…`, 'info');

    try {
      const response: ChainResponse = await solveTransport(method, {
        matrix,
        offers,
        demands,
      });

      setResult(response.result);
      setValues(response.values);
      setSolutionLog(response.log);
      setBalanced(response.balanced);
      setStep('resultado');
      appendLog(`Costo total: ${response.result ?? '—'}`, 'success');

      if (response.balanced === false) {
        appendLog('El problema fue balanceado automáticamente en el servidor.', 'info');
      }

      if (useAi && response.log && response.result != null && response.values) {
        setAiLoading(true);
        appendLog('Generando conclusión con Groq…', 'ai');
        try {
          const groq = await requestTransportConclusion({
            method,
            origins: originLabels,
            destinations: destinationLabels,
            extraContext: extraContext || undefined,
            matrix,
            offers,
            demands,
            balanced: response.balanced ?? balance.isBalanced,
            log: response.log,
            result: response.result,
            values: response.values,
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
  }, [
    appendLog,
    balance.isBalanced,
    demands,
    destinationLabels,
    extraContext,
    matrix,
    method,
    offers,
    originLabels,
    useAi,
  ]);

  const requestInsight = useCallback(async () => {
    if (!solutionLog || result == null || !values) return;

    setAiLoading(true);
    appendLog('Solicitando conclusión analítica…', 'ai');

    try {
      const groq = await requestTransportConclusion({
        method,
        origins: originLabels,
        destinations: destinationLabels,
        extraContext: extraContext || undefined,
        matrix,
        offers,
        demands,
        balanced: balanced ?? balance.isBalanced,
        log: solutionLog,
        result,
        values,
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
    balanced,
    balance.isBalanced,
    demands,
    destinationLabels,
    extraContext,
    matrix,
    method,
    offers,
    originLabels,
    result,
    solutionLog,
    values,
  ]);

  const exportPdf = useCallback(async () => {
    if (!solutionLog || result == null || !values) return;

    setPdfLoading(true);
    appendLog('Generando reporte PDF…', 'info');

    try {
      console.log(method,
        originLabels,
        destinationLabels,
        extraContext || undefined,
        matrix,
        offers,
        demands,
        balanced,
        solutionLog,
        result,
        values,
        conclusion ?? '',)
      await downloadTransportPdf({
        method,
        origins: originLabels,
        destinations: destinationLabels,
        extraContext: extraContext || undefined,
        matrix,
        offers,
        demands,
        balanced: balanced ?? balance.isBalanced,
        log: solutionLog,
        result,
        values,
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
    balanced,
    balance.isBalanced,
    conclusion,
    demands,
    destinationLabels,
    extraContext,
    matrix,
    method,
    offers,
    originLabels,
    result,
    solutionLog,
    values,
  ]);

  const reset = useCallback(() => {
    setMatrix(DEFAULT_COST_MATRIX);
    setOffers(DEFAULT_OFFERS);
    setDemands(DEFAULT_DEMANDS);
    setOriginLabels(DEFAULT_ORIGIN_LABELS);
    setDestinationLabels(DEFAULT_DESTINATION_LABELS);
    setRows(INITIAL_ROWS);
    setCols(INITIAL_COLS);
    setResult(null);
    setValues(null);
    setSolutionLog(null);
    setConclusion(null);
    setBalanced(null);
    setStep('datos');
    setMethod('costo_minimo');
    setUseAi(false);
    setExtraContext('');
    setLogs([createLog('Valores por defecto restaurados.', 'info')]);
  }, []);

  return {
    step,
    rows,
    cols,
    method,
    matrix,
    offers,
    demands,
    originLabels,
    destinationLabels,
    extraContext,
    useAi,
    logs,
    loading,
    aiLoading,
    pdfLoading,
    result,
    values,
    solutionLog,
    balanced,
    conclusion,
    balance,
    setStep,
    setMethod,
    setUseAi,
    setExtraContext,
    resize,
    updateCell,
    updateOffer,
    updateDemand,
    updateOriginLabel,
    updateDestinationLabel,
    solve,
    requestInsight,
    exportPdf,
    reset,
  };
}

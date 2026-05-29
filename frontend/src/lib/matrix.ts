import type { BalanceState } from '@/types/domain';

export function createMatrix(rows: number, cols: number, fill = 0): number[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export function createVector(size: number, fill = 0): number[] {
  return Array.from({ length: size }, () => fill);
}

export function createSquareMatrix(size: number, fill = 0): number[][] {
  return createMatrix(size, size, fill);
}

export function clampDimension(value: number, min = 2, max = 8): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function parseNumericInput(raw: string): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function computeBalance(offers: number[], demands: number[]): BalanceState {
  const totalOffers = offers.reduce((sum, value) => sum + value, 0);
  const totalDemands = demands.reduce((sum, value) => sum + value, 0);
  const delta = totalOffers - totalDemands;

  return {
    totalOffers,
    totalDemands,
    isBalanced: delta === 0,
    delta,
  };
}

export function defaultOriginLabels(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `Origen ${index + 1}`);
}

export function defaultDestinationLabels(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `Destino ${index + 1}`);
}

export function defaultWorkerLabels(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `Agente ${index + 1}`);
}

export function defaultTaskLabels(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `Tarea ${index + 1}`);
}

export function orderedLogKeys(log: Record<string, unknown>): string[] {
  return Object.keys(log).sort((a, b) => {
    const numA = Number.parseInt(a.replace(/\D/g, ''), 10);
    const numB = Number.parseInt(b.replace(/\D/g, ''), 10);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
}

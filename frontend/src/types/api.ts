import type { TransportMethod } from './domain';

export interface ChainPayload {
  matrix: number[][];
  offers: number[];
  demands: number[];
  balanced?: boolean;
}

export interface TransportIterationLog {
  matrix: number[][];
  demands: number[];
  offers: number[];
  minimun: number;
  assign: number;
  x: number;
  y: number;
  penaltiesRows?: number[];
  penaltiesColt?: number[];
}

export type TransportLog = Record<string, TransportIterationLog>;

export interface ChainResponse {
  id: string;
  message: string;
  log: TransportLog | null;
  values: number[] | null;
  result: number | null;
  balanced: boolean | null;
}

export interface ManagementPayload {
  matrix: number[][];
}

export interface HungarianStepLog {
  matrix: number[][];
  minorsRows?: number[];
  minorsCols?: number[];
  rowsCovers?: boolean[];
  colsCovers?: boolean[];
}

export type AssignmentLog = Record<string, HungarianStepLog>;

export interface ManagementResponse {
  id: string;
  message: string;
  log: AssignmentLog | null;
  values: number[] | null;
  positions: number[][] | null;
  result: number | null;
}

export interface GroqPayload {
  origins: string[];
  destinations: string[];
  extraContext?: string;
}

export interface GroqResponse {
  message: string;
  conclusionGroq: string | null;
}

export interface ApiErrorBody {
  detail?: string;
}

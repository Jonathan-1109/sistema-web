export type TransportMethod = 'costo_minimo' | 'esquina_noroeste' | 'vogel';

export type WorkspaceMode = 'landing' | 'transport' | 'assignment';

export type FlowStep = 'datos' | 'resultado';

export interface TransportMethodOption {
  id: TransportMethod;
  label: string;
  description: string;
  tag: string;
}

export const TRANSPORT_METHODS: readonly TransportMethodOption[] = [
  {
    id: 'costo_minimo',
    label: 'Costo mínimo',
    description: 'Asigna iterativamente la celda de menor costo disponible.',
    tag: 'Heurística greedy',
  },
  {
    id: 'esquina_noroeste',
    label: 'Esquina noroeste',
    description: 'Parte desde la esquina superior izquierda y avanza en filas.',
    tag: 'Solución inicial',
  },
  {
    id: 'vogel',
    label: 'Aproximación de Vogel',
    description: 'Penaliza filas y columnas con los mayores costos marginales.',
    tag: 'Mejor aproximación',
  },
] as const;

export interface LogEntry {
  id: string;
  message: string;
  tone: 'neutral' | 'info' | 'success' | 'error' | 'ai';
  timestamp: number;
}

export interface BalanceState {
  totalOffers: number;
  totalDemands: number;
  isBalanced: boolean;
  delta: number;
}

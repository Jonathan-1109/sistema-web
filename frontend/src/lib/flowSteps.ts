import type { FlowStep } from '@/types/domain';

export interface StepAccessOptions {
  hasResult: boolean;
}

export function buildStepAccess({ hasResult }: StepAccessOptions): Record<FlowStep, boolean> {
  return {
    datos: true,
    resultado: hasResult,
  };
}

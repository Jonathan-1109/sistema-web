import { apiPost } from '@/api/client';
import type { ChainPayload, ChainResponse } from '@/types/api';
import type { TransportMethod } from '@/types/domain';

export function solveTransport(
  method: TransportMethod,
  payload: ChainPayload,
): Promise<ChainResponse> {
  return apiPost<ChainResponse, ChainPayload>(`/transport/${method}`, payload);
}

import { apiPost } from '@/api/client';
import type { ManagementPayload, ManagementResponse } from '@/types/api';

export function solveAssignment(payload: ManagementPayload): Promise<ManagementResponse> {
  return apiPost<ManagementResponse, ManagementPayload>('/assignment/', payload);
}

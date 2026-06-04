import { apiPost } from '@/api/client';
import type {
  GroqResponse,
  GroqPayload,
} from '@/types/api';

export function requestConclusion(payload: GroqPayload, id: string): Promise<GroqResponse> {
  return apiPost<GroqResponse, GroqPayload>(`/groq/${id}`, payload);
}

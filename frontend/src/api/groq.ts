import { apiPost } from '@/api/client';
import type {
  GroqHungarianPayload,
  GroqResponse,
  GroqTransportPayload,
} from '@/types/api';

export function requestTransportConclusion(
  payload: GroqTransportPayload,
): Promise<GroqResponse> {
  return apiPost<GroqResponse, GroqTransportPayload>('/groq/', payload);
}

export function requestHungarianConclusion(
  payload: GroqHungarianPayload,
): Promise<GroqResponse> {
  return apiPost<GroqResponse, GroqHungarianPayload>('/groq/hungarian', payload);
}

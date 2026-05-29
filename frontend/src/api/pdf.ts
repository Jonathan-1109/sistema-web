import { apiPostBlob } from '@/api/client';
import { downloadBlob } from '@/lib/download';
import type { HungarianPdfPayload, TransportPdfPayload } from '@/types/api';

export async function downloadTransportPdf(payload: TransportPdfPayload): Promise<void> {
  const { blob, filename } = await apiPostBlob('/pdf/', payload);
  downloadBlob(blob, filename);
}

export async function downloadHungarianPdf(payload: HungarianPdfPayload): Promise<void> {
  const { blob, filename } = await apiPostBlob('/pdf/hungarian', payload);
  downloadBlob(blob, filename);
}

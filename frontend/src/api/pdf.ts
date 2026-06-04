import { apiPostBlob } from '@/api/client';
import { downloadBlob } from '@/lib/download';

export async function downloadPDF(id: string): Promise<void> {
  const { blob, filename } = await apiPostBlob(`/pdf/${id}`);
  downloadBlob(blob, filename);
}
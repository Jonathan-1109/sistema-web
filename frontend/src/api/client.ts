import type { ApiErrorBody } from '@/types/api';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE = '/api';

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.detail ?? `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await parseError(response);
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<TResponse>;
}

export async function apiPostBlob<TBody>(
  path: string,
  body: TBody,
): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await parseError(response);
    throw new ApiError(message, response.status);
  }

  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition');
  const fallback = path.includes('hungarian') ? 'Reporte_Asignacion.pdf' : 'Reporte_Transporte.pdf';
  const filename =
    disposition?.match(/filename="?([^";\n]+)"?/)?.[1]?.trim() ?? fallback;

  return { blob, filename };
}

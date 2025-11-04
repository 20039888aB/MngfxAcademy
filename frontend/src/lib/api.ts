export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

interface RequestOptions {
  method?: HttpMethod;
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', token, body, headers } = options;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'API request failed');
  }

  return response.json();
}

export async function apiGet<T>(path: string, token?: string) {
  return apiRequest<T>(path, { method: 'GET', token });
}

export async function apiPost<T>(path: string, payload: unknown, token?: string) {
  return apiRequest<T>(path, { method: 'POST', body: payload, token });
}


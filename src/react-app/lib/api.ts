/**
 * Central API client: checks response.ok, handles 401, returns typed JSON.
 * Use for all fetch calls to avoid setting error response bodies as state.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public body?: { error?: string } & Record<string, unknown>
  ) {
    super(body?.error ?? `Request failed with status ${status}`);
    this.name = "ApiError";
  }
}

type ApiOptions = {
  on401?: () => void;
};

async function handleResponse<T>(res: Response, options?: ApiOptions): Promise<T> {
  if (res.status === 401 && options?.on401) {
    options.on401();
    throw new ApiError(401, { error: "Unauthorized" });
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new ApiError(res.status, body);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string, options?: ApiOptions): Promise<T> {
  const res = await fetch(path, { credentials: "include" });
  return handleResponse<T>(res, options);
}

export async function apiPost<T>(path: string, body: unknown, options?: ApiOptions): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res, options);
}

export async function apiPut<T>(path: string, body: unknown, options?: ApiOptions): Promise<T> {
  const res = await fetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res, options);
}

export async function apiDelete(path: string, options?: ApiOptions): Promise<void> {
  const res = await fetch(path, { method: "DELETE", credentials: "include" });
  return handleResponse<void>(res, options);
}

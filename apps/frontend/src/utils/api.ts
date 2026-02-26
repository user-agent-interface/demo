const API_BASE_URL = import.meta.env.VITE_UAI_DB_API_HOST_URL as string;

/** GET request; for use with SWR */
export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }
  return response.json();
};

/** POST request with JSON body */
export const poster = async <T = unknown>(
  url: string,
  body: unknown
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string })?.error ?? `Request failed: ${response.status}`
    );
  }
  return response.json();
};

// Generic fetcher function for SWR
export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const apiUrl = import.meta.env.VITE_UAI_DB_API_HOST_URL;
  const response = await fetch(`${apiUrl}${url}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }
  return response.json();
};

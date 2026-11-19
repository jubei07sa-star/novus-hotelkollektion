export const phpBackend = process.env.NEXT_PUBLIC_BACKEND === "php";
export function apiUrl(endpoint: string) {
  const names: Record<string, string> = { "demo-menu": "menu", "menu-pdf": "pdf" };
  return phpBackend ? `/api/index.php?endpoint=${names[endpoint] || endpoint}` : `/api/${endpoint}`;
}
export function apiQuery(endpoint: string, query: string) {
  return apiUrl(endpoint) + (phpBackend ? "&" : "?") + query;
}
export async function apiFetch(endpoint: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (phpBackend && init.method && !["GET", "HEAD"].includes(init.method)) {
    const session = await fetch(apiUrl("session"), { cache: "no-store", credentials: "same-origin" });
    if (!session.ok) throw new Error("Die Sitzung konnte nicht geladen werden.");
    const data = await session.json();
    headers.set("X-CSRF-Token", data.csrf);
  }
  return fetch(endpoint.startsWith("/") ? endpoint : apiUrl(endpoint), { ...init, headers, credentials: "same-origin" });
}

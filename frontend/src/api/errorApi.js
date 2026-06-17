const BASE = import.meta.env.VITE_API_URL || '';

async function handleResponse(r) {
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${r.status} ${r.statusText}`);
  }
  if (r.status === 204) return null;
  return r.json();
}

export const analyzeError = (payload) =>
  fetch(`${BASE}/api/errors/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const getDiary = (page = 0, tag, language) => {
  const params = new URLSearchParams({ page, size: 20 });
  if (tag) params.append('tag', tag);
  if (language) params.append('language', language);
  return fetch(`${BASE}/api/errors/diary?${params}`).then(handleResponse);
};

export const getEntry = (id) =>
  fetch(`${BASE}/api/errors/diary/${id}`).then(handleResponse);

export const searchErrors = (q, language) => {
  const params = new URLSearchParams({ q });
  if (language) params.append('language', language);
  return fetch(`${BASE}/api/errors/search?${params}`).then(handleResponse);
};

export const deleteEntry = (id) =>
  fetch(`${BASE}/api/errors/diary/${id}`, { method: 'DELETE' }).then(handleResponse);

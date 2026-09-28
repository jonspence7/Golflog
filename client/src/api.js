const BASE = "/api/courses";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  list: () => fetch(BASE).then(handle),
  insertAt: (course) =>
    fetch(`${BASE}/insert-at`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    }).then(handle),
  update: (id, course) =>
    fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    }).then(handle),
  move: (id, rank) =>
    fetch(`${BASE}/${id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rank }),
    }).then(handle),
  remove: (id) => fetch(`${BASE}/${id}`, { method: "DELETE" }).then(handle),
};

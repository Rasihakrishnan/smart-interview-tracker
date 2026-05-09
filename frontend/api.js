/* =====================================================
   api.js  — single place for all backend calls.
   Backend: Spring Boot @ http://localhost:8080
   ===================================================== */
const BASE = "http://localhost:8080";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}

/* ---------- Auth ---------- */
function apiRegister(name, email, password) {
  return fetch(BASE + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, email: email, password: password })
  }).then(handle);
}

function apiLogin(email, password) {
  return fetch(BASE + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password })
  }).then(handle);
}

/* ---------- Problems ---------- */
function apiAddProblem(p) {
  let body = {
    title: p.title,
    difficulty: p.difficulty,
    topic: p.topic,
    status: p.status,
    user: { id: Number(p.userId) }
  };
  return fetch(BASE + "/problems/addproblem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(handle);
}

function apiGetProblems(userId) {
  return fetch(BASE + "/problems/problems/" + userId).then(handle);
}

function apiUpdateStatus(id, status) {
  return fetch(BASE + "/problems/" + id + "?status=" + encodeURIComponent(status), {
    method: "PUT"
  }).then(handle);
}

function apiDeleteProblem(id) {
  return fetch(BASE + "/problems/" + id, { method: "DELETE" }).then(handle);
}

function apiGetStats(userId) {
  return fetch(BASE + "/problems/stats/" + userId).then(handle);
}

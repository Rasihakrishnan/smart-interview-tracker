/* =====================================================
   common.js  — navbar, toasts, helpers
   Runs on every page (after auth.js).
   ===================================================== */

/* ---------- Navbar (renders into #app-navbar) ---------- */
function renderNavbar(activeKey) {
  const host = document.getElementById("app-navbar");
  if (!host) return;

  const user = getUser();
  const link = (href, key, label) =>
    `<a class="nav-link ${activeKey === key ? "active" : ""}" href="${href}">${label}</a>`;

  let links = "";
  if (user) {
    links =
      link("dashboard.html", "dashboard", "Dashboard") +
      link("problems.html", "problems", "Problems") +
      link("analytics.html", "analytics", "Analytics") +
      link("topics.html", "topics", "Topics") +
      link("recommendations.html", "tips", "Tips") +
      link("profile.html", "profile", "Profile") +
      `<button class="nav-cta" id="nav-logout">Logout</button>`;
  } else {
    links =
      link("index.html", "home", "Home") +
      link("login.html", "login", "Login") +
      `<a class="nav-cta" href="register.html">Get started</a>`;
  }

  host.innerHTML = `
    <header class="navbar">
      <div class="nav-inner">
        <a class="brand" href="${user ? "dashboard.html" : "index.html"}">
          <span class="brand-mark">SI</span>
          <span>Smart Interview Tracker</span>
        </a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">&#9776;</button>
        <nav class="nav-links" id="nav-links">${links}</nav>
      </div>
    </header>
  `;

  const toggle = document.getElementById("nav-toggle");
  const list = document.getElementById("nav-links");
  if (toggle && list) {
    toggle.addEventListener("click", () => list.classList.toggle("open"));
  }
  const lo = document.getElementById("nav-logout");
  if (lo) lo.addEventListener("click", logout);
}

/* ---------- Footer ---------- */
function renderFooter() {
  const host = document.getElementById("app-footer");
  if (!host) return;
  host.innerHTML = `
    <footer class="footer">
      Built for placement-ready interview prep &middot;
      &copy; ${new Date().getFullYear()} Smart Interview Tracker
    </footer>
  `;
}

/* ---------- Toasts ---------- */
function ensureToastHost() {
  let host = document.getElementById("toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "toast-host";
    host.className = "toast-host";
    document.body.appendChild(host);
  }
  return host;
}
function toast(msg, type) {
  const host = ensureToastHost();
  const el = document.createElement("div");
  el.className = "toast toast-" + (type || "info");
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 300);
  }, 2700);
}

/* ---------- Helpers ---------- */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function difficultyBadge(d) {
  const k = (d || "").toLowerCase();
  if (k === "easy")   return `<span class="badge badge-easy">Easy</span>`;
  if (k === "medium") return `<span class="badge badge-medium">Medium</span>`;
  if (k === "hard")   return `<span class="badge badge-hard">Hard</span>`;
  return `<span class="badge badge-unsolved">${escapeHtml(d || "—")}</span>`;
}

function statusBadge(s) {
  const k = (s || "").toLowerCase();
  if (k === "solved") return `<span class="badge badge-solved">Solved</span>`;
  return `<span class="badge badge-unsolved">${escapeHtml(s || "Unsolved")}</span>`;
}

function getQueryParam(name) {
  const p = new URLSearchParams(window.location.search);
  return p.get(name);
}

/* Auto-bootstrap navbar/footer when present */
document.addEventListener("DOMContentLoaded", () => {
  const active = document.body.dataset.page || "";
  renderNavbar(active);
  renderFooter();
});

/* dashboard.js — overview, stats, recommendation, recent list */
(function () {
  if (!requireAuth()) return;

  document.addEventListener("DOMContentLoaded", async () => {
    const user = getUser();
    document.getElementById("welcome-title").textContent =
      "Welcome back, " + (user.name || "friend") + "!";

    await Promise.all([loadStats(user.id), loadRecent(user.id)]);
  });

  async function loadStats(userId) {
    try {
      const stats = await apiGetStats(userId);
      const total = (stats.totalSolved || 0) + (stats.totalUnsolved || 0);
      document.getElementById("s-total").textContent = total;
      document.getElementById("s-solved").textContent = stats.totalSolved || 0;
      document.getElementById("s-unsolved").textContent = stats.totalUnsolved || 0;
      document.getElementById("s-topics").textContent =
        Object.keys(stats.topics || {}).length;

      document.getElementById("d-easy").textContent = stats.easy || 0;
      document.getElementById("d-medium").textContent = stats.medium || 0;
      document.getElementById("d-hard").textContent = stats.hard || 0;

      const rec = stats.recommendation
        ? stats.recommendation
        : "Add a few problems to get a personalised recommendation.";
      document.getElementById("recommend-text").textContent = rec;
    } catch (e) {
      document.getElementById("recommend-text").textContent =
        "Couldn't load stats. Make sure your backend is running on http://localhost:8080.";
    }
  }

  async function loadRecent(userId) {
    const host = document.getElementById("recent-list");
    try {
      const list = await apiGetProblems(userId);
      if (!list || list.length === 0) {
        host.innerHTML =
          '<div class="empty"><h3>No problems yet</h3><p>Add your first one to get started.</p></div>';
        return;
      }
      // Show last 5 (assuming larger ID = more recent)
      const recent = list.slice().sort((a, b) => b.id - a.id).slice(0, 5);
      host.innerHTML = recent
        .map(
          (p) => `
        <div class="mini-item">
          <span>
            <a href="problem-detail.html?id=${p.id}" style="color:var(--c-text);font-weight:500">${escapeHtml(p.title)}</a>
            <span style="color:var(--c-text-muted);font-size:12px;margin-left:8px">${escapeHtml(p.topic || "")}</span>
          </span>
          <span style="display:flex;gap:6px;align-items:center">
            ${difficultyBadge(p.difficulty)}
            ${statusBadge(p.status)}
          </span>
        </div>`
        )
        .join("");
    } catch (e) {
      host.innerHTML =
        '<div class="empty"><h3>Could not load problems</h3><p>Check your backend connection.</p></div>';
    }
  }
})();

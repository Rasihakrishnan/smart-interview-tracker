/* recommendations.js — personal recommendation + weakest topics */
(function () {
  if (!requireAuth()) return;

  document.addEventListener("DOMContentLoaded", async () => {
    const userId = getUser().id;
    const personalEl = document.getElementById("personal-rec");
    const weakHost = document.getElementById("weak-host");

    try {
      const [stats, list] = await Promise.all([
        apiGetStats(userId),
        apiGetProblems(userId)
      ]);

      personalEl.textContent =
        stats && stats.recommendation
          ? stats.recommendation
          : "Add at least 3–5 problems to unlock a personalised recommendation.";

      // Compute weakest topics from problems list
      if (!list || list.length === 0) {
        weakHost.innerHTML =
          '<div class="empty" style="grid-column:1/-1"><h3>Nothing to suggest yet</h3><p>Track a few problems first.</p></div>';
        return;
      }

      const groups = {};
      list.forEach((p) => {
        const t = p.topic || "Uncategorised";
        if (!groups[t]) groups[t] = { total: 0, solved: 0 };
        groups[t].total++;
        if ((p.status || "").toLowerCase() === "solved") groups[t].solved++;
      });

      // Sort by lowest solve-rate, then by attempted count desc
      const ranked = Object.entries(groups)
        .map(([topic, g]) => ({
          topic,
          total: g.total,
          solved: g.solved,
          rate: g.total ? g.solved / g.total : 0
        }))
        .sort((a, b) => a.rate - b.rate || b.total - a.total)
        .slice(0, 6);

      weakHost.innerHTML = ranked
        .map((r) => {
          const pct = Math.round(r.rate * 100);
          return `
            <div class="topic-card">
              <h4>${escapeHtml(r.topic)}</h4>
              <div class="meta">${r.solved}/${r.total} solved &middot; ${pct}% mastery</div>
              <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
              <p style="margin-top:12px;font-size:13px;color:var(--c-text-muted)">
                Pick 2–3 fresh problems on <b>${escapeHtml(r.topic)}</b> this week.
              </p>
            </div>`;
        })
        .join("");
    } catch (e) {
      personalEl.textContent =
        "Couldn't load recommendation. Make sure the backend is running.";
      weakHost.innerHTML = "";
    }
  });
})();

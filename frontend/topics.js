/* topics.js — group user's problems by topic with progress bars */
(function () {
  if (!requireAuth()) return;

  document.addEventListener("DOMContentLoaded", async () => {
    const host = document.getElementById("topic-host");
    try {
      const list = await apiGetProblems(getUser().id);
      if (!list || list.length === 0) {
        host.innerHTML =
          '<div class="empty"><h3>No topics yet</h3><p>Add a few problems and they\'ll be grouped here.</p></div>';
        return;
      }

      const groups = {};
      list.forEach((p) => {
        const t = p.topic || "Uncategorised";
        if (!groups[t]) groups[t] = { total: 0, solved: 0 };
        groups[t].total++;
        if ((p.status || "").toLowerCase() === "solved") groups[t].solved++;
      });

      const entries = Object.entries(groups).sort((a, b) => b[1].total - a[1].total);

      host.innerHTML =
        '<div class="topic-grid">' +
        entries
          .map(([topic, g]) => {
            const pct = g.total ? Math.round((g.solved / g.total) * 100) : 0;
            return `
              <div class="topic-card">
                <h4>${escapeHtml(topic)}</h4>
                <div class="meta">${g.solved} / ${g.total} solved &middot; ${pct}%</div>
                <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
              </div>`;
          })
          .join("") +
        "</div>";
    } catch (e) {
      host.innerHTML =
        '<div class="empty"><h3>Could not load topics</h3><p>Check your backend connection.</p></div>';
    }
  });
})();

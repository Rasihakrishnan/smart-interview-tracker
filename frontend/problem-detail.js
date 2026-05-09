/* problem-detail.js — single problem view (?id=...) */
(function () {
  if (!requireAuth()) return;

  document.addEventListener("DOMContentLoaded", async () => {
    const id = Number(getQueryParam("id"));
    const host = document.getElementById("detail-host");

    if (!id) {
      host.innerHTML =
        '<div class="empty"><h3>No problem selected</h3><p>Open a problem from the list to view its details.</p></div>';
      document.getElementById("p-title").textContent = "Problem";
      return;
    }

    try {
      const list = await apiGetProblems(getUser().id);
      const problem = (list || []).find((p) => Number(p.id) === id);

      if (!problem) {
        host.innerHTML =
          '<div class="empty"><h3>Problem not found</h3><p>It may have been deleted.</p></div>';
        return;
      }

      document.getElementById("p-title").textContent = problem.title;

      host.innerHTML = `
        <div class="detail-grid">
          <div class="card">
            <h3 style="color:var(--c-text);font-size:18px;margin-bottom:14px">${escapeHtml(problem.title)}</h3>
            <dl class="kv">
              <dt>Topic</dt>      <dd><span class="badge badge-topic">${escapeHtml(problem.topic || "—")}</span></dd>
              <dt>Difficulty</dt> <dd>${difficultyBadge(problem.difficulty)}</dd>
              <dt>Status</dt>     <dd>${statusBadge(problem.status)}</dd>
              <dt>Problem ID</dt> <dd>#${problem.id}</dd>
            </dl>
            <p style="margin-top:18px;color:var(--c-text-muted);font-size:14px;line-height:1.6">
              Use this view to focus on a single problem. Mark it solved when you've completed it,
              or remove it if you no longer want to track it.
            </p>
          </div>

          <div class="card">
            <h3 style="color:var(--c-text);font-size:16px;margin-bottom:14px">Actions</h3>
            <div style="display:flex;flex-direction:column;gap:10px">
              ${
                (problem.status || "").toLowerCase() === "solved"
                  ? `<button id="d-unsolve" class="btn btn-outline btn-block">Mark Unsolved</button>`
                  : `<button id="d-solve" class="btn btn-success btn-block">Mark Solved</button>`
              }
              <button id="d-delete" class="btn btn-danger btn-block">Delete problem</button>
              <a href="problems.html" class="btn btn-ghost btn-block">Back to all problems</a>
            </div>
          </div>
        </div>
      `;

      const sBtn = document.getElementById("d-solve");
      const uBtn = document.getElementById("d-unsolve");
      const dBtn = document.getElementById("d-delete");

      if (sBtn) sBtn.addEventListener("click", () => doStatus("Solved"));
      if (uBtn) uBtn.addEventListener("click", () => doStatus("Unsolved"));
      if (dBtn) dBtn.addEventListener("click", doDelete);

      async function doStatus(s) {
        try {
          await apiUpdateStatus(id, s);
          toast("Status updated", "success");
          setTimeout(() => location.reload(), 400);
        } catch (e) {
          toast("Update failed", "error");
        }
      }

      async function doDelete() {
        if (!confirm("Delete this problem? This cannot be undone.")) return;
        try {
          await apiDeleteProblem(id);
          toast("Problem deleted", "success");
          setTimeout(() => (window.location.href = "problems.html"), 500);
        } catch (e) {
          toast("Delete failed", "error");
        }
      }
    } catch (e) {
      host.innerHTML =
        '<div class="empty"><h3>Could not load problem</h3><p>Check your backend connection.</p></div>';
    }
  });
})();

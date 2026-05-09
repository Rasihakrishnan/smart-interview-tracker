/* problems.js — full list with search/filter/sort */
(function () {
  if (!requireAuth()) return;

  let allProblems = [];

  document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    loadAll(user.id);

    ["f-search", "f-difficulty", "f-status", "f-sort"].forEach((id) => {
      document.getElementById(id).addEventListener("input", render);
      document.getElementById(id).addEventListener("change", render);
    });
    document.getElementById("f-clear").addEventListener("click", () => {
      document.getElementById("f-search").value = "";
      document.getElementById("f-difficulty").value = "";
      document.getElementById("f-status").value = "";
      document.getElementById("f-sort").value = "recent";
      render();
    });
  });

  async function loadAll(userId) {
    try {
      const list = await apiGetProblems(userId);
      allProblems = Array.isArray(list) ? list : [];
      render();
    } catch (e) {
      document.getElementById("list-host").innerHTML =
        '<div class="empty"><h3>Could not load problems</h3><p>Check your backend connection.</p></div>';
    }
  }

  function render() {
    const host = document.getElementById("list-host");
    const q = document.getElementById("f-search").value.trim().toLowerCase();
    const fd = document.getElementById("f-difficulty").value;
    const fs = document.getElementById("f-status").value;
    const sortBy = document.getElementById("f-sort").value;

    let list = allProblems.slice();
    if (q) {
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.topic || "").toLowerCase().includes(q)
      );
    }
    if (fd) list = list.filter((p) => (p.difficulty || "") === fd);
    if (fs) list = list.filter((p) => (p.status || "") === fs);

    if (sortBy === "title") list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sortBy === "difficulty") {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      list.sort((a, b) => (order[a.difficulty] || 99) - (order[b.difficulty] || 99));
    } else if (sortBy === "topic") {
      list.sort((a, b) => (a.topic || "").localeCompare(b.topic || ""));
    } else {
      list.sort((a, b) => b.id - a.id);
    }

    if (list.length === 0) {
      host.innerHTML =
        '<div class="empty"><h3>No problems match your filters</h3><p>Try clearing them, or add a new problem.</p></div>';
      return;
    }

    host.innerHTML = `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list
              .map(
                (p) => `
              <tr>
                <td>
                  <a href="problem-detail.html?id=${p.id}" style="font-weight:500;color:var(--c-text)">
                    ${escapeHtml(p.title)}
                  </a>
                </td>
                <td><span class="badge badge-topic">${escapeHtml(p.topic || "—")}</span></td>
                <td>${difficultyBadge(p.difficulty)}</td>
                <td>${statusBadge(p.status)}</td>
                <td>
                  <div class="row-actions" style="justify-content:flex-end">
                    ${
                      (p.status || "").toLowerCase() === "solved"
                        ? `<button class="btn btn-sm btn-outline" data-act="unsolve" data-id="${p.id}">Mark Unsolved</button>`
                        : `<button class="btn btn-sm btn-success" data-act="solve" data-id="${p.id}">Mark Solved</button>`
                    }
                    <button class="btn btn-sm btn-danger" data-act="delete" data-id="${p.id}">Delete</button>
                  </div>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    host.querySelectorAll("button[data-act]").forEach((b) => {
      b.addEventListener("click", () => handleAction(b.dataset.act, Number(b.dataset.id)));
    });
  }

  async function handleAction(act, id) {
    const userId = getUser().id;
    try {
      if (act === "solve") {
        await apiUpdateStatus(id, "Solved");
        toast("Marked as solved", "success");
      } else if (act === "unsolve") {
        await apiUpdateStatus(id, "Unsolved");
        toast("Marked as unsolved", "success");
      } else if (act === "delete") {
        if (!confirm("Delete this problem? This cannot be undone.")) return;
        await apiDeleteProblem(id);
        toast("Problem deleted", "success");
      }
      const list = await apiGetProblems(userId);
      allProblems = Array.isArray(list) ? list : [];
      render();
    } catch (e) {
      toast("Action failed. Please try again.", "error");
    }
  }
})();

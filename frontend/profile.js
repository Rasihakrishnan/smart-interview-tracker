/* profile.js — shows account info + activity summary */
(function () {
  if (!requireAuth()) return;

  document.addEventListener("DOMContentLoaded", async () => {
    const user = getUser();

    document.getElementById("p-name").textContent = user.name || "User";
    document.getElementById("p-email").textContent = user.email || "—";
    document.getElementById("p-id").textContent = user.id;
    document.getElementById("p-avatar").textContent =
      (user.name || "U").trim().charAt(0).toUpperCase();

    document.getElementById("btn-logout").addEventListener("click", logout);

    try {
      const stats = await apiGetStats(user.id);
      const solved = stats.totalSolved || 0;
      const unsolved = stats.totalUnsolved || 0;
      const total = solved + unsolved;
      const rate = total > 0 ? Math.round((solved / total) * 100) + "%" : "0%";

      document.getElementById("pf-total").textContent = total;
      document.getElementById("pf-solved").textContent = solved;
      document.getElementById("pf-rate").textContent = rate;
      document.getElementById("pf-topics").textContent = Object.keys(stats.topics || {}).length;
    } catch (e) {
      toast("Couldn't load activity stats.", "error");
    }
  });
})();

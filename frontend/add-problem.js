/* add-problem.js — handles new problem form */
(function () {
  if (!requireAuth()) return;

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-form");
    const errorBox = document.getElementById("add-error");
    const btn = document.getElementById("add-btn");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.classList.add("hidden");

      const title = document.getElementById("title").value.trim();
      const topic = document.getElementById("topic").value.trim();
      const difficulty = document.getElementById("difficulty").value;
      const status = document.getElementById("status").value;

      if (!title || !topic || !difficulty || !status) {
        errorBox.textContent = "All fields are required.";
        errorBox.classList.remove("hidden");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Saving…";

      try {
        await apiAddProblem({
          title: title,
          topic: topic,
          difficulty: difficulty,
          status: status,
          userId: getUser().id
        });
        toast("Problem added!", "success");
        setTimeout(() => (window.location.href = "problems.html"), 500);
      } catch (err) {
        errorBox.textContent = "Could not save the problem. Please try again.";
        errorBox.classList.remove("hidden");
        btn.disabled = false;
        btn.textContent = "Save problem";
      }
    });
  });
})();

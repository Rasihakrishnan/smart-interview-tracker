/* register.js — handles registration form */
(function () {
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");
    const errorBox = document.getElementById("register-error");
    const btn = document.getElementById("register-btn");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.classList.add("hidden");

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!name || !email || !password) {
        errorBox.textContent = "All fields are required.";
        errorBox.classList.remove("hidden");
        return;
      }
      if (password.length < 4) {
        errorBox.textContent = "Password must be at least 4 characters.";
        errorBox.classList.remove("hidden");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Creating account…";

      try {
        await apiRegister(name, email, password);
        toast("Account created! Please sign in.", "success");
        setTimeout(() => (window.location.href = "login.html"), 600);
      } catch (err) {
        errorBox.textContent =
          "Could not register. The email might already be in use.";
        errorBox.classList.remove("hidden");
        btn.disabled = false;
        btn.textContent = "Create account";
      }
    });
  });
})();

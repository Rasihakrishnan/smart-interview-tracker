/* login.js — handles sign-in form */
(function () {
  // If already logged in, send to dashboard
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const errorBox = document.getElementById("login-error");
    const btn = document.getElementById("login-btn");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.classList.add("hidden");

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        errorBox.textContent = "Please enter both email and password.";
        errorBox.classList.remove("hidden");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Signing in…";

      try {
        const user = await apiLogin(email, password);
        if (!user || !user.id) {
          throw new Error("Invalid credentials");
        }
        saveUser(user);
        toast("Welcome back, " + (user.name || "friend") + "!", "success");
        setTimeout(() => (window.location.href = "dashboard.html"), 400);
      } catch (err) {
        errorBox.textContent = "Invalid email or password. Please try again.";
        errorBox.classList.remove("hidden");
        btn.disabled = false;
        btn.textContent = "Sign in";
      }
    });
  });
})();

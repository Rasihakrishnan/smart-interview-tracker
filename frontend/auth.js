/* =====================================================
   auth.js  — auth helpers + page guards
   ===================================================== */
const AUTH_KEY = "sit.user";

function saveUser(user) {
  // Only keep what we need; never keep password
  const safe = { id: user.id, name: user.name || "", email: user.email || "" };
  localStorage.setItem(AUTH_KEY, JSON.stringify(safe));
}

function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

function isLoggedIn() {
  const u = getUser();
  return !!(u && u.id);
}

/* Guards
   - requireAuth: redirect to login.html if not logged in
   - requireGuest: redirect to dashboard.html if already logged in
*/
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function requireGuest() {
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
    return false;
  }
  return true;
}

function logout() {
  clearUser();
  window.location.href = "login.html";
}

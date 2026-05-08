# Smart Interview Preparation Tracker — Frontend (HTML/CSS/JS)

A clean, professional, fully-responsive **plain HTML / CSS / JavaScript** frontend
for the Spring Boot "Smart Interview Preparation Tracker" backend. **No frameworks,
no build tools.** Just open `index.html` (or serve the folder) and go.

## Pages (12)
1. `index.html` — Landing
2. `register.html` — Sign up
3. `login.html` — Sign in
4. `dashboard.html` — Overview + recommendation
5. `problems.html` — All problems (search, filter, sort)
6. `add-problem.html` — Add a problem
7. `problem-detail.html` — Single problem view (`?id=1`)
8. `analytics.html` — Charts (Chart.js)
9. `topics.html` — Topic-wise progress
10. `recommendations.html` — Personalised tips
11. `profile.html` — Profile + logout
12. `404.html` — Not found

## Backend
Make sure your Spring Boot backend is running on **`http://localhost:8080`**
(URL is set in `js/api.js`). CORS is already enabled in your controllers.

## Run
Just open `index.html` in a browser, or serve the folder, e.g.:
```
python3 -m http.server 5500
```
Then visit http://localhost:5500

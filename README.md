# Smart Interview Preparation Tracker

A full-stack web application designed to help users manage coding interview preparation efficiently. The project features a professional frontend with multiple responsive pages, analytics dashboards, problem tracking, topic-wise progress monitoring, and REST API integration using Spring Boot.

---

## Features

* User Registration & Login
* Add Problems
* Problem Details View
* Dashboard Analytics
* Topic-wise Tracking
* Recommendations Section
* User Profile Management
* Search & Filter Functionality
* Interactive Charts using Chart.js
* Responsive Modern UI

---

## Frontend Structure

```bash id="d3m7v1"
frontend/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── add-problem.html
├── problems.html
├── problem-detail.html
├── analytics.html
├── topics.html
├── recommendations.html
├── profile.html
│
├── css/
│   ├── style.css
│   └── pages.css
│
├── js/
│   ├── auth.js
│   ├── dashboard.js
│   ├── analytics.js
│   ├── problems.js
│   ├── profile.js
│   ├── topics.js
│   ├── recommendations.js
│   └── utils.js
│
└── assets/
```

---

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Chart.js

### Backend

* Spring Boot
* Java
* REST APIs

### Database

* MySQL

---

## API Endpoints

### Authentication

* POST `/auth/register`
* POST `/auth/login`

### Problem Management

* GET `/problems/problems/{userId}`
* GET `/problems/stats/{userId}`
* POST `/problems/addproblem`
* PUT `/problems/{id}?status=Solved`
* DELETE `/problems/{id}`

---

## Project Highlights

* Fully Responsive Design
* Modular Frontend Architecture
* REST API Integration
* Dashboard Visualization
* Modern UI/UX
* Clean Project Structure
* Beginner Friendly Full Stack Project

---

## Author

Rasiha Krishnan

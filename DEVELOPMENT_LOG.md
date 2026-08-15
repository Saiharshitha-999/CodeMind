# CodeMind Development Log 🧠

This document records the development journey, technical decisions, challenges, and lessons learned while building CodeMind.

---

## Day 1 — Project Setup & Frontend-Backend Connection

### 🎯 Goal

Set up the basic CodeMind architecture and establish communication between the React frontend and Flask backend.

### 🛠️ Built

* Created CodeMind project structure
* Set up Python virtual environment
* Created Flask backend
* Created React frontend using Vite
* Configured ESLint
* Created `/api/health` API endpoint
* Connected React frontend to Flask backend
* Successfully displayed the Flask response in React

### 🧠 What I Learned

* What an API is
* What an API endpoint is
* How Flask creates API endpoints
* HTTP request and response
* How React uses `fetch()`
* How JSON responses are handled
* How frontend and backend communicate

### 🏗️ Current Architecture

```text
React Frontend
      ↓
   HTTP Request
      ↓
Flask API
      ↓
   JSON Response
      ↓
React Frontend
```

### 🐛 Challenges

* Initially encountered an npm `ENOENT` error because the React project was not properly initialized.
* Learned how to create a React project using Vite.
* Initially initialized Git in the wrong directory and learned how to correctly initialize Git inside the CodeMind project.
* Learned how to connect a local Git repository to GitHub.

### 📌 Current Status

* ✅ React frontend working
* ✅ Flask backend working
* ✅ API working
* ✅ React ↔ Flask communication working
* ✅ CodeMind uploaded to GitHub

### 🔜 Next

* Connect PostgreSQL
* Learn SQLAlchemy
* Design the CodeMind database
* Create the Submission model
* Build the first submission API

---

## Day 2 — PostgreSQL & Submission API

### 🎯 Goal

Connect CodeMind's Flask backend to PostgreSQL and create the first API for storing coding submissions.

### 🛠️ Built

* Installed PostgreSQL and pgAdmin
* Created the `codemind` database
* Installed Flask-SQLAlchemy
* Installed psycopg2-binary
* Installed python-dotenv
* Configured environment variables using `.env`
* Connected Flask to PostgreSQL through SQLAlchemy
* Created the `Submission` database model
* Created the `submissions` table
* Created `POST /api/submissions`
* Tested saving a coding submission through the API

### 🧠 What I Learned

* How Flask connects to PostgreSQL
* What SQLAlchemy does
* What an ORM is
* How Python classes can represent database tables
* How POST APIs receive JSON data
* How `db.session.add()` and `db.session.commit()` save data
* How to debug Flask API errors

### 🏗️ Current Architecture

```text
React
   ↓
Flask API
   ↓
SQLAlchemy
   ↓
PostgreSQL
   ↓
submissions table
```

### 🐛 Challenges

* Initially received a database connection error because the `codemind` database had not been created.
* Encountered a `TypeError` while creating the `Submission` object and fixed it by using keyword arguments.
* Learned how to read Flask traceback messages to locate backend errors.

### 📌 Current Status

* ✅ PostgreSQL connected
* ✅ Database created
* ✅ Submission model created
* ✅ Submission table created
* ✅ POST submission API working

### 🔜 Next

* Create `GET /api/submissions`
* Connect the React frontend to the submission API
* Display stored submissions in the CodeMind frontend


## Day 3 — React Submission Integration

### 🎯 Goal

Connect the React frontend to the Flask submission APIs and create a complete frontend-backend-database flow.

### 🛠️ Built

- Created a React submission form
- Added React state using `useState`
- Added form submission handling using `onSubmit`
- Connected React to the Flask POST `/api/submissions` endpoint
- Sent submission data as JSON using `fetch()`
- Added CORS support to Flask
- Connected React to the GET `/api/submissions` endpoint
- Retrieved stored submissions from PostgreSQL
- Displayed submission history in the React frontend
- Refreshed submission history after creating a new submission

### 🧠 What I Learned

- How React state stores form values
- How `onChange` updates React state
- How `onSubmit` triggers a form submission handler
- How `async` and `await` work with API requests
- How `fetch()` sends HTTP requests
- Difference between GET and POST
- How JSON travels between React and Flask
- `JSON.stringify()` for converting JavaScript objects to JSON
- `response.json()` for reading JSON responses
- How Flask receives JSON using `request.get_json()`
- How React receives and displays API responses
- How `.map()` is used to display a list of submissions
- How frontend and backend communicate with CORS

### 🏗️ Current Architecture

React Frontend
      ↓
HTTP Request
      ↓
Flask API
      ↓
SQLAlchemy
      ↓
PostgreSQL
      ↓
JSON Response
      ↓
React Frontend
      ↓
Submission History

### 🐛 Challenges

- Encountered a `405 Method Not Allowed` error while connecting the React POST request.
- Identified that the POST route URL and HTTP method needed to match the React request.
- Learned that GET and POST can use the same URL because the HTTP method distinguishes the operation.
- Fixed the placement and naming of the `fetchSubmissions()` function in React.

### 📌 Current Status

✅ React submission form working  
✅ POST submission API working  
✅ PostgreSQL storing submissions  
✅ GET submissions API working  
✅ Submission history displayed in React  
✅ React ↔ Flask ↔ PostgreSQL flow working

### 🔜 Next

- Add DELETE submission functionality
- Introduce the DELETE HTTP method
- Complete the basic CRUD foundation
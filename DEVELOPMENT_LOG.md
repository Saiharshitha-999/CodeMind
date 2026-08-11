# CodeMind Development Log 🧠

This document records the development journey, technical decisions, challenges and lessons learned while building CodeMind.

---

## Day 1 — Project Setup & Frontend-Backend Connection

### 🎯 Goal

Set up the basic CodeMind architecture and establish communication between the React frontend and Flask backend.

### 🛠️ Built

- Created CodeMind project structure
- Set up Python virtual environment
- Created Flask backend
- Created React frontend using Vite
- Configured ESLint
- Created `/api/health` API endpoint
- Connected React frontend to Flask backend
- Successfully displayed the Flask response in React

### 🧠 What I Learned

- What an API is
- What an API endpoint is
- How Flask creates API endpoints
- HTTP request and response
- How React uses `fetch()`
- How JSON responses are handled
- How frontend and backend communicate

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

### 🐛 Challenges

- Initially encountered an npm `ENOENT` error because the React project was not properly initialized.
- Learned how to create a React project using Vite.
- Initially initialized Git in the wrong directory and learned how to correctly initialize Git inside the CodeMind project.
- Learned how to connect a local Git repository to GitHub.

### 📌 Current Status

✅ React frontend working  
✅ Flask backend working  
✅ API working  
✅ React ↔ Flask communication working  
✅ CodeMind uploaded to GitHub

### 🔜 Next

- Connect PostgreSQL
- Learn SQLAlchemy
- Design the CodeMind database
- Create the Submission model
- Build the first submission API
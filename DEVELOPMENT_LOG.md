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



## Day 4 — Submission Management & Timestamps

### 🎯 Goal

Improve the CodeMind submission system by adding submission deletion and timestamps, making the submission history more useful and closer to a real-world application.

### 🛠️ Built

- Added `DELETE /api/submissions/<id>` API endpoint
- Added submission deletion using SQLAlchemy
- Added Delete button to the React submission history
- Connected React to the DELETE API
- Refreshed submission history after deleting a submission
- Added `created_at` field to the `Submission` database model
- Automatically recorded the submission creation time
- Converted Python datetime values to ISO format before sending them as JSON
- Converted the timestamp into a JavaScript `Date` object in React
- Displayed the timestamp using `toLocaleString()`

### 🧠 What I Learned

- What the DELETE HTTP method is used for
- How URL parameters work using `/api/submissions/<id>`
- How Flask captures an ID using `<int:id>`
- How `Submission.query.get()` retrieves a database record
- How `db.session.delete()` removes a record
- How React sends DELETE requests using `fetch()`
- How to refresh React state after deleting data
- Why database records need timestamps
- What a Python `datetime` object is
- Why Python datetime values need to be converted before being returned as JSON
- How `.isoformat()` converts a Python datetime into a standard string representation
- How `new Date()` converts the timestamp string into a JavaScript Date object
- How `.toLocaleString()` formats the date for display
- Why timezone information is important when working with timestamps

### 🔄 Date/Time Data Flow

```text
PostgreSQL
     ↓
Python datetime
     ↓
.isoformat()
     ↓
ISO timestamp string
     ↓
JSON response
     ↓
React
     ↓
new Date()
     ↓
JavaScript Date object
     ↓
.toLocaleString()
     ↓
Human-readable date/time

🏗️ Current Architecture
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

🐛 Challenges
Initially encountered confusion about why the same submissions endpoint can use different HTTP methods.
Learned that the URL and HTTP method together determine the API operation.
Encountered a 405 Method Not Allowed error while connecting the React POST request.
Fixed the mismatch between the React request and Flask route.
Encountered timezone differences while displaying submission timestamps.
Learned that UTC and local time must be handled carefully when transferring timestamps between the backend and frontend.
Learned how to debug API and database-related issues during development.

📌 Current Status

✅ React submission form working
✅ Flask backend working
✅ PostgreSQL connected
✅ SQLAlchemy working
✅ POST submission API working
✅ GET submissions API working
✅ DELETE submission API working
✅ Submission history displayed in React
✅ Delete functionality working
✅ Submission timestamps stored
✅ Submission timestamps displayed in React
✅ React ↔ Flask ↔ PostgreSQL flow working

🔜 Next
Improve the submission interface
Add submission details
Add better submission status handling
Begin building CodeMind's code analysis functionality
Start moving from basic CRUD functionality toward CodeMind's core AI-focused features

---

## Day 5 — Code Intelligence Foundation

### 🎯 Goal

Start building the actual intelligence layer of CodeMind by creating a code analysis pipeline that can understand the structure of submitted code.

### 🛠️ Built

- Created the `backend/analyzer/` module
- Created:
  - `parser.py`
  - `features.py`
  - `complexity.py`
  - `analyzer.py`
- Created the `/api/analyze` POST endpoint
- Connected Flask to the analyzer module
- Implemented Python source-code parsing using Python's built-in `ast` module
- Generated an Abstract Syntax Tree (AST) from submitted Python code
- Implemented AST traversal using recursive node visiting
- Implemented basic feature extraction from the AST
- Added detection for:
  - Number of loops
  - Number of conditionals
  - Number of functions
  - Maximum loop depth
  - Recursion
- Connected the parser → AST → feature extraction → Flask API pipeline
- Tested the `/api/analyze` endpoint successfully using PowerShell

### 🧠 What I Learned

- What a parser does
- What an Abstract Syntax Tree (AST) is
- How a parser converts source code into an AST
- How AST nodes represent program structures
- How to traverse an AST recursively
- How `isinstance()` identifies different AST node types
- How `ast.iter_child_nodes()` moves through the AST
- How to detect loops and conditionals from AST nodes
- How loop depth can be calculated from nested AST nodes
- How recursion can be detected by comparing a function's name with function calls inside it
- How a parser, feature extractor and analyzer can be separated into different modules

### 🏗️ Current Architecture

```text
React / API Client
       ↓
POST /api/analyze
       ↓
Flask
       ↓
analyzer.py
       ↓
parser.py
       ↓
Python AST
       ↓
features.py
       ↓
Feature Extraction
       ↓
JSON Response

📊 Current Analysis Output

The analyzer can currently produce information such as:

{
  "language": "Python",
  "features": {
    "loops": 1,
    "conditionals": 1,
    "functions": 0,
    "max_loop_depth": 1,
    "recursion": false
  }
}

🐛 Challenges
Initially confused about the relationship between a parser and an AST.
Learned that the parser creates the AST, while the analyzer uses the AST to extract useful information.
Initially found recursive AST traversal and ast.iter_child_nodes() difficult to understand.
Understood how visit() recursively walks through the AST.
Designed the analysis layer with future multi-language support in mind instead of making the system Python-only.
📌 Current Status

✅ Analyzer module created
✅ /api/analyze API created
✅ Python AST parsing working
✅ AST feature extraction working
✅ Loop detection working
✅ Conditional detection working
✅ Function detection working
✅ Loop-depth detection working
✅ Recursion detection implemented
✅ Flask → Analyzer → AST → Features pipeline working
✅ API tested successfully

🔜 Next
Improve the AST feature extraction
Build the complexity analysis engine
Detect time and space complexity
Detect algorithmic patterns
Design the multi-language parser architecture
Connect the analysis results to the React frontend
Later integrate ML/Transformer-based code understanding

---

## Day 6 — Complexity Analysis & Frontend Integration

### 🎯 Goal

Connect CodeMind's code analysis engine to the React frontend and generate initial time and space complexity insights from the extracted code features.

### 🛠️ Built

* Created the initial complexity analysis engine
* Implemented time complexity estimation based on maximum loop depth
* Implemented initial space complexity estimation using recursion information
* Connected `complexity.py` to the main analyzer
* Updated `/api/analyze` to return both code features and complexity information
* Tested complexity analysis using simple and nested-loop Python programs
* Connected the React frontend to the `/api/analyze` endpoint
* Added `analysis` state to the React application
* Added an `Analyze Code` action
* Sent the selected language and code from React to Flask
* Received analysis results from Flask and stored them in React state
* Displayed code analysis results in the frontend
* Displayed:
  * Time complexity
  * Space complexity
  * Number of loops
  * Number of conditionals
  * Number of functions
  * Maximum loop depth
  * Recursion detection
* Integrated the analysis results into the CodeMind frontend dashboard
* Kept submission, deletion, timestamp, and submission-history functionality working alongside the new analysis feature

### 🧠 What I Learned

* How a complexity analyzer can use extracted AST features
* How loop depth can be used as an initial heuristic for estimating time complexity
* How recursion can affect space complexity
* How one Flask API can combine results from multiple backend modules
* How React sends code to a Flask analysis endpoint
* How `useState` stores API analysis results
* How `fetch()` sends a POST request from React to Flask
* How `response.json()` converts the API response into a JavaScript object
* How `setAnalysis()` updates React state
* How conditional rendering can display analysis results only after analysis is completed
* How the frontend acts as a visualization layer for backend intelligence

### 🏗️ Current Architecture

```text
React Frontend
      ↓
Analyze Code
      ↓
POST /api/analyze
      ↓
Flask
      ↓
analyzer.py
      ↓
parser.py
      ↓
Python AST
      ↓
features.py
      ↓
Feature Extraction
      ↓
complexity.py
      ↓
Complexity Analysis
      ↓
JSON Response
      ↓
React State
      ↓
Code Analysis Dashboard

📊 Current Analysis Output

Example:

{
  "language": "Python",
  "features": {
    "loops": 2,
    "conditionals": 0,
    "functions": 0,
    "max_loop_depth": 2,
    "recursion": false
  },
  "complexity": {
    "time": "O(n^2)",
    "space": "O(1)"
  }
}

🐛 Challenges
Initially found it difficult to understand how the AST feature extractor works.
Learned how the visit() function recursively traverses the AST.
Initially confused about how loop depth is calculated.
Understood how nested loops increase the loop depth.
Initially made mistakes while connecting the React analysis function to the Flask API.
Fixed issues with the response.json() call and React analysis state.
Learned that the current complexity engine is a heuristic and cannot accurately determine the complexity of every possible program.
Learned that frontend code can be used as a visualization layer while the main intelligence remains in the backend.


📌 Current Status
✅ Python AST parser working
✅ Feature extraction working
✅ Loop detection working
✅ Conditional detection working
✅ Function detection working
✅ Loop-depth detection working
✅ Recursion detection working
✅ Complexity analyzer connected
✅ Time complexity estimation working
✅ Space complexity estimation working
✅ /api/analyze working
✅ React connected to analysis API
✅ Analysis results displayed in React
✅ Submission history working
✅ Delete functionality working
✅ Submission timestamps working
✅ React ↔ Flask ↔ PostgreSQL ↔ Analyzer flow working
⚠️ Current Limitation

The current complexity engine is a basic heuristic based mainly on loop depth and recursion.

For example, it does not yet understand:

Actual loop bounds
Different loop ranges
Sequential loops
Logarithmic loops
Data structure operations
Recursive recurrence relations
Algorithm-specific complexity patterns

Therefore, the current complexity result is an initial version and will be improved in future development.

🔜 Next
Improve the complexity analysis engine
Analyze actual loop bounds instead of only loop depth
Detect common algorithmic patterns
Improve space complexity analysis
Add multi-language parsing support
Improve code explanation
Build more intelligent code-quality insights
Continue improving the React analysis dashboard
Begin integrating ML/DL-based code understanding into CodeMind

---

##🧠 CodeMind — Day 7 Development Log
###🎯 Goal

Improve CodeMind's complexity-analysis foundation by making the AST analyzer understand loop bounds instead of relying only on maximum loop depth.

🛠️ Worked On
Extended the AST feature extractor with loop_details.
Learned how ast.For represents a for loop.
Learned how node.iter represents what a loop iterates over.
Learned how ast.Call represents function calls.
Learned how node.func represents the function being called.
Learned how ast.Name represents identifiers such as n, i, and range.
Detected range()-based loops.
Extracted the argument from range(...) using node.iter.args.
Added support for:
range(n)
range(10)
range(n * n)
range(n + 1)
range(n - 1)
range(n / 2) conceptually for asymptotic analysis
Used ast.Constant to extract constant values.
Used ast.BinOp to inspect expressions such as n * n.
Used range_arg.left and range_arg.right to inspect binary-operation operands.
Identified n * n as n².
Started adding loop depth to loop_details.
🧠 Important Concepts Learned

AST traversal:

Current Node
     ↓
ast.iter_child_nodes(node)
     ↓
Child Nodes
     ↓
visit(child)

Function-call structure:

      factorial(n - 1)
            ↓
      ast.Call
            ↓
      node.func
            ↓
      factorial
            ↓
      node.func.id
            ↓
      "factorial"

Loop structure:

      for i in range(n)
            ↓
      ast.For
            ↓
      node.iter
            ↓
      ast.Call
            ↓
      range
      🔥 Important Design Insight

We identified a major limitation of using only loop count/depth.

These two programs are different:

      for i in range(n):
      print(i)

      for j in range(n):
      print(j)

The loops are sequential:

   O(n) + O(n) = O(n)

Whereas:

for i in range(n):
    for j in range(n):
        print(i, j)

contains nested loops:

O(n) × O(n) = O(n²)

Therefore CodeMind must understand the relationship between loops, not simply count them.

### 📌 Current Complexity Engine

Current complexity.py still uses:

max_loop_depth
+
recursion

to produce a basic heuristic.

We deliberately did not replace it today.

The new loop information is being prepared so that the next complexity engine can reason about actual loop bounds and nesting.

###🏗️ Day 7 Architecture Progress
Source Code
     ↓
Python AST
     ↓
AST Traversal
     ↓
Loop Detection
     ↓
Loop Details
     ├── type
     ├── iterator
     ├── bound
     └── depth
     ↓
Future Complexity Engine V2


### ⚠️ Current Limitations
Complexity calculation is still heuristic.
Loop bounds are not yet fully generalized.
Sequential vs nested loop complexity has not yet been implemented.
while loop growth is not yet analyzed.
Complex mathematical expressions are not yet fully interpreted.
Multi-language parsing is not implemented yet.


### 🔜 Next — Day 8
Loop Details
     ↓
Identify loop relationships
     ↓
Sequential vs nested loops
     ↓
Combine complexities
     ↓
Complexity Engine V2
     ↓
Test with real DSA solutions
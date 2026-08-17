import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/submissions"
      );

      const data = await response.json();

      setSubmissions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/health")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data.status);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    fetchSubmissions();
  }, []);

  const deleteSubmission = async (id) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/submissions/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      fetchSubmissions();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/submissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem: problem,
            language: language,
            code: code,
            result: result,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        setMessage(data.message + " ID: " + data.id);
        fetchSubmissions();
      } else {
        setMessage("Failed to save submission");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to connect to backend");
    }
  };

  return (
    <div>
      <h1>CodeMind</h1>

      <p>{message}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Problem"
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        />

        <br />
        <br />

        <textarea
          placeholder="Enter your code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Result"
          value={result}
          onChange={(event) => setResult(event.target.value)}
        />

        <br />
        <br />

        <button type="submit">Submit</button>
      </form>

      <h2>Submission History</h2>

      {submissions.map((submission) => (
        <div key={submission.id}>
          <h3>{submission.problem}</h3>
          <p>Language: {submission.language}</p>
          <p>Result: {submission.result}</p>
          <pre>{submission.code}</pre>
          <p>
            Submitted: {new Date(submission.created_at).toLocaleString()}
          </p>
          <button onClick = {() => deleteSubmission(submission.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
 
const API_BASE = "http://127.0.0.1:5000";
 
// The complexity scale used to drive the dial + the space-complexity track.
// Order matters — index position maps directly to needle angle / marker position.
const COMPLEXITY_SCALE = [
  { key: "O(1)", label: "O(1)" },
  { key: "O(log n)", label: "O(log n)" },
  { key: "O(n)", label: "O(n)" },
  { key: "O(n log n)", label: "O(n log n)" },
  { key: "O(n\u00B2)", label: "O(n\u00B2)" },
  { key: "O(n\u00B3)", label: "O(n\u00B3)" },
  { key: "O(2\u207F)", label: "O(2\u207F)" },
];
 
function complexityIndex(raw) {
  if (!raw) return 2;
  const s = String(raw).toLowerCase().replace(/\s+/g, "");
  if (s.includes("2^n") || s.includes("exponential")) return 6;
  if (s.includes("n^3") || s.includes("cubic")) return 5;
  if (s.includes("n^2") || s.includes("quadratic")) return 4;
  if (s.includes("nlogn")) return 3;
  if (s.includes("logn")) return 1;
  if (s.includes("constant") || s === "o(1)") return 0;
  if (s.includes("linear") || s.includes("o(n)")) return 2;
  return 2;
}
 
function toneForResult(result) {
  const r = (result || "").toLowerCase();
  if (r.includes("accept") || r.includes("pass")) return "tone-green";
  if (r.includes("wrong") || r.includes("fail") || r.includes("error") || r.includes("tle")) return "tone-rust";
  return "tone-amber";
}
 
function Dial({ complexity }) {
  const idx = complexityIndex(complexity);
  const total = COMPLEXITY_SCALE.length;
  const angle = (idx / (total - 1)) * 180 - 90;
  const cx = 100;
  const cy = 108;
  const r = 82;
 
  const ticks = COMPLEXITY_SCALE.map((step, i) => {
    const a = (-90 + (i * 180) / (total - 1)) * (Math.PI / 180);
    const x1 = cx + Math.sin(a) * (r - 10);
    const y1 = cy - Math.cos(a) * (r - 10);
    const x2 = cx + Math.sin(a) * r;
    const y2 = cy - Math.cos(a) * r;
    const lx = cx + Math.sin(a) * (r + 16);
    const ly = cy - Math.cos(a) * (r + 16);
    const active = i === idx;
    return (
      <g key={step.key}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} className={active ? "dial-tick dial-tick-active" : "dial-tick"} />
        <text x={lx} y={ly} className={active ? "dial-tick-label dial-tick-label-active" : "dial-tick-label"} textAnchor="middle">
          {step.label}
        </text>
      </g>
    );
  });
 
  return (
    <svg viewBox="0 0 200 130" className="dial-svg" role="img" aria-label={`Time complexity ${complexity || "unknown"}`}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} className="dial-arc" />
      {ticks}
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${cx}px ${cy}px` }} className="dial-needle-group">
        <line x1={cx} y1={cy} x2={cx} y2={cy - r + 22} className="dial-needle" />
      </g>
      <circle cx={cx} cy={cy} r="6" className="dial-hub" />
    </svg>
  );
}
 
function SpaceTrack({ complexity }) {
  const idx = complexityIndex(complexity);
  const total = COMPLEXITY_SCALE.length;
  const pct = (idx / (total - 1)) * 100;
  return (
    <div className="space-track">
      <div className="space-track-line">
        {COMPLEXITY_SCALE.map((s, i) => (
          <span key={s.key} className="space-track-stop" style={{ left: `${(i / (total - 1)) * 100}%` }} />
        ))}
        <span className="space-track-marker" style={{ left: `${pct}%` }} />
      </div>
      <div className="space-track-caption">
        <span>O(1)</span>
        <span>{"O(2\u207F)"}</span>
      </div>
    </div>
  );
}
 
function IndicatorLight({ label, active, count }) {
  return (
    <div className="indicator">
      <span className={active ? "dot dot-on" : "dot"} />
      <span className="indicator-label">{label}</span>
      {typeof count === "number" && <span className="indicator-count">{count}</span>}
    </div>
  );
}
 
function App() {
  const [health, setHealth] = useState({ ok: null, text: "checking backend\u2026" });
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());
 
  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/submissions`);
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
 
  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((r) => r.json())
      .then((data) => setHealth({ ok: true, text: data.status || "connected" }))
      .catch(() => setHealth({ ok: false, text: "backend unreachable" }));
 
    fetchSubmissions();
  }, []);
 
  const handleAnalyze = async () => {
    if (!code || !language) return;
    setAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnalysis(data);
        setMessage("");
      } else {
        setMessage("Couldn't analyze that code \u2014 check the language and try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Couldn't reach the analysis engine.");
    } finally {
      setAnalyzing(false);
    }
  };
 
  const deleteSubmission = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/submissions/${id}`, { method: "DELETE" });
      if (response.ok) fetchSubmissions();
    } catch (error) {
      console.error("Error:", error);
    }
  };
 
  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!problem || !language || !code) return;
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, language, code, result }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Logged \u2014 entry #${data.id}`);
        setProblem("");
        setCode("");
        setResult("");
        setAnalysis(null);
        fetchSubmissions();
      } else {
        setMessage("Couldn't save that entry.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Couldn't reach the logbook.");
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <div className="app-shell">
      <style>{`
 
        :root {
          --paper: #F0EAD9;
          --panel: #FBF8F0;
          --ink: #26221D;
          --muted: #8A8172;
          --line: #D9CFB7;
          --teal: #1F6F6B;
          --teal-dark: #154E4B;
          --green: #4C8C5B;
          --amber: #C4841F;
          --rust: #B84A2C;
        }
 
        * { box-sizing: border-box; }
 
        .app-shell {
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          font-family: Arial, sans-serif;
          padding: 32px 20px 80px;
        }
 
        .app-inner { max-width: 1040px; margin: 0 auto; }
 
        .app-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 2px solid var(--ink);
          padding-bottom: 16px;
          margin-bottom: 28px;
        }
 
        .wordmark-row { display: flex; align-items: baseline; gap: 10px; }
 
        .glyph {
          font-family: Arial, sans-serif;
          font-weight: 600;
          color: var(--teal);
          font-size: 22px;
        }
 
        .wordmark {
          font-family: Arial, sans-serif;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: -0.5px;
          margin: 0;
        }
 
        .tagline {
          font-size: 13px;
          color: var(--muted);
          margin: 4px 0 0;
        }
 
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: var(--muted);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 6px 12px;
          background: var(--panel);
        }
 
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); }
        .status-dot.ok { background: var(--green); }
        .status-dot.bad { background: var(--rust); }
 
        .layout-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 20px;
          align-items: start;
        }
 
        @media (max-width: 860px) {
          .layout-grid { grid-template-columns: 1fr; }
        }
 
        .panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 22px 24px;
        }
 
        .panel-label {
          font-family: Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 
        .panel-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--line);
        }
 
        .field { margin-bottom: 16px; }
 
        .field label {
          display: block;
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 6px;
          font-weight: 500;
        }
 
        .field input,
        .field textarea {
          width: 100%;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 3px;
          padding: 10px 12px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          color: var(--ink);
        }
 
        .field textarea {
          font-family: Arial, sans-serif;
          font-size: 13px;
          min-height: 140px;
          resize: vertical;
          line-height: 1.5;
        }
 
        .field input:focus,
        .field textarea:focus {
          outline: none;
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(31, 111, 107, 0.15);
        }
 
        .btn-row { display: flex; gap: 10px; margin-top: 4px; flex-wrap: wrap; }
 
        .btn {
          font-family: Arial, sans-serif;
          font-size: 12.5px;
          letter-spacing: 0.4px;
          border-radius: 3px;
          padding: 10px 16px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: opacity 0.15s ease;
        }
 
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
 
        .btn-primary { background: var(--teal); color: #fff; }
        .btn-primary:hover:not(:disabled) { background: var(--teal-dark); }
 
        .btn-secondary {
          background: transparent;
          border-color: var(--ink);
          color: var(--ink);
        }
        .btn-secondary:hover:not(:disabled) { background: var(--ink); color: var(--paper); }
 
        .inline-message {
          font-size: 12.5px;
          color: var(--teal-dark);
          margin-top: 12px;
          font-family: Arial, sans-serif;
        }
 
        .dial-svg { width: 100%; height: auto; overflow: visible; }
        .dial-arc { fill: none; stroke: var(--line); stroke-width: 3; }
        .dial-tick { stroke: var(--line); stroke-width: 2; }
        .dial-tick-active { stroke: var(--teal); stroke-width: 3; }
        .dial-tick-label { fill: var(--muted); font-family: Arial, sans-serif; font-size: 8.5px; }
        .dial-tick-label-active { fill: var(--ink); font-weight: 600; }
        .dial-needle { stroke: var(--rust); stroke-width: 3; stroke-linecap: round; }
        .dial-needle-group { transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .dial-hub { fill: var(--ink); }
 
        .readout-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 4px;
        }
 
        .readout-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
        .readout-value {
          font-family: Arial, sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--ink);
        }
 
        .space-block { margin-top: 22px; padding-top: 18px; border-top: 1px dashed var(--line); }
 
        .space-track { margin-top: 10px; }
        .space-track-line { position: relative; height: 4px; background: var(--line); border-radius: 2px; }
        .space-track-stop {
          position: absolute; top: 50%; width: 3px; height: 3px; border-radius: 50%;
          background: var(--muted); transform: translate(-50%, -50%);
        }
        .space-track-marker {
          position: absolute; top: 50%; width: 11px; height: 11px; border-radius: 50%;
          background: var(--rust); border: 2px solid var(--panel);
          transform: translate(-50%, -50%);
          transition: left 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .space-track-caption {
          display: flex; justify-content: space-between; margin-top: 8px;
          font-family: Arial, sans-serif; font-size: 10px; color: var(--muted);
        }
 
        .feature-grid {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px dashed var(--line);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 16px;
        }
 
        .indicator { display: flex; align-items: center; gap: 8px; font-size: 13px; }
        .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--line); flex-shrink: 0; }
        .dot-on { background: var(--green); box-shadow: 0 0 0 3px rgba(76, 140, 91, 0.18); }
        .indicator-label { color: var(--ink); }
        .indicator-count {
          margin-left: auto;
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: var(--muted);
        }
 
        .empty-dial {
          display: flex; align-items: center; justify-content: center;
          height: 130px; color: var(--muted); font-size: 13px; text-align: center;
          border: 1px dashed var(--line); border-radius: 4px;
        }
 
        .logbook { margin-top: 22px; }
 
        .log-entry {
          border-bottom: 1px solid var(--line);
          padding: 16px 2px;
        }
        .log-entry:last-child { border-bottom: none; }
 
        .log-entry-head {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          cursor: pointer;
        }
 
        .log-index {
          font-family: Arial, sans-serif;
          font-size: 11px;
          color: var(--muted);
          width: 28px;
        }
 
        .log-title { font-weight: 600; font-size: 15px; flex: 1; min-width: 120px; }
 
        .pill {
          font-family: Arial, sans-serif;
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid var(--line);
          color: var(--muted);
        }
 
        .pill.tone-green { color: var(--green); border-color: var(--green); }
        .pill.tone-rust { color: var(--rust); border-color: var(--rust); }
        .pill.tone-amber { color: var(--amber); border-color: var(--amber); }
 
        .log-meta-row {
          display: flex; align-items: center; gap: 14px;
          margin-top: 6px; margin-left: 38px;
          font-size: 12px; color: var(--muted);
        }
 
        .log-delete {
          background: none; border: none; color: var(--muted);
          font-family: Arial, sans-serif; font-size: 11.5px;
          cursor: pointer; padding: 2px 0; margin-left: auto;
        }
        .log-delete:hover { color: var(--rust); }
 
        .log-code {
          margin: 12px 0 0 38px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 3px;
          padding: 12px 14px;
          font-family: Arial, sans-serif;
          font-size: 12.5px;
          white-space: pre-wrap;
          overflow-x: auto;
          color: var(--ink);
        }
 
        .empty-state {
          text-align: center;
          padding: 30px 10px;
          color: var(--muted);
          font-size: 13.5px;
        }
      `}</style>
 
      <div className="app-inner">
        <header className="app-header">
          <div>
            <div className="wordmark-row">
              <span className="glyph">{"</>"}</span>
              <h1 className="wordmark">CodeMind</h1>
            </div>
            <p className="tagline">Know what your code costs.</p>
          </div>
          <span className="status-pill">
            <span className={`status-dot ${health.ok === true ? "ok" : health.ok === false ? "bad" : ""}`} />
            {health.text}
          </span>
        </header>
 
        <div className="layout-grid">
          <section className="panel">
            <p className="panel-label">Submit a solution</p>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="problem">Problem</label>
                <input id="problem" type="text" placeholder="e.g. Two Sum" value={problem} onChange={(e) => setProblem(e.target.value)} />
              </div>
 
              <div className="field">
                <label htmlFor="language">Language</label>
                <input id="language" type="text" list="lang-options" placeholder="e.g. Python" value={language} onChange={(e) => setLanguage(e.target.value)} />
                <datalist id="lang-options">
                  <option value="Python" />
                  <option value="Java" />
                  <option value="C++" />
                  <option value="JavaScript" />
                  <option value="Go" />
                </datalist>
              </div>
 
              <div className="field">
                <label htmlFor="code">Code</label>
                <textarea id="code" placeholder="Paste your solution here" value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
 
              <div className="field">
                <label htmlFor="result">Result</label>
                <input id="result" type="text" list="result-options" placeholder="e.g. Accepted" value={result} onChange={(e) => setResult(e.target.value)} />
                <datalist id="result-options">
                  <option value="Accepted" />
                  <option value="Wrong Answer" />
                  <option value="Time Limit Exceeded" />
                  <option value="Runtime Error" />
                </datalist>
              </div>
 
              <div className="btn-row">
                <button type="button" className="btn btn-secondary" onClick={handleAnalyze} disabled={!code || !language || analyzing}>
                  {analyzing ? "Analyzing\u2026" : "Analyze code"}
                </button>
                <button type="submit" className="btn btn-primary" disabled={!problem || !language || !code || submitting}>
                  {submitting ? "Logging\u2026" : "Log entry"}
                </button>
              </div>
 
              {message && <p className="inline-message">{message}</p>}
            </form>
          </section>
 
          <section className="panel">
            <p className="panel-label">Diagnostic readout</p>
 
            {analysis ? (
              <>
                <Dial complexity={analysis.complexity?.time} />
                <div className="readout-row">
                  <span className="readout-label">Time</span>
                  <span className="readout-value">{analysis.complexity?.time || "\u2014"}</span>
                </div>
 
                <div className="space-block">
                  <div className="readout-row">
                    <span className="readout-label">Space</span>
                    <span className="readout-value">{analysis.complexity?.space || "\u2014"}</span>
                  </div>
                  <SpaceTrack complexity={analysis.complexity?.space} />
                </div>
 
                <div className="feature-grid">
                  <IndicatorLight label="Loops" active={analysis.features?.loops > 0} count={analysis.features?.loops} />
                  <IndicatorLight label="Conditionals" active={analysis.features?.conditionals > 0} count={analysis.features?.conditionals} />
                  <IndicatorLight label="Functions" active={analysis.features?.functions > 0} count={analysis.features?.functions} />
                  <IndicatorLight label="Max loop depth" active={analysis.features?.max_loop_depth > 0} count={analysis.features?.max_loop_depth} />
                  <IndicatorLight label="Recursion" active={!!analysis.features?.recursion} />
                </div>
              </>
            ) : (
              <div className="empty-dial">Paste code on the left and run Analyze to see its complexity here.</div>
            )}
          </section>
        </div>
 
        <section className="panel logbook">
          <p className="panel-label">Logbook</p>
          {submissions.length === 0 && <div className="empty-state">No entries yet {"\u2014"} log your first solution to start your logbook.</div>}
 
          {submissions.map((submission, i) => {
            const expanded = expandedIds.has(submission.id);
            return (
              <div className="log-entry" key={submission.id}>
                <div className="log-entry-head" onClick={() => toggleExpand(submission.id)}>
                  <span className="log-index">#{String(i + 1).padStart(2, "0")}</span>
                  <span className="log-title">{submission.problem}</span>
                  <span className="pill">{submission.language}</span>
                  <span className={`pill ${toneForResult(submission.result)}`}>{submission.result || "unrecorded"}</span>
                </div>
                <div className="log-meta-row">
                  <span>{new Date(submission.created_at).toLocaleString()}</span>
                  <button
                    className="log-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSubmission(submission.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
                {expanded && <pre className="log-code">{submission.code}</pre>}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
 
export default App;
 

import { useState, useEffect } from "react";
import allQuestions from "./data/questions.json";

const TIMER_SECONDS = 30;
const subjects    = ["All Subjects", ...new Set(allQuestions.map(q => q.subject))];
const difficulties = ["All", "easy", "medium", "hard"];
const sorted      = [...allQuestions].sort((a, b) => b.frequency - a.frequency);

const diffStyle = {
  easy:   { color: "#4ade80", label: "🟢 Easy" },
  medium: { color: "#facc15", label: "🟡 Medium" },
  hard:   { color: "#f87171", label: "🔴 Hard" },
  All:    { color: "#a89cff", label: "⭐ All" },
};

export default function App() {
  const [screen, setScreen]                   = useState("home");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedDiff, setSelectedDiff]       = useState("All");
  const [questions, setQuestions]             = useState([]);
  const [current, setCurrent]                 = useState(0);
  const [selected, setSelected]               = useState(null);
  const [score, setScore]                     = useState(0);
  const [answers, setAnswers]                 = useState([]);
  const [timeLeft, setTimeLeft]               = useState(TIMER_SECONDS);
  const [showQuitDialog, setShowQuitDialog]   = useState(false);

  useEffect(() => {
    if (screen !== "test") return;
    if (timeLeft === 0) { handleNext(true); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, screen]);

  function getFiltered() {
    return allQuestions.filter(q => {
      const subMatch  = selectedSubject === "All Subjects" || q.subject === selectedSubject;
      const diffMatch = selectedDiff === "All" || q.difficulty === selectedDiff;
      return subMatch && diffMatch;
    });
  }

  function startTest() {
    const filtered = getFiltered();
    if (filtered.length === 0) return alert("No questions match this filter. Try a different combination.");
    setQuestions(filtered);
    setCurrent(0); setScore(0);
    setAnswers([]); setSelected(null);
    setTimeLeft(TIMER_SECONDS);
    setScreen("test");
  }

  function handleNext(timedOut = false) {
    const q = questions[current];
    const isCorrect = !timedOut && selected === q.correct;
    const newAnswers = [...answers, {
      question: q.question,
      selected: timedOut ? "⏱ Time Out" : selected,
      correct: q.correct,
      isCorrect,
      difficulty: q.difficulty
    }];
    setAnswers(newAnswers);
    if (isCorrect) setScore(sc => sc + 1);
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setTimeLeft(TIMER_SECONDS);
    } else {
      setScreen("result");
    }
  }

  function restart() {
    setScreen("home"); setCurrent(0); setScore(0);
    setSelected(null); setAnswers([]); setTimeLeft(TIMER_SECONDS);
  }

  const timerColor  = timeLeft > 15 ? "#4ade80" : timeLeft > 7 ? "#facc15" : "#f87171";
  const matchCount  = getFiltered().length;

  // ── HOME ──
  if (screen === "home") return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.badge}>AKTU BCA · PYQ Bank</div>
        <h1 style={s.hero}>EduTest</h1>
        <p style={s.sub}>Practice smarter. Track weak spots. Ace the exam.</p>

        {/* Subject Filter */}
        <p style={s.filterLabel}>Select Subject</p>
        <div style={s.filterGrid}>
          {subjects.map(sub => (
            <button key={sub} style={{
              ...s.filterBtn,
              background: selectedSubject === sub ? "#6c63ff" : "transparent",
              borderColor: selectedSubject === sub ? "#6c63ff" : "#2e2e4e",
              color: selectedSubject === sub ? "#fff" : "#8888aa"
            }} onClick={() => setSelectedSubject(sub)}>
              {sub === "All Subjects" ? "⚡ " : "📘 "}{sub}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <p style={s.filterLabel}>Select Difficulty</p>
        <div style={s.filterGrid}>
          {difficulties.map(d => (
            <button key={d} style={{
              ...s.filterBtn,
              background: selectedDiff === d ? diffStyle[d].color + "33" : "transparent",
              borderColor: selectedDiff === d ? diffStyle[d].color : "#2e2e4e",
              color: selectedDiff === d ? diffStyle[d].color : "#8888aa"
            }} onClick={() => setSelectedDiff(d)}>
              {diffStyle[d].label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.stat}>
            <span style={{
              ...s.statNum,
              color: matchCount === 0 ? "#f87171" : "#6c63ff"
            }}>{matchCount}</span>
            <span style={s.statLabel}>Questions</span>
          </div>
          <div style={s.stat}>
            <span style={s.statNum}>{TIMER_SECONDS}s</span>
            <span style={s.statLabel}>Per Question</span>
          </div>
          <div style={s.stat}>
            <span style={s.statNum}>+1</span>
            <span style={s.statLabel}>Per Correct</span>
          </div>
        </div>

        {matchCount === 0 && (
          <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>
            ⚠️ No questions match this combination
          </p>
        )}

        <button style={{ ...s.btn, opacity: matchCount === 0 ? 0.4 : 1 }} onClick={startTest}>
          Start Test →
        </button>
        <button style={s.ghostBtn} onClick={() => setScreen("pyq")}>
          🔥 Most Repeated Questions
        </button>
      </div>
    </div>
  );

  // ── PYQ PAGE ──
  if (screen === "pyq") {
    const freqColor = (f) => f >= 5 ? "#f87171" : f >= 3 ? "#facc15" : "#4ade80";
    const freqLabel = (f) => f >= 5 ? "🔴 Very High" : f >= 3 ? "🟡 High" : "🟢 Medium";
    return (
      <div style={s.page}>
        <div style={{ ...s.card, maxWidth: "640px" }}>
          <button style={s.backBtn} onClick={() => setScreen("home")}>← Back</button>
          <h1 style={{ ...s.hero, fontSize: "2rem", marginBottom: "0.3rem" }}>🔥 Most Repeated</h1>
          <p style={{ ...s.sub, marginBottom: "2rem" }}>Sorted by frequency across AKTU PYQs</p>
          {sorted.map((q, i) => (
            <div key={q.id} style={s.pyqCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.4rem" }}>
                <span style={s.pyqSubject}>{q.subject}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    color: diffStyle[q.difficulty].color,
                    fontSize: "0.75rem", fontWeight: "600"
                  }}>{diffStyle[q.difficulty].label}</span>
                  <span style={{ color: "#8888aa", fontSize: "0.78rem" }}>· {q.year}</span>
                  <span style={{
                    background: freqColor(q.frequency) + "22",
                    color: freqColor(q.frequency),
                    border: `1px solid ${freqColor(q.frequency)}44`,
                    borderRadius: "20px", padding: "0.2rem 0.7rem",
                    fontSize: "0.78rem", fontWeight: "700"
                  }}>{q.frequency}x · {freqLabel(q.frequency)}</span>
                </div>
              </div>
              <div style={{ background: "#1e1e3a", borderRadius: "4px", height: "4px", marginBottom: "0.8rem" }}>
                <div style={{
                  width: `${Math.min(q.frequency * 15, 100)}%`, height: "100%",
                  background: freqColor(q.frequency), borderRadius: "4px"
                }} />
              </div>
              <p style={{ color: "#e2e8f0", fontSize: "0.97rem", margin: "0 0 0.5rem", lineHeight: "1.5" }}>
                {i + 1}. {q.question}
              </p>
              <p style={{ color: "#4ade80", fontSize: "0.88rem", margin: 0 }}>✓ {q.correct}</p>
            </div>
          ))}
          <button style={{ ...s.btn, marginTop: "1.5rem" }} onClick={startTest}>Start Test →</button>
        </div>
      </div>
    );
  }

  // ── TEST ──
  // ── TEST ──
  if (screen === "test") {
    const q = questions[current];
    const progress = (current / questions.length) * 100;
    return (
      <div style={s.page}>

        {/* Quit Confirmation Dialog */}
        {showQuitDialog && (
          <div style={s.overlay}>
            <div style={s.dialog}>
              <p style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>⚠️</p>
              <h3 style={{ color: "#fff", margin: "0 0 0.5rem", fontSize: "1.1rem" }}>Quit Test?</h3>
              <p style={{ color: "#8888aa", fontSize: "0.9rem", margin: "0 0 1.5rem", textAlign: "center" }}>
                Your progress will be lost. Are you sure?
              </p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button
                  style={{ ...s.btn, background: "#1e1e3a", border: "1px solid #2e2e4e", padding: "0.7rem 1.5rem" }}
                  onClick={() => setShowQuitDialog(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ ...s.btn, background: "linear-gradient(135deg, #f87171, #ef4444)", padding: "0.7rem 1.5rem" }}
                  onClick={() => { setShowQuitDialog(false); restart(); }}
                >
                  Yes, Quit
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={s.progressBg}>
          <div style={{ ...s.progressFill, width: `${progress}%` }} />
        </div>
        <div style={s.card}>
          <div style={s.row}>
            <span style={s.qCount}>Q {current + 1} / {questions.length}</span>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
              <span style={{ color: diffStyle[q.difficulty].color, fontSize: "0.8rem", fontWeight: "600" }}>
                {diffStyle[q.difficulty].label}
              </span>
              <span style={{ ...s.timer, color: timerColor }}>⏱ {timeLeft}s</span>
            </div>
          </div>
          <p style={s.subjectTag}>{q.subject}</p>
          <h2 style={s.question}>{q.question}</h2>
          <div style={{ width: "100%" }}>
            {q.options.map(opt => (
              <button key={opt} style={{
                ...s.option,
                background: selected === opt ? "#6c63ff" : "transparent",
                borderColor: selected === opt ? "#6c63ff" : "#2e2e4e",
              }} onClick={() => setSelected(opt)}>{opt}</button>
            ))}
          </div>
          <button
            style={{ ...s.btn, opacity: selected ? 1 : 0.35, marginTop: "1.5rem" }}
            onClick={() => handleNext(false)}
            disabled={!selected}
          >
            {current + 1 === questions.length ? "Finish →" : "Next →"}
          </button>
          <button
            style={s.abortBtn}
            onClick={() => setShowQuitDialog(true)}
          >
            ✕ Quit Test
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (screen === "result") {
    const pct = Math.round((score / questions.length) * 100);
    const subjectMap = {};
    answers.forEach((a) => {
      const q = questions.find(q => q.question === a.question);
      const sub = q ? q.subject : "Unknown";
      if (!subjectMap[sub]) subjectMap[sub] = { correct: 0, total: 0 };
      subjectMap[sub].total += 1;
      if (a.isCorrect) subjectMap[sub].correct += 1;
    });

    return (
      <div style={s.page}>
        <div style={{ ...s.card, maxWidth: "620px" }}>
          <h1 style={s.hero}>Result</h1>
          <div style={s.scoreBig}>{score}<span style={s.scoreOf}>/{questions.length}</span></div>
          <p style={{ ...s.sub, marginBottom: "0.3rem" }}>{pct}% Overall Accuracy</p>
          <p style={{ color: pct >= 60 ? "#4ade80" : "#f87171", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            {pct >= 60 ? "✅ Great Performance!" : "❌ Keep Practicing!"}
          </p>
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
            <span style={s.tagChip}>{selectedSubject}</span>
            <span style={{ ...s.tagChip, color: diffStyle[selectedDiff].color, borderColor: diffStyle[selectedDiff].color + "44" }}>
              {diffStyle[selectedDiff].label}
            </span>
          </div>

          {/* Subject Chart */}
          <div style={{ width: "100%", marginBottom: "2rem" }}>
            <p style={{ ...s.filterLabel, alignSelf: "flex-start" }}>📊 Subject-wise Performance</p>
            {Object.entries(subjectMap).map(([sub, stat]) => {
              const subPct = Math.round((stat.correct / stat.total) * 100);
              const barColor = subPct >= 70 ? "#4ade80" : subPct >= 40 ? "#facc15" : "#f87171";
              return (
                <div key={sub} style={{ marginBottom: "1.1rem", textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ color: "#e2e8f0", fontSize: "0.9rem" }}>{sub}</span>
                    <span style={{ color: barColor, fontSize: "0.9rem", fontWeight: "600" }}>
                      {stat.correct}/{stat.total} · {subPct}%
                    </span>
                  </div>
                  <div style={{ background: "#1e1e3a", borderRadius: "10px", height: "10px", overflow: "hidden" }}>
                    <div style={{ width: `${subPct}%`, height: "100%", background: barColor, borderRadius: "10px", transition: "width 0.8s ease" }} />
                  </div>
                  <p style={{ color: "#555577", fontSize: "0.75rem", margin: "0.3rem 0 0" }}>
                    {subPct >= 70 ? "✅ Strong area" : subPct >= 40 ? "⚠️ Needs revision" : "❌ Weak area — focus here"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Answer Review */}
          <p style={{ ...s.filterLabel, alignSelf: "flex-start" }}>📝 Answer Review</p>
          <div style={{ width: "100%" }}>
            {answers.map((a, i) => (
              <div key={i} style={{
                background: a.isCorrect ? "#0f2d1f" : "#2d0f0f",
                border: `1px solid ${a.isCorrect ? "#166534" : "#7f1d1d"}`,
                borderRadius: "10px", padding: "0.9rem 1.1rem",
                marginBottom: "0.7rem", textAlign: "left"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <p style={{ color: "#e2e8f0", margin: 0, fontSize: "0.95rem" }}>Q{i + 1}: {a.question}</p>
                  <span style={{ color: diffStyle[a.difficulty]?.color, fontSize: "0.75rem", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>
                    {diffStyle[a.difficulty]?.label}
                  </span>
                </div>
                <p style={{ color: "#4ade80", margin: 0, fontSize: "0.88rem" }}>✓ {a.correct}</p>
                {!a.isCorrect && <p style={{ color: "#fca5a5", margin: 0, fontSize: "0.88rem" }}>✗ {a.selected}</p>}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.2rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button style={{ ...s.btn, background: "#1e1e3a", border: "1px solid #6c63ff" }} onClick={restart}>← Home</button>
            <button style={s.btn} onClick={startTest}>🔄 Retry</button>
          </div>
        </div>
      </div>
    );
  }
}

const s = {
  page: { minHeight: "100vh", background: "#07071a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'Segoe UI', sans-serif", color: "#fff" },
  card: { background: "#11112b", border: "1px solid #2e2e4e", borderRadius: "20px", padding: "2.5rem 2rem", width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 0 60px #6c63ff22" },
  badge: { background: "#6c63ff22", color: "#a89cff", fontSize: "0.78rem", letterSpacing: "0.1em", padding: "0.3rem 1rem", borderRadius: "20px", marginBottom: "1rem", textTransform: "uppercase" },
  hero: { fontSize: "2.8rem", fontWeight: "800", margin: "0 0 0.5rem", letterSpacing: "-1px" },
  sub: { color: "#8888aa", fontSize: "1rem", textAlign: "center", marginBottom: "1.5rem" },
  filterLabel: { color: "#8888aa", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.8rem" },
  filterGrid: { display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center", marginBottom: "1.5rem" },
  filterBtn: { padding: "0.55rem 1.1rem", borderRadius: "30px", border: "1px solid #2e2e4e", cursor: "pointer", fontSize: "0.88rem", fontWeight: "500" },
  statsRow: { display: "flex", gap: "2rem", marginBottom: "1rem" },
  stat: { display: "flex", flexDirection: "column", alignItems: "center" },
  statNum: { fontSize: "1.8rem", fontWeight: "700", color: "#6c63ff" },
  statLabel: { fontSize: "0.75rem", color: "#8888aa", marginTop: "0.2rem" },
  btn: { background: "linear-gradient(135deg, #6c63ff, #8b5cf6)", color: "#fff", border: "none", padding: "0.85rem 2.5rem", borderRadius: "30px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
  ghostBtn: { background: "transparent", color: "#6c63ff", border: "1px solid #6c63ff33", padding: "0.7rem 2rem", borderRadius: "30px", fontSize: "0.95rem", fontWeight: "500", cursor: "pointer", marginTop: "1rem" },
  backBtn: { alignSelf: "flex-start", background: "transparent", border: "none", color: "#8888aa", cursor: "pointer", fontSize: "0.9rem", marginBottom: "1rem", padding: 0 },
  progressBg: { position: "fixed", top: 0, left: 0, right: 0, height: "4px", background: "#1e1e3a" },
  progressFill: { height: "100%", background: "#6c63ff", transition: "width 0.4s ease" },
  row: { display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "0.5rem" },
  qCount: { color: "#8888aa", fontSize: "0.9rem" },
  timer: { fontWeight: "700", fontSize: "1rem" },
  subjectTag: { color: "#6c63ff", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.8rem" },
  question: { fontSize: "1.25rem", fontWeight: "600", textAlign: "center", marginBottom: "1.5rem", lineHeight: "1.5" },
  option: { display: "block", width: "100%", padding: "0.85rem 1.2rem", margin: "0.45rem 0", borderRadius: "12px", border: "1px solid #2e2e4e", color: "#fff", cursor: "pointer", fontSize: "0.97rem", textAlign: "left" },
  scoreBig: { fontSize: "5rem", fontWeight: "800", color: "#6c63ff", lineHeight: 1 },
  scoreOf: { fontSize: "2.5rem", color: "#4444aa" },
  tagChip: { background: "#6c63ff22", color: "#a89cff", border: "1px solid #6c63ff44", borderRadius: "20px", padding: "0.25rem 0.9rem", fontSize: "0.8rem" },
  pyqCard: { width: "100%", background: "#0d0d24", border: "1px solid #2e2e4e", borderRadius: "14px", padding: "1rem 1.2rem", marginBottom: "0.9rem" },
  pyqSubject: { color: "#6c63ff", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.07em" },
  abortBtn: {
  background: "transparent", color: "#555577",
  border: "1px solid #2e2e4e", padding: "0.5rem 1.5rem",
  borderRadius: "20px", fontSize: "0.85rem",
  cursor: "pointer", marginTop: "0.8rem"},
  abortBtn: {
    background: "transparent", color: "#555577",
    border: "1px solid #2e2e4e", padding: "0.5rem 1.5rem",
    borderRadius: "20px", fontSize: "0.85rem",
    cursor: "pointer", marginTop: "0.8rem"},
  overlay: {
    position: "fixed", inset: 0,
    background: "#00000088",
    display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 100
  },
  dialog: {
    background: "#11112b", border: "1px solid #2e2e4e",
    borderRadius: "20px", padding: "2rem",
    display: "flex", flexDirection: "column",
    alignItems: "center", maxWidth: "320px", width: "90%",
    boxShadow: "0 0 40px #00000099"
  },
};
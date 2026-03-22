# 📚 EduTest — AKTU BCA PYQ Practice Platform

A full-featured MCQ test platform built for AKTU BCA students to practice
Previous Year Questions (PYQs) with smart analysis.

🔗 **Live Demo**: [edutest-nine.vercel.app](https://edutest-nine.vercel.app)

---

## ✨ Features

- **438 PYQ-based MCQs** covering all AKTU BCA Sem 1 & Sem 2 subjects
- **Subject-wise filtering** — practice any single subject or all together
- **Difficulty filter** — Easy / Medium / Hard
- **30-second countdown timer** per question (auto-advances on timeout)
- **Live progress bar** during the test
- **Score calculator** with accuracy percentage
- **Subject-wise performance chart** — instantly see your weak areas
- **Most Repeated Questions** page — sorted by frequency across PYQ years
- **Answer review** after every test
- **Quit confirmation dialog** — no accidental test exits
- **Fully responsive** — works on mobile and desktop

---

## 📖 Subjects Covered

| Semester | Subject |
|----------|---------|
| Sem 1 | Computer Fundamentals (BBC101) |
| Sem 1 | Elementary Mathematics (BBC107) |
| Sem 1 | Problem Solving Using C (BBC103) |
| Sem 1 | Communication Skills (BBC104) |
| Sem 1 | Environment & Ecology (BBC105) |
| Sem 1 | Mathematical Foundation (BBC102) |
| Sem 2 | Data Structures (BBC203) |
| Sem 2 | Digital Electronics (BBC201) |
| Sem 2 | Discrete Mathematics (BBC202) |
| Sem 2 | Professional Communication (BBC204) |
| Sem 2 | Information Systems (BBC205) |

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Inline CSS with CSS variables
- **Question Bank**: JSON-based PYQ database
- **Deployment**: Vercel (auto-deploys on every GitHub push)

---

## 🚀 Run Locally
```bash
git clone https://github.com/thehimanivarshney/edutest.git
cd edutest/edutest
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure
```
edutest/
├── src/
│   ├── data/
│   │   └── questions.json    # PYQ question bank
│   ├── App.jsx               # Main application
│   └── main.jsx
└── package.json
```

---

## 🤝 Contributing

Want to add more questions or subjects? Fork the repo, add questions to
`questions.json` following the existing format, and raise a PR.

---

## 👩‍💻 Built By

**Himani Varshney** — BCA 2nd Semester, AKTU
- Built with AI-assisted development (Claude by Anthropic)
- All product decisions, PYQ curation and execution by the author

---

*Made with ❤️ for AKTU BCA students*
```

---

Save this as `README.md` inside the `edutest` folder → then:
```
git add .
git commit -m "docs: add README"
git push

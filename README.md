````markdown
# 🧠 NeuroLearn – Spaced Repetition Flashcard Engine with Review Stats

NeuroLearn is a full-stack educational web application that enables users to create, organize, and review flashcards using an intelligent **spaced repetition algorithm**. Inspired by tools like **Anki** and **Quizlet**, NeuroLearn takes it a step further with interactive analytics, tag-based filtering, and a modern, responsive UI — all backed by a local **SQLite** database.

## 🚀 Features

### 🔐 User Authentication & Profile
- Secure registration & login system
- Password hashing with session handling
- Personalized dashboard showing:
  - Daily goals
  - Learning streaks
  - Tag-wise progress tracking

### 🧩 Deck & Flashcard Management
- Create, edit, and delete decks
- Add cards with:
  - Front & Back content
  - Tags
  - Rich content (text, LaTeX, code, images)
- Organize cards by deck and topic tags

### ⏱️ Spaced Repetition Engine
- Implements the **SM-2 algorithm**
- Dynamically calculates:
  - Ease factor
  - Interval growth
  - Next review date
- Ratings: `Again`, `Hard`, `Good`, `Easy`

### 📝 Review System
- Start review sessions by deck, tag, or due date
- Real-time progress tracker and timer
- Keyboard shortcuts for fast navigation
- Session summary:
  - Accuracy
  - Confidence growth
  - Difficulty adjustment

### 📊 Visual Analytics Dashboard
- Built with Chart.js/D3.js:
  - Review history
  - Mastery per tag
  - Time spent per session
  - Heatmaps of activity
- Upcoming review load forecast

### 📱 Responsive Multi-Page UI
- Mobile-first design
- Pages:
  - Landing
  - Login/Register
  - Dashboard
  - Decks
  - Flashcards
  - Review
  - Analytics
  - Settings

### 🎨 Advanced Features
- **Theme switcher**: Dark, pastel, monochrome, and more
- **Import/export**: JSON/CSV flashcard support
- **AI Assistant (optional)**: Flashcard suggestions from documents/text
- **Offline mode**: Core review works without internet
- **Notifications**: Smart review reminders (web/email)

---

## 🗄️ Database (SQLite)

Tables:
- **Users**: ID, email, password_hash, profile info
- **Decks**: ID, title, user_id
- **Flashcards**: ID, front, back, tags, deck_id
- **Reviews**: ID, card_id, user_id, timestamp, ease, interval
- **Tags**: name, flashcard mapping
- **Settings**: theme, goals, UI preferences

> Uses foreign keys, indexing, and proper normalization for performance and scalability.

---

## 🧱 Tech Stack

| Layer       | Technology                     |
|------------|---------------------------------|
| Frontend    | React + Vite + Tailwind CSS     |
| Routing     | React Router v6                |
| State       | useState/useContext             |
| Charts      | Chart.js / D3.js                |
| Auth        | Custom auth with hashing        |
| Backend     | SQLite (via WASM/Node adapter)  |
| Styling     | TailwindCSS / custom themes     |

---

## 📦 Getting Started

### ✅ Prerequisites
- Node.js (v18+)
- Git

### 🛠 Installation

```bash
git clone https://github.com/your-username/neurolearn.git
cd neurolearn
npm install
````

### 💻 Run Locally

```bash
npm run dev
```

### 🗃 Initialize Database

```bash
# Setup SQLite database
npm run db:init
```

---

## 🛡️ Security & Best Practices

* Input validation & sanitization
* Session-based auth
* Error pages for 404 & 500
* Modular folder structure (MVC architecture)

---

## ✨ Future Improvements

* Full AI flashcard generation
* Cloud sync (PostgreSQL or Firebase backend)
* Progressive Web App (PWA) support
* Mobile app with React Native

---

## 📄 License

MIT License © \[Mohammed Abdul Rahman]

---

## 💬 Feedback

Have suggestions or want to contribute?
Reach out at \[[abdul.rahman.190704@gmail.com](mailto:abdul.rahman.190704@gmail.com)] or open an issue/PR!

````

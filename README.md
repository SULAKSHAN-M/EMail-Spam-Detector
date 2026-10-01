# 📧 E-Mail Spam Detector

A full-stack Gmail client that detects spam, summarizes emails with AI, and provides a context-aware email assistant.

<p align="center">
  <img src="./client/public/Preview.png" alt="E-Mail Spam Detector Preview" width="700">
</p>

<p align="center">
  <strong>AI-Powered Gmail Spam Detection & Email Assistant</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Gmail-API-EA4335?logo=gmail&logoColor=white" alt="Gmail API">
  <img src="https://img.shields.io/badge/Google-Gemini-8E75B2?logo=google&logoColor=white" alt="Google Gemini">
</p>

---

<p align="center">
  <a href="https://email-spam-detector-nine.vercel.app/">
    <strong>🌐 Live Website</strong>
  </a>
</p>


## ✨ Overview

**E-Mail Spam Detector** is a full-stack Gmail client designed to help users identify suspicious emails, understand why messages are classified as spam, summarize email content using AI, and interact with a context-aware email assistant.

The application integrates with the **Gmail API** using Google OAuth 2.0 and combines rule-based spam detection with **Google Gemini** for AI-powered email summaries and contextual assistance.

---

## 🚀 Features

### 🛡️ Spam Detection

The application analyzes incoming emails using multiple spam indicators, including:

- Trusted sender domains
- Suspicious domains
- Suspicious top-level domains
- Spam-related keywords
- Message body patterns
- Email structure
- Sender information
- Suspicious links and content signals

Each detected spam email includes an explanation showing the signals that contributed to the classification.

---

### 🤖 AI Email Summaries

Generate concise summaries of opened emails using **Google Gemini**.

This allows users to quickly understand long email conversations without reading the entire message.

---

### 💬 Context-Aware Email Assistant

The built-in AI assistant can answer questions about the currently opened email.

Example questions:

```text
What is this email asking me to do?

What is the deadline mentioned?

Summarize the important points.

Does this email look suspicious?

Who sent this email?
```

Email context is automatically provided to the assistant when appropriate.

---

### 📊 Inbox Analytics

The dashboard provides useful statistics about the user's inbox.

Analytics include:

- Total emails
- Safe emails
- Spam emails
- Number of scanned emails
- Spam percentage
- Most common spam signals
- Email classification overview

---

### 🎨 Customizable Interface

Users can personalize the application using several interface settings.

Available options include:

- Multiple themes
- Accent colors
- Font sizes
- Compact mode
- Email snippet visibility
- UI preferences

---

### ⚡ Fast Navigation

The application uses **React Context** and frontend caching to reduce unnecessary API calls and improve navigation between emails.

---

### 🔐 Secure Authentication

Authentication is handled using:

- Google OAuth 2.0
- JSON Web Tokens
- Protected API routes
- Secure backend authentication middleware

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Build Tool | Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| State Management | React Context |
| Backend | Node.js |
| API Framework | Express.js |
| Authentication | Google OAuth 2.0, JWT |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Email Access | Gmail API |
| AI | Google Gemini |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## 🏗️ System Architecture

```text
┌──────────────────────────┐
│          User            │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│     React + Vite UI      │
│        Frontend          │
└────────────┬─────────────┘
             │
             │ HTTP / Axios
             ▼
┌──────────────────────────┐
│   Node.js + Express API  │
│         Backend          │
└───────┬─────────┬────────┘
        │         │
        │         │
        ▼         ▼
┌────────────┐ ┌──────────────┐
│ Gmail API  │ │Google Gemini │
└────────────┘ └──────────────┘
        │
        ▼
┌──────────────────────────┐
│      MongoDB Atlas       │
│  User/Profile Metadata   │
└──────────────────────────┘
```

---

## 📂 Project Structure

```text
EMail-Spam-Detector/
│
├── client/
│   ├── public/
│   │   └── Preview.png
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites

Before running the project, install or configure:

- Node.js 18+
- npm
- Google account
- MongoDB Atlas account
- Google Cloud project
- Gmail API
- Google People API
- Google Gemini API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/niladri-1/EMail-Spam-Detector.git
```

Move into the project directory:

```bash
cd EMail-Spam-Detector
```

> Replace the repository URL above with your own GitHub repository URL if this project has been forked or renamed.

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## 🔑 Google OAuth Configuration

Open the **Google Cloud Console** and configure your project.

### Enable APIs

Enable:

- Gmail API
- Google People API

### Create OAuth Credentials

Create:

```text
OAuth 2.0 Client ID
```

Application type:

```text
Web Application
```

For local development, add the following authorized redirect URI:

```text
http://localhost:3000/auth/google/callback
```

If the Google OAuth application is still in **Testing** mode, add your Google account under:

```text
OAuth Consent Screen → Test Users
```

---

## 🔐 Backend Environment Variables

Create:

```text
server/.env
```

Add:

```env
PORT=3000

REDIRECT_URI=http://localhost:3000/auth/google/callback
FRONTEND_URI=http://localhost:5173

MONGODB_URI=
MONGODB_NAME=Gmail_User_DB

CLIENT_ID=
CLIENT_SECRET=

JWT_SECRET=

GEMINI_API_KEY=
```

### Generate a Secure JWT Secret

Run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into:

```env
JWT_SECRET=
```

---

## 💻 Frontend Environment Variables

Create:

```text
client/.env
```

Add:

```env
VITE_BACKEND_URI=http://localhost:3000
```

---

## ▶️ Run the Application

You need to run the backend and frontend separately.

### Backend

From the project root:

```bash
cd server
npm run dev
```

The backend should run on:

```text
http://localhost:3000
```

### Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

## 🔌 Main API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/auth/google` | Start Google authentication |
| `GET` | `/auth/google/callback` | Handle OAuth callback |
| `GET` | `/auth/me` | Return authenticated user information |
| `GET` | `/emails` | Retrieve Gmail messages |
| `POST` | `/emails/scan` | Scan emails for spam |
| `POST` | `/emails/summarise` | Generate an AI email summary |
| `POST` | `/chat` | Send a message to the AI assistant |

---

## 🛡️ Privacy & Data Handling

Privacy is an important part of the application's design.

### Email Content

Email content is **not permanently stored in MongoDB**.

Messages are retrieved from Gmail and processed by the application when required.

### Database

MongoDB stores only application-related user information such as:

- User profile data
- Authentication-related information
- Login-related metadata

### AI Processing

When AI features are used, only the email content required for the requested operation is sent to the configured Gemini API through the backend.

### Environment Variables

Sensitive information must never be committed to GitHub.

Do not commit:

```text
.env
```

Your `.gitignore` should include:

```gitignore
.env
.env.local
.env.production

node_modules/
dist/
```

Never commit:

- Google OAuth client secret
- Gemini API key
- MongoDB connection string
- JWT secret
- Access tokens
- Refresh tokens

---

## 🚀 Deployment

The recommended production architecture is:

```text
Frontend
   │
   ▼
Vercel
   │
   ▼
Render Backend
   │
   ├──────────► Gmail API
   │
   ├──────────► Google Gemini
   │
   └──────────► MongoDB Atlas
```

### Frontend

Deploy the `client` application to:

**Vercel**

Recommended Vercel configuration:

```text
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

### Backend

Deploy the `server` application to:

**Render**

Configure the required environment variables in the Render dashboard instead of uploading the `.env` file.

---

### Database

Use:

**MongoDB Atlas**

Ensure that the production backend can connect to your MongoDB cluster.

---

## 🌍 Production Configuration

After deploying both applications, update the production environment variables.

Frontend:

```env
VITE_BACKEND_URI=https://YOUR-BACKEND.onrender.com
```

Backend:

```env
FRONTEND_URI=https://YOUR-FRONTEND.vercel.app
REDIRECT_URI=https://YOUR-BACKEND.onrender.com/auth/google/callback
```

Then add the production OAuth redirect URI to your Google Cloud OAuth configuration:

```text
https://YOUR-BACKEND.onrender.com/auth/google/callback
```

You may also need to configure the production frontend domain under the appropriate Google OAuth authorized origins.

---

## 🔄 Application Flow

```text
User
 ↓
Google Sign In
 ↓
OAuth Authentication
 ↓
Express Backend
 ↓
Gmail API
 ↓
Retrieve Emails
 ↓
Spam Analysis
 ↓
React Inbox
 │
 ├── Spam Explanation
 ├── AI Summary
 ├── Inbox Analytics
 └── Context-Aware AI Chat
```

---

## 📌 Future Improvements

Possible future enhancements include:

- [ ] Machine-learning-based spam classification
- [ ] Phishing detection
- [ ] Suspicious URL reputation analysis
- [ ] Attachment scanning
- [ ] Sender reputation scoring
- [ ] Persistent inbox analytics
- [ ] Advanced email search
- [ ] Custom spam rules
- [ ] Spam confidence score
- [ ] Dark/light theme improvements
- [ ] Mobile-responsive enhancements
- [ ] AI-generated reply suggestions
- [ ] Multi-email conversation summarization
- [ ] Notification system
- [ ] Email categorization
- [ ] Improved caching

---

## 🧰 Built With

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,nodejs,express,mongodb,js,html,css,git,github,vercel" alt="Technology Stack">
</p>

<p align="center">
  React • Vite • Node.js • Express.js • MongoDB Atlas • Gmail API • Google Gemini • Vercel • Render
</p>

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.

2. Create a feature branch:

```bash
git checkout -b feature/new-feature
```

3. Commit your changes:

```bash
git commit -m "Add new feature"
```

4. Push your branch:

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

## ⭐ Support

If you find this project useful:

- ⭐ Star the repository
- 🍴 Fork the project
- 🐛 Report bugs
- 💡 Suggest new features
- 🔗 Share the project

---

<div align="center">

### 📧 Smarter Email. Safer Inbox.

**E-Mail Spam Detector**

</div>

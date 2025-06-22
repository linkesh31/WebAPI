
<h1 align="center">💠 SenpaiStats</h1>
<p align="center"><strong>A dynamic MERN-based web app for Anime 🎴, Games 🎮, and Music 🎵 fans.</strong></p>
<p align="center">
  <img src="https://img.shields.io/badge/MERN%20Stack-Full--Stack-blue?style=flat-square&logo=javascript" />
  <img src="https://img.shields.io/badge/API%20Integration-Jikan%2FRAWG%2FDeezer-green?style=flat-square&logo=api" />
  <img src="https://img.shields.io/badge/OTP%20Auth-Enabled-orange?style=flat-square&logo=gmail" />
</p>

---

## 🧩 What is SenpaiStats?

**SenpaiStats** is a visually rich, full-stack web application that offers users the ability to explore anime, games, and music from top-tier APIs. The platform combines a sleek UI with real-time features, OTP-based email authentication, and user personalization.

---

## ✨ Features

### 🔐 User Authentication
- OTP Email Verification
- JWT-secured Login
- Forgot & Reset Password Flow
- Profile Edit / Delete Account

### 🎴 Anime Section
- Browse anime via **Jikan API**
- Search, genre filter, synopsis modal
- Add/remove favorites

### 🎮 Games Section
- Fetches data from **RAWG API**
- Filters by platform, genre, and release year
- Hero banner & glassmorphic cards

### 🎵 Music Section
- Powered by **Deezer API**
- Search, sort (A–Z, Z–A, Newest)
- Audio preview & favorite system

### 👤 Profile
- Upload/change profile photo
- Theme toggle (light/dark)
- Initial-based fallback avatar

### 📊 Dashboard
- Stat cards for Anime/Games/Music
- Recent activity list
- Animated UI with trash clear button

---

## 🛠 Tech Stack

| Layer        | Tools Used                                    |
|--------------|-----------------------------------------------|
| Frontend     | React.js, Axios, React Router, SweetAlert2    |
| Backend      | Node.js, Express.js, MongoDB, Mongoose        |
| Auth System  | JWT, Bcrypt, Nodemailer (OTP system)          |
| APIs         | Jikan (Anime), RAWG (Games), Deezer (Music)   |
| UI Styling   | CSS, Responsive Layout, Glassmorphism         |

---

## 📂 Folder Structure

```
WebAPI/
├── client/
│   ├── src/
│   │   ├── views/        # Pages (AnimePage, Login, OTP, Profile)
│   │   ├── components/   # Cards, Forms, Search Bar
│   │   └── assets/       # Icons, Backgrounds
├── server/
│   ├── routes/           # Auth, Anime, Music, Game APIs
│   ├── models/           # Mongoose schemas
│   ├── utils/            # OTP Generator, Mailer
│   └── server.js         # Entry point
```

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js
- MongoDB (Atlas or local)
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/linkesh31/WebAPI.git
cd WebAPI
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create `.env` inside `server` folder:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL_USER=youremail@example.com
EMAIL_PASS=yourpassword
```

Start the backend:

```bash
node server.js
```

### 3️⃣ Setup Frontend

```bash
cd ../client
npm install
npm start
```

---


### 🔐 Login Page  
![Login](https://via.placeholder.com/800x400.png?text=Login+Page)

### 🎴 Anime Page  
![Anime](https://via.placeholder.com/800x400.png?text=Anime+Page)

### 🎮 Games Page  
![Games](https://via.placeholder.com/800x400.png?text=Games+Page)

### 🎵 Music Page  
![Music](https://via.placeholder.com/800x400.png?text=Music+Page)

### 📊 Dashboard  
![Dashboard](https://via.placeholder.com/800x400.png?text=Dashboard)

---

## 👥 Team Members

| 👨‍💻 Name                             | Role                                 |
|--------------------------------------|--------------------------------------|
| Linkesh A/L Jaya Prakash Rao         | Backend Development & API Integration|
| Harvind Nair A/L Selvam              | Frontend Development, UI/UX Design   |
| Kishen Kumaar A/L Ganesh Raja        | System Integration & Testing         |

---

## 📘 License

**6003CEM Web API Coursework Submission**  
© 2025 SenpaiStats Team – All Rights Reserved.

---

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3phcWFkZ3VvZWJxN2k5aHphd3Z2aXZsM2E1aWNwN2FvZ2s3aTdzZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bGgsc5mWoryfgKBx1u/giphy.gif" height="80" alt="Thanks for reading"/>
</p>
<p align="center"><i>Thanks for visiting! Drop a ⭐ on the repo if you liked the project.</i></p>

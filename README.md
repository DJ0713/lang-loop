# 🚀 LangLoop – Language Learning & Spaced-Repetition Platform

**LangLoop** is a full-stack language-learning platform designed to make vocabulary learning more interactive, structured, and effective through flashcards and spaced-repetition-based study sessions.

The platform allows learners to explore language-learning roadmaps, practice vocabulary using interactive flashcards, complete study sessions, and track their learning progress. It also provides dedicated interfaces for Linguists to manage learning content and Administrators to oversee platform activities.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#️-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Application Modules](#-application-modules)
- [Authentication and Security](#-authentication-and-security)
- [Testing](#-testing)
- [Future Enhancements](#-future-enhancements)

---

## 📖 Overview

Learning a new language requires consistent practice, repetition, and progress tracking. Traditional learning methods often lack structured vocabulary revision and personalized learning insights.

**LangLoop addresses this challenge** by providing a centralized platform where users can access structured learning decks, practice vocabulary through flashcards, and monitor their learning progress.

The application follows a role-based architecture with three primary user roles:

- **Learner:** Practices vocabulary and tracks learning progress.
- **Linguist:** Creates and manages language-learning content.
- **Admin:** Manages users, learning resources, and platform analytics.

---

## ✨ Key Features

### 🔐 Authentication and Authorization
- User registration and login.
- JWT-based authentication.
- Secure password handling.
- Role-based access control.
- Automatic logout when an unauthorized response is received.

### 📊 Learner Dashboard
- View total study decks.
- Track total flashcards.
- Monitor mastered flashcards.
- View overall learning progress.
- Explore active learning roadmaps.

### 📚 Study Deck Management
- Create and manage study decks.
- Organize learning resources.
- View available learning roadmaps.
- Search for specific study decks.
- Manage deck information.

### 🃏 Flashcard Management
- Organize flashcards within study decks.
- Display front and back content.
- Practice vocabulary through interactive flashcards.
- Record correct and incorrect recall responses.

### 🎯 Study Session Management
- Start interactive study sessions.
- Review flashcards individually.
- Mark responses as Again (Incorrect) or Got It (Correct).
- Track session progress.
- Display session score and accuracy after completion.

### 👨‍🏫 Linguist Dashboard
- View learning statistics.
- Access available study decks.
- Create new study decks.
- Manage learning content.

### 🛡️ Admin Dashboard
- View platform statistics.
- Manage registered users.
- Update user roles.
- Manage study decks.
- Explore flashcard content.
- Access platform analytics.

### 📈 Platform Analytics
- User distribution by role.
- Total platform users.
- Total study decks.
- Total flashcards.
- Recorded study sessions.
- Average flashcards per deck.

---

## 👥 User Roles

| Feature | Learner | Linguist | Admin |
|---|:---:|:---:|:---:|
| Register and Login | ✅ | ✅ | Login |
| View Dashboard | ✅ | ✅ | ✅ |
| View Learning Roadmaps | ✅ | ✅ | ✅ |
| Study Flashcards | ✅ | — | — |
| Complete Study Sessions | ✅ | — | — |
| Track Learning Progress | ✅ | — | — |
| Create Study Decks | — | ✅ | ✅ |
| Edit Study Decks | — | ✅ | ✅ |
| Manage Flashcards | — | ✅ | ✅ |
| Manage Users | — | — | ✅ |
| Update User Roles | — | — | ✅ |
| View Platform Analytics | — | — | ✅ |

---

## 🛠️ Technology Stack

### Frontend
- **React.js** – Building the user interface.
- **Redux Toolkit** – Managing application state and authentication.
- **React Router** – Handling application navigation.
- **Axios** – Communicating with backend REST APIs.
- **CSS** – Styling and responsive user interfaces.

### Backend
- **Java** – Backend programming language.
- **Spring Boot** – Building RESTful APIs.
- **Spring Security** – Authentication and authorization.
- **JWT** – Token-based authentication.
- **Spring Data JPA / Hibernate** – Database operations and ORM.
- **Maven** – Dependency and build management.

### Database
- **MySQL** – Relational database management.

---

## 🏗️ System Architecture

LangLoop follows a client-server architecture in which the React frontend communicates with the Spring Boot backend through REST APIs.

```text
              ┌─────────────────────────┐
              │       User Roles        │
              │                         │
              │ Learner | Linguist | Admin
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │    React Frontend       │
              │                         │
              │ React Router            │
              │ Redux Toolkit           │
              │ Axios                    │
              │ CSS User Interface       │
              └────────────┬────────────┘
                           │
                      REST APIs
                      JWT Token
                           │
                           ▼
              ┌─────────────────────────┐
              │    Spring Boot Backend  │
              │                         │
              │ REST Controllers        │
              │ Service Layer            │
              │ Spring Security          │
              │ JWT Authentication      │
              │ JPA / Hibernate          │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │      MySQL Database     │
              │                         │
              │ SystemUser              │
              │ StudyDeck               │
              │ Flashcard               │
              │ StudySession            │
              │ Learning Data           │
              └─────────────────────────┘
```

---

## 📂 Project Structure

The project is organized into separate frontend and backend applications.

```text
LangLoop/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── statCards.jsx
│   │   │   │
│   │   │   ├── decks/
│   │   │   │   ├── DeckList.jsx
│   │   │   │   ├── CreateDeck.jsx
│   │   │   │   └── DeckDetails.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx
│   │   │   │
│   │   │   └── study/
│   │   │       └── StudyMode.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── deckService.js
│   │   │   └── studyService.js
│   │   │
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authslice.js
│   │   │       ├── authSlice.js
│   │   │       ├── deckSlice.js
│   │   │       ├── languageSlice.js
│   │   │       └── studySlice.js
│   │   │
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │
│   └── pom.xml
│
└── README.md
```

*Note: The backend tree is abbreviated. Adapt the structure to match the actual package and class names in your repository.*

---

## ⚙️ Getting Started

Follow these instructions to run LangLoop locally.

### Prerequisites

Make sure the following tools are installed:

- Node.js and npm
- Java Development Kit (JDK)
- Maven
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd LangLoop
```

### 2. Configure the Database

Create a MySQL database:

```sql
CREATE DATABASE langloop;
```

Configure your database connection in the backend's `application.properties` file.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/langloop
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Use the database settings appropriate for your local environment.

### 3. Start the Backend

Navigate to the backend directory:

```bash
cd backend
```

Build the application:

```bash
mvn clean install
```

Run Spring Boot:

```bash
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 4. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

Frontend URL:

```text
http://localhost:3000
```

### 5. Access LangLoop

Open your browser and visit:

```text
http://localhost:3000
```

Register an account, log in, and explore the available features according to your assigned role.

---

## 🔧 Environment Configuration

The frontend supports an optional API base URL configuration.

Create a `.env` file inside the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

For backend database credentials, configure the appropriate properties in `application.properties`.

**Security note:** Never commit database passwords, JWT secrets, or other sensitive credentials to a public repository. Use environment variables or an appropriate secrets-management solution.

---

## 📦 Application Modules

| Module | Description |
|---|---|
| User Management | Registration, login, authentication and role management. |
| Study Deck Management | Creation, retrieval, editing and deletion of study decks. |
| Flashcard Management | Organization and management of flashcard content. |
| Study Session Management | Interactive flashcard review and session results. |
| Dashboard and Analytics | Learning statistics and progress monitoring. |
| Platform Administration | User, deck, flashcard and platform management. |

---

## 🔒 Authentication and Security

LangLoop implements JWT-based authentication with Spring Security.

The authentication workflow:

1. The user submits login credentials through the React frontend.
2. The backend validates the credentials.
3. Upon successful authentication, a JWT is generated.
4. The frontend stores the token and user information.
5. Axios attaches the JWT to subsequent API requests using the Bearer authorization scheme.
6. Spring Security validates incoming requests through the JWT authentication filter.
7. Role-based authorization determines access to protected resources.
8. Unauthorized requests trigger logout handling on the frontend.

Example authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧪 Testing

The project includes frontend and backend test suites to validate application functionality.

| Component | Baseline Test Cases |
|---|---:|
| Backend | 32 |
| Frontend | 33 |
| **Total** | **65** |

The established baseline was 65 passing tests across the frontend and backend.

Testing covers areas including:

- Authentication and authorization.
- Redux state management.
- User interface rendering.
- Study deck operations.
- CRUD functionality.
- Error handling.
- JWT validation.
- Security configuration.

Run the relevant test commands using the scripts and test configuration included in each application.

---

## 🚀 Future Enhancements

Potential future improvements for LangLoop include:

- AI-assisted vocabulary recommendations.
- More advanced spaced-repetition scheduling.
- Support for additional languages.
- Detailed learner performance reports.
- Gamification through badges and learning streaks.
- Mobile-friendly learning experience.
- Personalized learning recommendations.

---

## 🎯 Project Objective

The primary objective of LangLoop is to provide an organized and interactive language-learning environment that encourages consistent practice, improves vocabulary retention, and helps learners monitor their progress.

By combining modern frontend technologies, secure backend architecture, and interactive flashcard-based learning, LangLoop aims to make language learning more accessible and engaging.

---

## 👨‍💻 Developed With

Built with ❤️ using React.js, Java Spring Boot, MySQL, and modern web technologies.

**LangLoop – Learn. Practice. Repeat.**

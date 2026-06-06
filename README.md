# Senzen


**Your intelligent companion for effortless money management.**

---

## 🚀 Overview

**Cash Wise** is a modern, full-stack personal finance application designed to help users manage their money with ease. Built with a focus on performance, scalability, and user experience, it offers a seamless way to track expenses, manage budgets, and gain financial insights.

---

## 🧠 Features

- 🔐 **Secure OAuth Login**: Authenticate using OAuth providers with JWT-based session handling, ensuring persistent login sessions even after closing the browser.
- 📊 **Real-Time Expense Tracking**: Add, edit, and delete expenses with instant updates.
- 📁 **Budget Management**: Set and monitor budgets across various categories.
- 📈 **Analytics Dashboard**: Visualize spending patterns and financial health.
- 🌐 **Responsive Design**: Optimized for both desktop and mobile devices.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Components**: [ShadCN](https://shadcn.dev/), [Aceternity](https://aceternity.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)

### Backend

- **Language**: [Go](https://golang.org/)
- **Framework**: [Fiber](https://gofiber.io/)
- **ORM**: [GORM](https://gorm.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: OAuth 2.0 with JWT
- **Containerization**: [Docker](https://www.docker.com/)
- **Orchestration**: [Kubernetes](https://kubernetes.io/)

---

## 📸 Screenshots

![Dashboard Screenshot](https://i.imgur.com/M49vyaj.png) <!-- Replace with your actual screenshot URL -->
*Dashboard displaying budget overview.*

---

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [Go](https://golang.org/) (v1.16 or above)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

1. **Clone the repository:**
 
   ```bash
   git clone https://github.com/Long104/Senzen.git
   cd Senzen
   ```
   
2. **Set up environment variables:**
   
   Create a .env file in both the frontend and backend directories with the necessary configurations.

3. **Start the backend server:**

   ```bash
   cd backend
   go run main.go
   ```
4. **Start the frontend application:**

   ```bash
   cd frontend
   npm run dev
   ```
5. **Access the application:**
   - Open your browser and navigate to http://localhost:3000.

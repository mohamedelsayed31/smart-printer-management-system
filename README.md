<div align="center">

# 🖨️ Smart Printer Management System

### Full-stack print-shop operations platform with AI-assisted waste analysis

<p>
  <strong>React</strong> · <strong>Node.js</strong> · <strong>Express</strong> · <strong>MongoDB</strong> · <strong>JWT</strong> · <strong>Gemini / Groq Vision AI</strong>
</p>

<p>
  An Arabic-first management system for print shops that combines employee attendance, print-job tracking,
  inventory control, printer management, financial reporting, and image-based AI waste classification.
</p>

</div>

---

## 📌 Overview

**Smart Printer Management System** is a full-stack web application designed to help a print shop manage its daily operations from one place.

The system provides two main experiences:

- **Employee App (React):** attendance, print-job registration, AI-assisted waste reporting, and personal statistics.
- **Admin Portal (EJS/Express):** operational dashboard, employee management, printer management, inventory, attendance reports, printing reports, waste reports, and financial reports.

The project also includes a **Vision AI workflow** that analyzes an uploaded image of damaged paper and classifies the likely cause as **Machine**, **Employee**, or **Unknown**, with a short Arabic explanation.

---

## ✨ Key Features

### 👨‍💼 Admin

- Dashboard with daily operational statistics.
- Employee management: view, add, edit, search, and delete employees.
- Printer management and active-printer tracking.
- Inventory and paper-stock management.
- Low-stock monitoring.
- Print-job management and recent activity tracking.
- Attendance reports.
- Printing reports.
- Waste reports.
- Financial reporting and daily revenue tracking.
- Role-based access control for protected admin pages.

### 👷 Employee

- Secure sign-in using JWT authentication.
- Smart daily **Check In / Check Out** attendance flow.
- Browser geolocation capture for attendance records.
- Prevention of duplicate attendance registration on the same day.
- Register new print jobs using available paper/material inventory.
- Server-side print-price calculation.
- Submit paper-waste reports.
- Upload a waste image for AI analysis.
- View personal profile information and monthly statistics.
- Responsive bottom navigation for quick access to main employee features.

### 🤖 AI Waste Analysis

- Image upload with validation and an 8 MB size limit.
- Vision-based waste analysis using **Gemini** or **Groq**.
- Automatic provider fallback when both providers are configured.
- Classification into:
  - `Machine`
  - `Employee`
  - `Unknown`
- Short Arabic AI explanation for the detected issue.
- AI result, provider, explanation, and status are stored with the waste report.
- Safe manual-review fallback when AI analysis is unavailable or inconclusive.

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router, Axios, Bootstrap 5, Bootstrap Icons |
| Employee UI | React SPA |
| Admin UI | EJS server-rendered views |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| AI / Vision | Google Gemini API, Groq Vision API |
| File Uploads | Multer |
| Validation | Joi |
| Maps / Location | Browser Geolocation, Leaflet, React Leaflet |
| Utilities | Moment.js, CORS, Cookie Parser, Dotenv |

---

## 🏗️ Architecture

```mermaid
flowchart LR
    E[Employee] --> R[React Employee App\nlocalhost:3000]
    A[Admin] --> V[EJS Admin Portal\nlocalhost:3001]

    R --> API[Node.js / Express API]
    V --> API

    API --> DB[(MongoDB)]
    API --> AI{Vision AI}
    AI --> G[Google Gemini]
    AI --> Q[Groq Vision]
```

### Main Flow

```text
Employee / Admin
       ↓
React SPA / EJS Views
       ↓
Express Routes + Middleware
       ↓
Controllers + Services
       ↓
Mongoose Models
       ↓
MongoDB

Waste Image → AI Service → Gemini / Groq → Classification → MongoDB
```

---

## 📂 Project Structure

```text
smart_printer/
│
├── client/                     # React employee application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Attendance.js
│   │   │   ├── PrintJob.js
│   │   │   ├── WasteReport.js
│   │   │   └── Profile.js
│   │   └── services/
│   ├── .env.example
│   └── package.json
│
├── server/                     # Node.js / Express backend
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   └── wasteAIService.js
│   ├── utils/
│   ├── validators/
│   ├── views/                  # EJS admin portal
│   ├── public/
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
├── docs/
│   └── screenshots/
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- **Node.js 18+**
- **npm**
- A **MongoDB Atlas** database or local MongoDB instance
- Optional: a **Gemini API key** and/or **Groq API key** for AI waste analysis

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create `server/.env` using `server/.env.example`:

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:3000

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/smart_printer?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret

# Preferred AI provider: gemini or groq
AI_PROVIDER=gemini

# Gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Optional Groq fallback
GROQ_API_KEY=your_groq_api_key
GROQ_VISION_MODEL=qwen/qwen3.8-27b
```

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

Backend URL:

```text
http://localhost:3001
```

### 3. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:3001
```

Start React:

```bash
npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

## 🔐 Authentication & Authorization

The application uses **JWT-based authentication**.

- Protected employee API routes require a valid token.
- Admin-only routes use role-based authorization middleware.
- Passwords are hashed using `bcryptjs`.
- Secrets and database credentials are stored in environment variables.

> **Important:** Never commit `server/.env` or real API keys to GitHub.

---

## 🤖 AI Waste Detection Workflow

1. The employee selects the printer where the issue occurred.
2. The number of wasted sheets is entered.
3. A photo of the damaged paper is uploaded.
4. The backend validates and sends the image to the configured Vision AI provider.
5. The AI returns a strict structured result containing the likely cause and an Arabic explanation.
6. The waste report and AI analysis are stored in MongoDB.
7. If the preferred provider fails, the service can automatically try the configured fallback provider.

Example AI result:

```json
{
  "decision": "Machine",
  "explanation": "يوجد تلف مادي واضح في الورق يرجح وجود مشكلة ميكانيكية أثناء الطباعة."
}
```

---

## 📸 Screenshots

### 🔐 Authentication & Main Views

<table>
  <tr>
    <td width="50%" align="center">
      <strong>Login</strong><br><br>
      <img src="docs/screenshots/01-login.png" alt="Login Page" width="100%" />
    </td>
    <td width="50%" align="center">
      <strong>Admin Dashboard</strong><br><br>
      <img src="docs/screenshots/02-admin-dashboard.png" alt="Admin Dashboard" width="100%" />
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <strong>Employee View</strong><br><br>
      <img src="docs/screenshots/03-employee-view.png" alt="Employee View" width="100%" />
    </td>
    <td width="50%" align="center">
      <strong>Smart Attendance</strong><br><br>
      <img src="docs/screenshots/04-smart-attendance.png" alt="Smart Attendance" width="100%" />
    </td>
  </tr>
</table>

### 🖨️ Printing & AI Waste Analysis

<table>
  <tr>
    <td width="50%" align="center">
      <strong>Print Job Registration</strong><br><br>
      <img src="docs/screenshots/05-print-job.png" alt="Print Job Registration" width="100%" />
    </td>
    <td width="50%" align="center">
      <strong>AI Waste Upload</strong><br><br>
      <img src="docs/screenshots/06-ai-waste-upload.png" alt="AI Waste Upload" width="100%" />
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <strong>AI-Assisted Waste Analysis Result</strong><br><br>
      <img src="docs/screenshots/07-ai-waste-result.png" alt="AI Waste Analysis Result" width="90%" />
    </td>
  </tr>
</table>

### ⚙️ Administration & Profile

<table>
  <tr>
    <td width="50%" align="center">
      <strong>Inventory Management</strong><br><br>
      <img src="docs/screenshots/08-inventory-management.png" alt="Inventory Management" width="100%" />
    </td>
    <td width="50%" align="center">
      <strong>Employee Management</strong><br><br>
      <img src="docs/screenshots/09-employee-management.png" alt="Employee Management" width="100%" />
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <strong>Employee Profile</strong><br><br>
      <img src="docs/screenshots/10-profile.png" alt="Employee Profile" width="75%" />
    </td>
  </tr>
</table>

---

## 📊 Admin Dashboard Metrics

The admin dashboard summarizes important daily data, including:

- Total printers
- Total employees
- Low-stock inventory items
- Daily revenue
- Print jobs created today
- Employees present today
- Total wasted sheets today
- Recent print jobs
- Current staff attendance status

---

## 🛡️ Security Notes

- Keep `.env` files outside version control.
- Use a strong, unique `JWT_SECRET`.
- Rotate API keys immediately if they are ever exposed.
- Restrict MongoDB Atlas network access and database-user permissions.
- Use HTTPS and secure deployment secrets in production.
- Consider HttpOnly secure cookies instead of browser `localStorage` for production authentication.

---

## 🗺️ Future Improvements

- Server-side attendance geofencing around the workplace.
- Separate check-in and check-out GPS locations.
- MongoDB transactions / atomic stock updates for high-concurrency printing.
- Improved dashboard charts and analytics.
- Push/email notifications for low stock.
- More advanced AI waste categories and confidence scoring.
- Export reports to PDF/Excel.
- Full responsive admin dashboard.
- Automated API and integration tests.
- Production deployment with HTTPS.

---

## ✅ Current Status

- React production build: **working**
- Backend JavaScript syntax validation: **passing**
- MongoDB integration: **working**
- JWT authentication: **working**
- Role-based admin protection: **working**
- Attendance flow: **working**
- Print-job workflow: **working**
- AI waste analysis: **working**
- Gemini / Groq fallback support: **implemented**

---

## 📄 License

This project is currently intended for **educational and academic use**. Add a dedicated `LICENSE` file if you plan to distribute it publicly under a specific open-source license.

---

<div align="center">

**Smart Printer Management System**  
Built to make print-shop operations smarter, more traceable, and easier to manage.

</div>


Today 3:07 AM

smart_printer_sys (2).zip
Zip Archive
عايزك تبص عالبروجكت دا وتقولي هو تمام ولا في غلطات والكود تمام
وكمان كان في بج حتة API Gimini دي بتطلع ايررور ف لو تعرف تغيرها او تجيب ليها بديل او حاط

Today 4:28 AM
ecdb7830-b343-456a-b1b6-33100f2485d5.png

018ea0a8-ff96-437f-b2cf-73d6cd232986.png

988e522b-07c2-4ce0-8b05-3cf10555bdfc.png
خلاص تمام 

تمام، عملت لك README احترافي كامل بالإنجليزي مناسب للـGitHub والـportfolio، ومبني على المشروع نفسه مش Template عام.

الـREADME فيه شرح المشروع، Admin/Employee features، الـAI Waste Analysis باستخدام Gemini/Groq، الـTech Stack، Architecture بـMermaid diagram، Project Structure، خطوات التشغيل، .env setup، Authentication & Security، AI workflow، Dashboard metrics، Future Improvements، وحالة المشروع الحالية. كمان ضفت Screenshot الـAI اللي نجح بالفعل، وجهزت أسماء باقي الصور بحيث لما تصورهم تحطهم مباشرة في docs/screenshots/.

تقدر تحمل الـREADME لوحده من هنا:

تحميل README.md

وعملت لك كمان نسخة V4 من المشروع بالكامل والـREADME متضاف جوه الـroot:

تحميل Smart Printer System V4 + README

أسماء الصور اللي جهزت لها الـREADME هي:

docs/screenshots/
├── 01-login.png
├── 02-admin-dashboard.png
├── 03-employee-view.png
├── 04-smart-attendance.png
├── 05-print-job.png
├── 06-ai-waste-upload.png
├── 07-ai-waste-result.png      ← ضفتها بالفعل
├── 08-inventory-management.png
├── 09-employee-management.png
└── 10-profile.png
وفي نقطة مهمة جدًا قبل ما نرفعه على GitHub: لاحظت إن مجلد .git موجود جوه client فقط حاليًا، مش في الـroot بتاع المشروع. يعني لو عملت git add/commit/push من client، الـBackend كله مش هيروح GitHub. الأفضل نخلي شكل الريبو:

Smart-Printer-Management-System/
├── .git/
├── README.md
├── client/
├── server/
└── docs/
مش:

Smart-Printer-Management-System/
├── client/
│   └── .git/
└── server/
فالأفضل الخطوة الجاية قبل الـpush نرتب Git repository نفسه صح، وبعدها نرفع المشروع كامل بالـREADME والصور.


README_Smart_Printer.md
Document


تمام، جهزتهولك GitHub-ready ✅

عملت الآتي:

شلت .git القديمة اللي كانت جوه client.

خليت المشروع كله Repo واحد: client + server + README + docs.

شلت server/.env عشان أي API Keys أو MongoDB credentials ما تترفعش.

ضفت .gitignore في الـroot.

سيبت .env.example عشان أي حد ينزل المشروع يعرف الإعدادات المطلوبة.

خليت Screenshot الـAI الموجودة بالفعل داخل docs/screenshots.

تحميل النسخة الجاهزة للـGitHub

بعد ما تفك الضغط هيبقى الشكل:

smart-printer-management-system/
├── client/
├── server/
├── docs/
│   └── screenshots/
├── README.md
├── PROJECT_REVIEW.md
├── FIXES_APPLIED.md
└── .gitignore
دلوقتي اعمل Repository جديد على GitHub، واقترح الاسم:

smart-printer-management-system
خليه Public لو هتحطه في الـCV والـPortfolio، ومتعملش Initialize بـREADME أو .gitignore لأنهم موجودين بالفعل.

بعدها افتح Terminal جوه:

smart-printer-management-system
وشغل:

git init
git branch -M main

git add .
git commit -m "Initial commit: Smart Printer Management System"
بعد ما تعمل الـRepo على GitHub، هيديك لينك زي:

https://github.com/YOUR_USERNAME/smart-printer-management-system.git
اكتب:

git remote add origin https://github.com/YOUR_USERNAME/smart-printer-management-system.git

git push -u origin main
وبعدها افتح صفحة الـRepo على GitHub، المفروض الـREADME يظهر تلقائيًا بالشكل الاحترافي اللي عملناه.

أنا كمان ظهّرت لك إمكانية توصيل GitHub مباشرة بـChatGPT. لو وصلته، نقدر نكمل شغل الـGitHub من هنا بشكل أسهل.

متعملش Push قبل ما نتأكد من حاجة واحدة: باقي الـscreenshots لسه محتاجين يتحطوا في:

docs/screenshots/
والـAI screenshot موجودة بالفعل. لو عايز نعملها مظبوطة جدًا، صورلي دلوقتي Login Page أول صورة وبعدها نمشي واحدة واحدة ونختار أحسن screenshots للREADME.


905d25af-0f04-4150-a600-18a489e09872.png
انا هرففع دا اديني الاوامر الملفات دي كدا تمام ولا ناقص حاجه


Pasted text(20260916-030351).txt
Document


Pasted text(20260916-030618).txt
Document

919c1c2e-5c0c-4c46-ab90-1150b0d2e40d.png
فين باقي الصور

62cf126e-c8c3-42d9-9ae7-063713ba1978.png

README(2).md
File

19aea0bb-0537-4b28-9af0-144a3fd5b1a8.png
برضو

تمام، كده اتأكدنا من السبب: git status بيقول working tree clean، يعني ملف README.md عندك محليًا لسه هو نفس النسخة القديمة الموجودة على GitHub، والنسخة الجديدة ما استبدلتوش فعلًا.

نفّذ الأول:

Select-String -Path README.md -Pattern "For the complete project gallery"
لو ظهرلك السطر، يبقى أكيد الـREADME القديم.

بعدها شوف ملف الـREADME الجديد اللي نزلته في Downloads:

Get-ChildItem "$env:USERPROFILE\Downloads\README*.md"
غالبًا هتلاقي:

README_updated.md
انسخه مكان القديم:

Copy-Item "$env:USERPROFILE\Downloads\README_updated.md" ".\README.md" -Force
بعدها اتأكد:

Select-String -Path README.md -Pattern "Authentication & Main Views"
المفروض يظهرلك سطر.

وبعدين:

git status
المفروض المرة دي يظهر:

modified: README.md
ساعتها كمل:

git add README.md
git commit -m "Update README screenshot gallery"
git push
وبعدها على GitHub اعمل:

Ctrl + F5
ولو أمر:

Get-ChildItem "$env:USERPROFILE\Downloads\README*.md"
طلعلك أكتر من ملف، ابعتلي الناتج وأنا أقولك تختار أنهي واحد بالظبط.


 complete project gallery"
PS E:\All_Projects\smart_printer_fixed_reviewed\smart_printer_fixed> Get-ChildItem "$env:USERPROFILE\Downloads\README*.md"

    Directory: C:\Users\MohamedElsayed\Downloads

Mode                 LastWriteTime         Length Name    
----                 -------------         ------ ----    
-a---           9/11/2026 11:59 AM          16839 README_ 
                                                  AutoSto 
                                                  ck.md   

PS E:\All_Projects\smart_

تمام، اللي ظهر عندك في Downloads هو README_AutoStock.md بس، يعني ملف الـREADME الجديد بتاع Smart Printer مش نازل عندك لسه.

جهزتهولك باسم صحيح مباشرة:

تحميل README.md الجديد

اعمل الآتي فقط:

نزّل الملف من اللينك فوق.

انسخه داخل:

E:\All_Projects\smart_printer_fixed_reviewed\smart_printer_fixed\
اختار:

Replace the file in the destination
بعدها نفّذ:

git status
المفروض يظهر:

modified: README.md
ثم:

git add README.md
git commit -m "Update README screenshot gallery"
git push
وبعدها اعمل Ctrl + F5 على صفحة GitHub.

ساعتها النص القديم بتاع:

For the complete project gallery...
هيختفي، وكل الـ10 screenshots هيظهروا في الـREADME. 


README.md
Document



Pasted markdown(20260916-032226).md
File
طب شوفه هنا كدا

بصيت عليه، والنسخة اللي بعتها هنا مش سليمة للرفع بالشكل ده. المشكلة إن الـMarkdown اتعمله escaping؛ مثلًا عندك \<table> بدل <table>، والعناوين بقت **## ...**، وكمان الـlists بقت \-، فـGitHub مش هيرندرها بالشكل الطبيعي. 


وفيه غلطة صغيرة كمان في مسار صورة Employee View:

docs/screenshots/03-employee-view\.png
والصح:

docs/screenshots/03-employee-view.png
وده ظاهر فعلًا في الملف اللي بعته. 


النسخة النظيفة والمظبوطة موجودة هنا:

تحميل README.md الصحيح

استبدل الـREADME.md الموجود عندك بالملف ده، وبعدها:

git add README.md
git commit -m "Fix README formatting and screenshot gallery"
git push
وبعدها Ctrl + F5 على GitHub.

الملف الصحيح هيعرض الـ10 screenshots فعليًا، من غير النص القديم بتاع:

For the complete project gallery...

README.md
Document


Library
/
README.md


<div align="center">

🖨️ Smart Printer Management System
Full-stack print-shop operations platform with AI-assisted waste analysis
<p> <strong>React</strong> · <strong>Node.js</strong> · <strong>Express</strong> · <strong>MongoDB</strong> · <strong>JWT</strong> · <strong>Gemini / Groq Vision AI</strong> </p>

<p> An Arabic-first management system for print shops that combines employee attendance, print-job tracking, inventory control, printer management, financial reporting, and image-based AI waste classification. </p>

</div>

📌 Overview
Smart Printer Management System is a full-stack web application designed to help a print shop manage its daily operations from one place.

The system provides two main experiences:

Employee App (React): attendance, print-job registration, AI-assisted waste reporting, and personal statistics.

Admin Portal (EJS/Express): operational dashboard, employee management, printer management, inventory, attendance reports, printing reports, waste reports, and financial reports.

The project also includes a Vision AI workflow that analyzes an uploaded image of damaged paper and classifies the likely cause as Machine, Employee, or Unknown, with a short Arabic explanation.

✨ Key Features
👨‍💼 Admin
Dashboard with daily operational statistics.

Employee management: view, add, edit, search, and delete employees.

Printer management and active-printer tracking.

Inventory and paper-stock management.

Low-stock monitoring.

Print-job management and recent activity tracking.

Attendance reports.

Printing reports.

Waste reports.

Financial reporting and daily revenue tracking.

Role-based access control for protected admin pages.

👷 Employee
Secure sign-in using JWT authentication.

Smart daily Check In / Check Out attendance flow.

Browser geolocation capture for attendance records.

Prevention of duplicate attendance registration on the same day.

Register new print jobs using available paper/material inventory.

Server-side print-price calculation.

Submit paper-waste reports.

Upload a waste image for AI analysis.

View personal profile information and monthly statistics.

Responsive bottom navigation for quick access to main employee features.

🤖 AI Waste Analysis
Image upload with validation and an 8 MB size limit.

Vision-based waste analysis using Gemini or Groq.

Automatic provider fallback when both providers are configured.

Classification into:

Machine

Employee

Unknown

Short Arabic AI explanation for the detected issue.

AI result, provider, explanation, and status are stored with the waste report.

Safe manual-review fallback when AI analysis is unavailable or inconclusive.

🧰 Tech Stack
Layer	Technologies
Frontend	React 19, React Router, Axios, Bootstrap 5, Bootstrap Icons
Employee UI	React SPA
Admin UI	EJS server-rendered views
Backend	Node.js, Express 5
Database	MongoDB, Mongoose
Authentication	JWT, bcryptjs
AI / Vision	Google Gemini API, Groq Vision API
File Uploads	Multer
Validation	Joi
Maps / Location	Browser Geolocation, Leaflet, React Leaflet
Utilities	Moment.js, CORS, Cookie Parser, Dotenv
🏗️ Architecture
flowchart LR
    E[Employee] --> R[React Employee App\nlocalhost:3000]
    A[Admin] --> V[EJS Admin Portal\nlocalhost:3001]

    R --> API[Node.js / Express API]
    V --> API

    API --> DB[(MongoDB)]
    API --> AI{Vision AI}
    AI --> G[Google Gemini]
    AI --> Q[Groq Vision]
Main Flow
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
📂 Project Structure
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
🚀 Getting Started
Prerequisites
Make sure you have:

Node.js 18+

npm

A MongoDB Atlas database or local MongoDB instance

Optional: a Gemini API key and/or Groq API key for AI waste analysis

1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
2. Configure the backend
cd server
npm install
Create server/.env using server/.env.example:

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
Start the backend:

npm run dev
or:

npm start
Backend URL:

http://localhost:3001
3. Configure the frontend
Open another terminal:

cd client
npm install
Create client/.env:

REACT_APP_API_URL=http://localhost:3001
Start React:

npm start
Frontend URL:

http://localhost:3000
🔐 Authentication & Authorization
The application uses JWT-based authentication.

Protected employee API routes require a valid token.

Admin-only routes use role-based authorization middleware.

Passwords are hashed using bcryptjs.

Secrets and database credentials are stored in environment variables.

Important: Never commit server/.env or real API keys to GitHub.

🤖 AI Waste Detection Workflow
The employee selects the printer where the issue occurred.

The number of wasted sheets is entered.

A photo of the damaged paper is uploaded.

The backend validates and sends the image to the configured Vision AI provider.

The AI returns a strict structured result containing the likely cause and an Arabic explanation.

The waste report and AI analysis are stored in MongoDB.

If the preferred provider fails, the service can automatically try the configured fallback provider.

Example AI result:

{
  "decision": "Machine",
  "explanation": "يوجد تلف مادي واضح في الورق يرجح وجود مشكلة ميكانيكية أثناء الطباعة."
}
📸 Screenshots
🔐 Authentication & Main Views
<table> <tr> <td width="50%" align="center"> <strong>Login</strong><br><br> <img src="docs/screenshots/01-login.png" alt="Login Page" width="100%" /> </td> <td width="50%" align="center"> <strong>Admin Dashboard</strong><br><br> <img src="docs/screenshots/02-admin-dashboard.png" alt="Admin Dashboard" width="100%" /> </td> </tr> <tr> <td width="50%" align="center"> <strong>Employee View</strong><br><br> <img src="docs/screenshots/03-employee-view.png" alt="Employee View" width="100%" /> </td> <td width="50%" align="center"> <strong>Smart Attendance</strong><br><br> <img src="docs/screenshots/04-smart-attendance.png" alt="Smart Attendance" width="100%" /> </td> </tr> </table>

🖨️ Printing & AI Waste Analysis
<table> <tr> <td width="50%" align="center"> <strong>Print Job Registration</strong><br><br> <img src="docs/screenshots/05-print-job.png" alt="Print Job Registration" width="100%" /> </td> <td width="50%" align="center"> <strong>AI Waste Upload</strong><br><br> <img src="docs/screenshots/06-ai-waste-upload.png" alt="AI Waste Upload" width="100%" /> </td> </tr> <tr> <td colspan="2" align="center"> <strong>AI-Assisted Waste Analysis Result</strong><br><br> <img src="docs/screenshots/07-ai-waste-result.png" alt="AI Waste Analysis Result" width="90%" /> </td> </tr> </table>

⚙️ Administration & Profile
<table> <tr> <td width="50%" align="center"> <strong>Inventory Management</strong><br><br> <img src="docs/screenshots/08-inventory-management.png" alt="Inventory Management" width="100%" /> </td> <td width="50%" align="center"> <strong>Employee Management</strong><br><br> <img src="docs/screenshots/09-employee-management.png" alt="Employee Management" width="100%" /> </td> </tr> <tr> <td colspan="2" align="center"> <strong>Employee Profile</strong><br><br> <img src="docs/screenshots/10-profile.png" alt="Employee Profile" width="75%" /> </td> </tr> </table>

📊 Admin Dashboard Metrics
The admin dashboard summarizes important daily data, including:

Total printers

Total employees

Low-stock inventory items

Daily revenue

Print jobs created today

Employees present today

Total wasted sheets today

Recent print jobs

Current staff attendance status

🛡️ Security Notes
Keep .env files outside version control.

Use a strong, unique JWT_SECRET.

Rotate API keys immediately if they are ever exposed.

Restrict MongoDB Atlas network access and database-user permissions.

Use HTTPS and secure deployment secrets in production.

Consider HttpOnly secure cookies instead of browser localStorage for production authentication.

🗺️ Future Improvements
Server-side attendance geofencing around the workplace.

Separate check-in and check-out GPS locations.

MongoDB transactions / atomic stock updates for high-concurrency printing.

Improved dashboard charts and analytics.

Push/email notifications for low stock.

More advanced AI waste categories and confidence scoring.

Export reports to PDF/Excel.

Full responsive admin dashboard.

Automated API and integration tests.

Production deployment with HTTPS.

✅ Current Status
React production build: working

Backend JavaScript syntax validation: passing

MongoDB integration: working

JWT authentication: working

Role-based admin protection: working

Attendance flow: working

Print-job workflow: working

AI waste analysis: working

Gemini / Groq fallback support: implemented

📄 License
This project is currently intended for educational and academic use. Add a dedicated LICENSE file if you plan to distribute it publicly under a specific open-source license.

<div align="center">

Smart Printer Management System
Built to make print-shop operations smarter, more traceable, and easier to manage.

</div>
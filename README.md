I'll integrate your project structure into the README. Here's the updated complete README with your actual project tree:

```markdown
# 🤖 AI Recruiter Agent (FYP)

An advanced, full-stack autonomous AI Voice Recruiter Agent designed to automate the initial human resources screening process. The application conducts real-time voice interviews, monitors candidate behavior via built-in anti-cheat detection, dynamically assesses technical skills across multiple languages, and leverages advanced LLMs to write comprehensive feedback and grading metrics straight to an analytical dashboard.

---

## 📑 Table of Contents
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Key Features

### 🎙️ Core Interview Engine
- **Autonomous Real-Time Voice Agent:** Fully integrated with Vapi AI, Deepgram (Nova-2), and OpenAI (GPT-4o-mini) to handle interactive, ultra-low latency voice conversational interviews.
- **Multilingual Capabilities:** Supports dynamic interviewing and context building across English (`en-US`), Hindi (`hi-IN`), and Urdu (`ur-PK`) script-accurate models.
- **Smart Progress Tracking:** Uses internal token state algorithms to track actual substantive assistant turns to display pixel-perfect visual step-completion indicators.

### 🛡️ Candidate Monitoring & Security (Anti-Cheat)
- **Real-Time Tab Monitoring:** Tracks page focus losses and visibility switches, auto-logging suspicious actions directly onto server records via a stateful custom hook system.
- **Security Fingerprinting:** Captures unique secure candidate environments including platform details, browser headers, and strict UTC array timestamps.
- **Idempotent Handshake Locks:** Synchronous structural locks intercept and completely eliminate double-database initialization writes during multi-render or strict-mode compilation pipelines.

### 📊 Recruiter Dashboard & Automation
- **Automated AI Grading:** Utilizes advanced LLMs (`llama-3.3-70b-versatile`) via Groq to review whole conversation matrices and parse precise structured JSON summaries.
- **Interactive Evaluation Metrics:** Clean, modular review pages enabling HR staff to search, review metrics, track user progress, and look into anti-cheat reports.
- **Selection Letters:** Generate and send automated selection/rejection letters based on AI evaluation results.

### 💳 Billing & Credits System
- **Credit-Based System:** Token/credit system for managing interview quotas
- **Stripe Integration:** Secure payment processing for purchasing additional credits

### 📧 Communication Hub
- **Automated Email Notifications:** Nodemailer-powered transactional emails for interview invites and results
- **Candidate Management:** Track candidate progress and communication history

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | Next.js 14+ (App Router, Client Hooks, Advanced Ref Architecture) |
| **Styling & UI** | Tailwind CSS, Lucide React Components, Radix UI |
| **Voice Orchestration** | Vapi AI Web SDK & Infrastructure |
| **AI & Processing** | Groq API Gateway (Llama 3.3 70B), OpenAI (GPT-4o-mini) |
| **State Management** | React Context API & Dedicated Reference Caching Layer |
| **Database & ORM** | MySQL + Prisma ORM |
| **Authentication** | NextAuth.js (Google OAuth Provider) |
| **Email Service** | Nodemailer (SMTP Transport) |
| **Payments** | Stripe Integration |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Vapi Voice   │  │  Anti-Cheat  │  │  Dashboard   │      │
│  │   Interface   │  │   Monitor    │  │    Views     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js API Routes                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  /api/vapi   │  │ /api/monitor │  │ /api/grading │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Vapi AI  │  │  Groq    │  │  OpenAI  │  │  Stripe  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                          │
│                   (Prisma ORM Layer)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17.0 or higher)
- **npm** (v9.6.7 or higher) or **yarn** (v1.22.19 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (v2.40 or higher)

### External Service Accounts Required
- [Vapi AI Account](https://vapi.ai/) - For voice agent infrastructure
- [Groq Cloud Account](https://console.groq.com/) - For LLM processing
- [OpenAI Account](https://platform.openai.com/) - For GPT-4o-mini access
- [Google Cloud Console](https://console.cloud.google.com/) - For OAuth 2.0 credentials
- [Stripe Account](https://stripe.com/) - For payment processing
- SMTP Email Account (Gmail recommended)

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-recruiter-agent.git

# Navigate to project directory
cd ai-recruiter-agent
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install

# OR using pnpm
pnpm install
```

### 3. Set Up Prisma

```bash
# Install Prisma CLI globally (optional)
npm install -g prisma

# Generate Prisma Client
npx prisma generate
```

---

## 🗄️ Database Setup

### Step 1: Create MySQL Database

Login to MySQL and create the database:

```bash
# Access MySQL
mysql -u root -p

# Run these SQL commands
CREATE DATABASE fyp_db;
USE fyp_db;
EXIT;
```

### Step 2: Configure Environment Variables

Create `.env.local` file in root directory:

```bash
# Copy the example env file
cp .env.example .env.local
```

### Step 3: Run Prisma Migrations

```bash
# Push schema to database (development - quick setup)
npx prisma db push

# OR run migrations (recommended for tracking changes)
npx prisma migrate dev --name init

# View and manage database with Prisma Studio (GUI)
npx prisma studio
```

### Prisma Commands Reference

| Command | Description |
|---------|-------------|
| `npx prisma generate` | Generate Prisma Client from schema |
| `npx prisma db push` | Push schema changes to database (no migrations) |
| `npx prisma migrate dev` | Create and apply migrations in development |
| `npx prisma migrate deploy` | Apply pending migrations in production |
| `npx prisma migrate reset` | Reset database (⚠️ deletes all data) |
| `npx prisma studio` | Open GUI database browser at `localhost:5555` |
| `npx prisma db seed` | Seed database with sample data |
| `npx prisma validate` | Validate Prisma schema |
| `npx prisma format` | Format Prisma schema file |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ════════════ DATABASE CONFIG (MySQL) ════════════
DATABASE_URL="mysql://root:your_password@localhost:3306/fyp_db"

# ════════════ SYSTEM ROUTING & AUTH ════════════
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_HOST_URL="http://localhost:3000"
AUTH_SECRET="your_generated_secret_here" # Generate using: openssl rand -base64 32

# ════════════ GOOGLE OAUTH PROVIDER ════════════
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"

# ════════════ VAPI AI CONFIGURATION ════════════
NEXT_PUBLIC_VAPI_PUBLIC_KEY="your_vapi_public_key_here"
VAPI_PRIVATE_KEY="your_vapi_private_key_here"
VAPI_ASSISTANT_ID="your_vapi_assistant_id_here"

# ════════════ AI & LLM APIs ════════════
GROQ_API_KEY="your_groq_api_key_here"
OPENAI_API_KEY="your_openai_api_key_here"

# ════════════ STRIPE PAYMENTS ════════════
STRIPE_SECRET_KEY="your_stripe_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key_here"

# ════════════ NODEMAILER TRANSPORTER ════════════
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password_here" # Use Gmail App Password
EMAIL_FROM="AI Recruiter <noreply@airecruiter.com>"
```

### Generate AUTH_SECRET

```bash
# Using OpenSSL
openssl rand -base64 32

# OR using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🚀 Running the Project

### Development Mode

```bash
# Start development server with hot reload
npm run dev
# OR
yarn dev
# OR
pnpm dev

# The application will be available at:
# 👉 http://localhost:3000

# Prisma Studio (Database GUI)
npx prisma studio
# Available at: http://localhost:5555
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
# OR
npm run start
```

### Other Useful Commands

```bash
# Lint code
npm run lint

# Type checking (if configured)
npm run type-check

# Reset database (⚠️ caution: deletes all data)
npx prisma migrate reset

# Format Prisma schema
npx prisma format
```

---

## 📁 Project Structure

```
ai-recruiter-agent/
├── prisma/                           # Database schema & migrations
│   ├── schema.prisma                 # Prisma schema definition
│   ├── migrations/                   # Database migration files
│   └── seed.ts                       # Database seeding script
│
├── public/                           # Static assets
│   └── images/
│
├── src/
│   └── app/                          # Next.js 14 App Router (Main Application)
│       │
│       ├── (main)/                   # 🔒 Authenticated Routes Group
│       │   ├── _components/          # Shared components for main layout
│       │   │   ├── AppSidebar.jsx    # Main navigation sidebar
│       │   │   └── InterviewCardSkeleton.jsx  # Loading skeleton
│       │   │
│       │   ├── about/                # About page
│       │   │   └── page.jsx
│       │   │
│       │   ├── all-interview/        # 📋 All Interviews Management
│       │   │   ├── [interviewId]/    # Individual interview view
│       │   │   │   ├── component/
│       │   │   │   │   ├── CopyLinkButton.jsx    # Share interview link
│       │   │   │   │   └── DeleteInterview.jsx   # Delete interview
│       │   │   │   ├── edit/         # Edit interview page
│       │   │   │   │   └── page.jsx
│       │   │   │   └── page.jsx
│       │   │   └── page.jsx          # All interviews list
│       │   │
│       │   ├── billing/              # 💳 Billing & Credits
│       │   │   ├── _components/
│       │   │   │   └── PayButton.jsx # Stripe payment integration
│       │   │   └── page.jsx
│       │   │
│       │   ├── communication/        # 📧 Communication Hub
│       │   │   └── page.jsx
│       │   │
│       │   ├── dashboard/            # 📊 Main Dashboard
│       │   │   ├── _components/
│       │   │   │   ├── CreateOptions.jsx       # Interview creation options
│       │   │   │   ├── interviewCard.jsx       # Interview card component
│       │   │   │   └── WelcomeContainer.jsx    # Welcome/onboarding section
│       │   │   ├── create-interview/           # Create new interview
│       │   │   │   ├── _components/
│       │   │   │   │   ├── FormContainer.jsx
│       │   │   │   │   ├── InterviewLink.jsx
│       │   │   │   │   ├── QuestionList.jsx
│       │   │   │   │   └── QuestionListContainer.jsx
│       │   │   │   └── page.jsx
│       │   │   └── page.jsx          # Dashboard home
│       │   │
│       │   ├── help/                 # ❓ Help & Support
│       │   │   └── page.jsx
│       │   │
│       │   ├── scheduled-interview/  # 📅 Scheduled Interviews
│       │   │   ├── _components/
│       │   │   │   ├── CandidateReviewCard.jsx
│       │   │   │   └── loading.jsx
│       │   │   ├── [interview_id]/details/     # Interview details view
│       │   │   │   ├── _components/
│       │   │   │   │   ├── CandidateFeedbackDialog.jsx      # AI feedback dialog
│       │   │   │   │   ├── CandidateList.jsx                # Candidate listing
│       │   │   │   │   ├── InterviewDetailContainer.jsx     # Detail container
│       │   │   │   │   └── SelectionLetterDialog.jsx        # Selection letters
│       │   │   │   └── page.jsx
│       │   │   └── page.jsx          # Scheduled interviews list
│       │   │
│       │   ├── settings/             # ⚙️ User Settings
│       │   │   └── page.jsx
│       │   │
│       │   ├── layout.jsx            # Main authenticated layout
│       │   └── provider.jsx          # Context providers
│       │
│       ├── api/                      # 🔌 API Routes (Backend)
│       │   ├── add-credits/          # Add credits to account
│       │   │   └── route.js
│       │   ├── ai-feedback/          # AI grading & feedback generation
│       │   │   └── route.js
│       │   ├── auth/                 # Authentication endpoints
│       │   │   ├── [...nextauth]/    # NextAuth.js handler
│       │   │   │   └── route.js
│       │   │   └── register/         # User registration
│       │   │       └── route.js
│       │   ├── checkout/             # Stripe checkout session
│       │   │   └── route.js
│       │   ├── generate-questions/   # AI question generation
│       │   │   └── route.js
│       │   ├── interview-feedback/   # Interview feedback & monitoring
│       │   │   ├── init/             # Initialize interview session
│       │   │   │   └── route.js
│       │   │   ├── tab-switch/       # Log tab switches (anti-cheat)
│       │   │   │   └── route.js
│       │   │   └── route.js
│       │   ├── interviews/           # Interview CRUD operations
│       │   │   ├── [id]/             # Single interview operations
│       │   │   │   ├── edit/         # Edit interview
│       │   │   │   │   └── route.js
│       │   │   │   └── route.js
│       │   │   ├── all/              # Get all interviews
│       │   │   │   └── route.js
│       │   │   ├── details/[id]/     # Interview details
│       │   │   │   └── route.js
│       │   │   ├── reports/          # Interview reports
│       │   │   │   └── route.js
│       │   │   └── route.js
│       │   ├── send_email/           # Email sending service
│       │   │   └── route.js
│       │   ├── send-invite/          # Interview invitation emails
│       │   │   └── route.js
│       │   └── user-config/          # User configuration
│       │       └── route.js
│       │
│       ├── auth/                     # 🔐 Authentication Pages
│       │   ├── login/
│       │   │   └── page.jsx          # Login page
│       │   └── register/
│       │       └── page.jsx          # Registration page
│       │
│       ├── interview/                # 🎙️ Interview Interface (Candidate Side)
│       │   ├── _components/
│       │   │   └── InterviewHeader.jsx
│       │   ├── [interview_id]/
│       │   │   ├── completed/        # Interview completion page
│       │   │   │   └── page.jsx
│       │   │   ├── start/            # Active interview session
│       │   │   │   ├── _components/
│       │   │   │   │   ├── AlertConfirmation.jsx     # Start confirmation
│       │   │   │   │   ├── InterviewControls.jsx     # Interview controls
│       │   │   │   │   ├── InterviewInterface.jsx    # Main interview UI
│       │   │   │   │   ├── MicTest.jsx               # Microphone testing
│       │   │   │   │   ├── TimerComponent.jsx        # Interview timer
│       │   │   │   │   └── VoiceWaveform.jsx         # Audio visualization
│       │   │   │   └── page.jsx
│       │   │   └── page.jsx          # Interview landing/preview
│       │   └── layout.jsx            # Interview layout
│       │
│       ├── favicon.ico               # Site favicon
│       ├── globals.css               # Global styles
│       ├── layout.jsx                # Root layout
│       └── page.jsx                  # Landing/Home page
│
├── .env.example                      # Example environment variables
├── .env.local                        # Local environment variables (git-ignored)
├── .gitignore                        # Git ignore rules
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Project dependencies & scripts
└── README.md                         # Project documentation
```

### 📂 Directory Breakdown

| Directory | Purpose |
|-----------|---------|
| `(main)/` | Authenticated pages group (dashboard, interviews, billing, settings) |
| `api/` | Backend API routes for all server-side operations |
| `auth/` | Public authentication pages (login, register) |
| `interview/` | Candidate-facing interview interface |
| `_components/` | Page-specific reusable components |

---

## 🔌 API Routes Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `*` | `/api/auth/[...nextauth]` | NextAuth.js authentication handler |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/interviews` | Get all interviews |
| `POST` | `/api/interviews` | Create new interview |
| `GET` | `/api/interviews/[id]` | Get interview by ID |
| `PUT` | `/api/interviews/[id]/edit` | Edit interview |
| `GET` | `/api/interviews/all` | List all interviews |
| `GET` | `/api/interviews/details/[id]` | Get interview details |
| `GET` | `/api/interviews/reports` | Get interview reports |

### AI & Feedback
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai-feedback` | Generate AI feedback |
| `POST` | `/api/generate-questions` | Generate interview questions |
| `POST` | `/api/interview-feedback` | Submit interview feedback |
| `POST` | `/api/interview-feedback/init` | Initialize feedback session |
| `POST` | `/api/interview-feedback/tab-switch` | Log tab switch event |

### Communication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/send_email` | Send email |
| `POST` | `/api/send-invite` | Send interview invitation |

### Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/add-credits` | Add credits to account |
| `POST` | `/api/checkout` | Create Stripe checkout session |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user-config` | Get user configuration |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Database for Production

For production database, consider:
- [PlanetScale](https://planetscale.com/) - MySQL-compatible serverless
- [AWS RDS](https://aws.amazon.com/rds/) - Managed MySQL
- [Railway](https://railway.app/) - Managed databases

Update `DATABASE_URL` in your production environment variables accordingly.

```bash
# Example PlanetScale connection
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/fyp_db?sslaccept=strict"
```

---

## 🤝 Contributing

This is a Final Year Project. Contributions are welcome following these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is part of a Final Year Project (FYP). All rights reserved.

---

## 📧 Contact

For questions or support, reach out to:

- **Project Maintainer:** [Your Name]
- **Email:** [your.email@university.edu]
- **Supervisor:** [Supervisor Name]

---

## 🙏 Acknowledgments

- [Vapi AI](https://vapi.ai/) - Voice agent infrastructure
- [Groq](https://groq.com/) - LLM inference API
- [OpenAI](https://openai.com/) - GPT-4o-mini model
- [Vercel](https://vercel.com/) - Hosting platform
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

**Built with ❤️ as a Final Year Project**
```

This updated README now includes:
- ✅ Your complete project tree structure
- ✅ Detailed breakdown of each directory and file
- ✅ All API routes with descriptions
- ✅ Component explanations
- ✅ Installation and setup commands
- ✅ Prisma database commands
- ✅ Environment variables configuration
- ✅ Deployment instructions
- ✅ The new features visible from your project structure (billing, communication hub, selection letters, etc.)

The README is now fully customized to your actual project structure and ready for GitHub!
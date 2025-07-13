# DMS - Doctor Management System

A comprehensive healthcare management platform built with Next.js and NestJS that enables doctors to manage their practice and patients to book appointments seamlessly.

## 🏗️ Project Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom design system
- **Components**: Radix UI primitives with shadcn/ui components
- **Forms**: React Hook Form with validation
- **State Management**: React hooks and context

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **API**: RESTful endpoints with proper error handling

## 📁 Project Structure

```
DMS/
├── app/                          # Next.js app directory (frontend)
│   ├── globals.css              # Global styles and Tailwind configuration
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Homepage/landing page
│   ├── not-found.tsx            # 404 error page
│   ├── api/                     # API routes (if needed)
│   ├── dashboard/               # Dashboard pages
│   ├── onboarding/              # Doctor onboarding process
│   └── patient/                 # Patient-specific pages
│       ├── login/               # Patient login
│       ├── register/            # Patient registration
│       └── dashboard/           # Patient dashboard
│
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── onboarding/              # Onboarding-specific components
│   ├── appointments-list.tsx    # Appointment listing component
│   ├── book-appointment-dialog.tsx # Appointment booking modal
│   ├── patient-dashboard-layout.tsx # Patient dashboard layout
│   ├── patient-login-form.tsx   # Patient login form
│   ├── patient-registration-form.tsx # Patient registration form
│   └── theme-provider.tsx       # Theme context provider
│
├── lib/                         # Utility functions and configurations
│   ├── api.ts                   # API service for backend communication
│   └── utils.ts                 # Utility functions (className merger, etc.)
│
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notifications hook
│
├── styles/                      # Additional stylesheets
│   └── globals.css              # Global styles
│
├── public/                      # Static assets
│   └── placeholder-*.{png,svg,jpg} # Placeholder images
│
├── dms-backend/                 # NestJS backend application
│   ├── src/                     # Source code
│   │   ├── main.ts              # Application entry point
│   │   ├── app.module.ts        # Root module
│   │   ├── app.controller.ts    # Root controller
│   │   ├── app.service.ts       # Root service
│   │   ├── auth.module.ts       # Authentication module
│   │   ├── prisma.service.ts    # Database service
│   │   ├── appointments/        # Appointments module
│   │   ├── doctors/             # Doctors module
│   │   ├── patients/            # Patients module
│   │   ├── users/               # Users module
│   │   └── locations/           # Locations module
│   │
│   ├── prisma/                  # Database configuration
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   │
│   ├── test/                    # Test files
│   ├── package.json             # Backend dependencies
│   └── tsconfig.json            # TypeScript configuration
│
├── package.json                 # Frontend dependencies and scripts
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn/ui configuration
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DMS
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd dms-backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create `.env` files in both root and `dms-backend` directories:
   
   **Frontend (.env.local):**
   ```
   NEXT_PUBLIC_BASE_API_URL=http://localhost:3001
   ```
   
   **Backend (dms-backend/.env):**
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/dms_db"
   JWT_SECRET="your-secret-key"
   PORT=3001
   ```

5. **Set up the database**
   ```bash
   cd dms-backend
   npx prisma migrate dev
   npx prisma generate
   cd ..
   ```

6. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd dms-backend
   npm run start:dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

## 🎯 Key Features

### For Doctors
- **Multi-step Onboarding**: Complete registration process with profile setup
- **Practice Management**: Manage multiple clinic locations
- **Schedule Management**: Set availability, working hours, and exceptions
- **Appointment Management**: View, confirm, and manage appointments
- **Patient Records**: Access patient information and appointment history

### For Patients
- **Easy Registration**: Simple account creation process
- **Doctor Discovery**: Browse available doctors by specialty
- **Online Booking**: Book appointments with preferred doctors
- **Appointment Management**: View, reschedule, and cancel appointments
- **Profile Management**: Update personal information and medical history

### Technical Features
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live appointment status updates
- **Security**: JWT authentication and secure data handling
- **Accessibility**: WCAG compliant UI components
- **Performance**: Optimized for fast loading and smooth interactions

## 🎨 Design System

### Color Palette
The application uses a carefully crafted color system with support for both light and dark themes:

- **Primary**: Blue-based colors for main actions and branding
- **Secondary**: Gray-based colors for secondary elements
- **Accent**: Highlight colors for important information
- **Destructive**: Red-based colors for errors and warnings
- **Muted**: Subtle colors for less important content

### Typography
- **Font Family**: Arial, Helvetica, sans-serif
- **Font Sizes**: Responsive scale from 0.8rem to 4rem
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components
All UI components are built using Radix UI primitives with custom styling:
- Fully accessible with keyboard navigation
- Consistent spacing and sizing
- Support for both light and dark themes
- Responsive design principles

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Backend:**
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests

### Code Structure

#### Frontend Components
- **Pages**: Located in `app/` directory using Next.js app router
- **Components**: Reusable UI components in `components/`
- **Layouts**: Shared layouts for different user types
- **Forms**: Form components with validation
- **UI Components**: Base components from shadcn/ui

#### Backend Structure
- **Modules**: Feature-based modules (appointments, users, etc.)
- **Controllers**: HTTP request handlers
- **Services**: Business logic and data processing
- **Guards**: Authentication and authorization
- **DTOs**: Data transfer objects for API validation

## 🗃️ Database Schema

### Core Entities

**User**
- Primary entity for both doctors and patients
- Stores authentication and basic profile information
- Role-based access control

**Doctor**
- Extended profile for medical professionals
- Links to User entity
- Contains specialty and professional information

**Appointment**
- Core booking entity
- Links doctors and patients
- Stores appointment details and status

**Location**
- Practice locations for doctors
- Supports multi-location practices
- Contains address and contact information

### Relationships
- User → Doctor (One-to-One)
- User → Appointments (One-to-Many) as Patient
- Doctor → Appointments (One-to-Many)
- Doctor → Locations (One-to-Many)

## 🔐 Security

### Authentication
- JWT-based authentication
- Secure password hashing
- Role-based access control
- Session management

### Data Protection
- Input validation and sanitization
- SQL injection prevention through Prisma
- XSS protection
- CORS configuration

## 📱 Responsive Design

The application is fully responsive and provides optimal experience across:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adapted layout with collapsible navigation
- **Mobile**: Touch-friendly interface with mobile menu

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy with automatic builds

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Configure database connection
4. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

**Developer**: Rohit
- Full-stack development
- System architecture
- UI/UX design

---

For more detailed information about dependencies, see [DEPENDENCIES.md](./DEPENDENCIES.md)

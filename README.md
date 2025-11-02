# SecureAuth - React Authentication Platform

Modern, client-side React authentication platform with Back4App (Parse Server) integration. Built with TypeScript, featuring comprehensive user management, role-based access control, and profile management capabilities.

## 🚀 Architecture

**Frontend-Only Application:**
- Pure React 18 + TypeScript
- Client-side routing with Wouter
- Direct Parse SDK integration (no backend server)
- Vite for fast development and optimized builds

## ✨ Features

### Authentication & Security
- **User Registration**: Secure signup with email validation
- **User Login**: Session-based authentication with Back4App
- **Email Verification**: Email verification workflow UI
- **Password Reset**: Request password reset via email
- **Session Management**: Secure session token handling in localStorage
- **Role-Based Access Control**: User and Admin roles with protected routes

### User Management
- **Profile Management**: View, update, and delete user profiles
- **Profile Pictures**: Upload, preview, and delete profile pictures (5MB max, image files only)
- **Admin Dashboard**: Admin-only user management interface
- **User List**: View all users with search functionality and profile pictures
- **Role Management**: Admins can change user roles (user/admin) via dropdown
- **User Deletion**: Admin can delete user accounts

### UI/UX
- **Landing Page**: Beautiful hero section with features showcase
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark/Light Theme**: Toggle between themes with persistence
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Form Validation**: Client-side validation with Zod
- **Loading States**: Beautiful loading indicators
- **Error Handling**: User-friendly error messages

## 🛠 Tech Stack

### Frontend
- **React** 18.3.1 - Modern React with hooks
- **TypeScript** 5.6.3 - Type-safe development
- **Wouter** 3.3.5 - Lightweight routing
- **TanStack Query** 5.60.5 - Server state management
- **React Hook Form** 7.55.0 - Form state management
- **Zod** 3.24.2 - Schema validation
- **Tailwind CSS** 3.4.17 - Utility-first styling
- **Shadcn UI** - High-quality component library
- **Lucide React** 0.453.0 - Icon library
- **Vite** 5.4.20 - Build tool & dev server

### Backend (BaaS)
- **Back4App** (Parse Server) - Backend-as-a-Service
- **Parse JavaScript SDK** 7.0.2 - Direct client-side integration

## 📋 Prerequisites

- Node.js 20.x or higher
- Back4App account with:
  - Application ID
  - JavaScript Key

## 🔧 Environment Setup

1. Create a `.env` file in the root directory:

```bash
VITE_BACK4APP_APPLICATION_ID=your_application_id_here
VITE_BACK4APP_JAVASCRIPT_KEY=your_javascript_key_here
```

**Note:** Environment variables MUST be prefixed with `VITE_` to be accessible in the browser.

2. Get your Back4App credentials:
   - Go to [Back4App Dashboard](https://dashboard.back4app.com)
   - Select your app
   - Go to App Settings > Security & Keys
   - Copy your Application ID and JavaScript Key

## 🚀 Installation & Running

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Application will be available at http://localhost:5000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── app-sidebar.tsx
│   ├── pages/
│   │   ├── landing.tsx      # Public landing page
│   │   ├── login.tsx        # Login page
│   │   ├── signup.tsx       # Signup page
│   │   ├── forgot-password.tsx
│   │   ├── verify-email.tsx
│   │   ├── dashboard.tsx    # User dashboard
│   │   ├── profile.tsx      # User profile management
│   │   └── user-management.tsx # Admin user management
│   ├── services/
│   │   ├── auth.service.ts  # Authentication service layer
│   │   └── user.service.ts  # User management service layer
│   ├── lib/
│   │   ├── parse.ts         # Parse SDK initialization
│   │   └── queryClient.ts   # TanStack Query configuration
│   ├── App.tsx              # Main app with routing
│   └── index.css            # Global styles
shared/
└── schema.ts                # Shared TypeScript schemas
```

## 🔐 Security Features

### Client-Side Security
- **Session Management**: Parse SDK automatic session handling
- **Token Storage**: localStorage with automatic cleanup on logout
- **Input Validation**: Zod schema validation on all forms
- **File Upload Validation**: Type and size restrictions (5MB max, images only)

### Back4App Security
- **Password Hashing**: Automatic bcrypt hashing by Parse Server
- **Session Tokens**: Secure UUID-based session tokens
- **ACL (Access Control Lists)**: Parse Server built-in ACL for data security
- **Role-Based Access**: Server-side role validation

### Best Practices
- Never expose JavaScript Key in public repos (use .env)
- HTTPS enforced in production
- XSS protection via React's built-in escaping
- CSRF protection not needed (no cookies used)

## 🎯 User Roles

### Default User (role: 'user')
- Created automatically on signup
- Access to dashboard and profile
- Can view own information
- Can update own profile (except role)
- Can delete own account

### Admin User (role: 'admin')
- Must be assigned via Back4App dashboard
- All user permissions plus:
  - View all users
  - Delete any user account
  - Change user roles
  - Access admin user management page

## 🔄 Key Features Implementation

### Authentication Flow
```typescript
// Direct Parse SDK usage in client
import { AuthService } from '@/services/auth.service';

// Signup
const result = await AuthService.signup(data);
localStorage.setItem('sessionToken', result.sessionToken);

// Login
const result = await AuthService.login(data);
localStorage.setItem('sessionToken', result.sessionToken);

// Logout
await AuthService.logout();
localStorage.removeItem('sessionToken');
```

### Profile Picture Upload
```typescript
// Upload with validation
const updatedUser = await AuthService.uploadProfilePicture(file);

// Delete
const updatedUser = await AuthService.deleteProfilePicture();
```

### Admin Operations
```typescript
// Get all users (admin only)
const users = await UserService.getAllUsers();

// Update user role (admin only)
const updatedUser = await UserService.updateUserRole(userId, 'admin');

// Delete user (admin only)
await UserService.deleteUser(userId);
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BACK4APP_APPLICATION_ID` | Yes | Your Back4App Application ID |
| `VITE_BACK4APP_JAVASCRIPT_KEY` | Yes | Your Back4App JavaScript Key |

## 🚀 Deployment

### Replit Deployment
1. Set environment variables in Replit Secrets:
   - `VITE_BACK4APP_APPLICATION_ID`
   - `VITE_BACK4APP_JAVASCRIPT_KEY`

2. Deploy using Replit's deployment feature
3. Application will be available at your Replit URL

### Other Platforms (Vercel, Netlify, etc.)
1. Configure environment variables in platform settings
2. Build command: `npm run build`
3. Output directory: `dist`
4. Install command: `npm install`

## 🔧 Development

### Adding New Features
1. Create service methods in `client/src/services/`
2. Add shared types in `shared/schema.ts`
3. Create UI components in `client/src/pages/` or `client/src/components/`
4. Update routing in `client/src/App.tsx`

### Theme Customization
- Edit color variables in `client/src/index.css`
- Modify Tailwind config for global changes
- Use Shadcn UI theming system

## 📚 Documentation

- [Parse JavaScript SDK Docs](https://docs.parseplatform.org/js/guide/)
- [Back4App Docs](https://www.back4app.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)

## 🐛 Troubleshooting

### "Parse SDK not initialized" error
- Check that `.env` file exists and contains correct variables
- Verify variables are prefixed with `VITE_`
- Restart development server after changing .env

### Session expired errors
- Clear localStorage
- Re-login to get new session token
- Check Back4App dashboard for session settings

### CORS errors
- Verify Back4App CORS settings allow your domain
- Check that JavaScript Key is correctly set

## 📄 License

MIT

---

**Built with ❤️ using React, TypeScript, and Back4App**

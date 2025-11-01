# SecureAuth - Back4App Authentication Platform

Modern authentication platform built with React, Express, and Back4App (Parse Server). Features comprehensive user management, role-based access control, and a beautiful responsive UI with light/dark theme support.

## Features

### Authentication & Security
- **User Registration**: Secure signup with email validation
- **User Login**: Session-based authentication with Back4App
- **Email Verification**: Email verification workflow UI
- **Password Reset**: Request password reset via email
- **Session Management**: Secure session token handling
- **Role-Based Access Control**: User and Admin roles with protected routes
- **Security**: Server-side role enforcement prevents privilege escalation

### User Management
- **Profile Management**: View, update, and delete user profiles
- **Profile Pictures**: Upload, preview, and delete profile pictures (5MB max, image files only)
- **Admin Dashboard**: Admin-only user management interface
- **User List**: View all users with search functionality and profile pictures
- **User Deletion**: Admin can delete user accounts

### UI/UX
- **Landing Page**: Beautiful hero section with features showcase
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark/Light Theme**: Toggle between themes with persistence
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Form Validation**: Client-side validation with Zod
- **Loading States**: Beautiful loading indicators
- **Error Handling**: User-friendly error messages

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Wouter**: Lightweight routing
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: High-quality component library
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Lucide React**: Icon library

### Backend
- **Express**: Node.js web framework
- **TypeScript**: Type-safe backend
- **Back4App REST API**: Parse Server integration
- **Environment Variables**: Secure configuration

## Environment Variables

Required environment variables:
- `BACK4APP_APPLICATION_ID`: Your Back4App Application ID
- `BACK4APP_REST_API_KEY`: Your Back4App REST API Key

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account (always creates 'user' role)
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update current user profile (cannot change role)
- `DELETE /api/auth/me` - Delete current user account
- `POST /api/auth/reset-password` - Request password reset email
- `POST /api/auth/profile-picture` - Upload profile picture (multipart/form-data)
- `DELETE /api/auth/profile-picture` - Delete profile picture

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `DELETE /api/users/:userId` - Delete user by ID

## Security Features

### Role-Based Access Control
- **User Role**: Default role for all new signups, can access dashboard and profile
- **Admin Role**: Can access all user features plus user management
- **Server-Side Enforcement**: Role assignment is enforced on the backend
- **Protected Routes**: Admin routes require admin role verification

### Session Security
- Session tokens stored securely in localStorage
- Authorization header required for protected endpoints
- Session validation on every authenticated request

### Privilege Escalation Prevention
- Users cannot assign admin role during signup
- Users cannot change their own role via profile update
- All role assignments must go through proper admin channels

## Project Structure

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
│   ├── App.tsx              # Main app with routing
│   └── index.css            # Global styles
server/
├── routes.ts                # API routes
└── index.ts                 # Express server
shared/
└── schema.ts                # Shared TypeScript schemas
```

## Development

The application runs on port 5000 with hot module replacement enabled.

### Available Scripts
- `npm run dev` - Start development server

### Design System
The application follows the design guidelines in `design_guidelines.md` which specifies:
- Typography scales
- Color system
- Spacing standards
- Component patterns
- Responsive breakpoints
- Accessibility requirements

## Back4App Integration

The application integrates with Back4App (Parse Server) for:
- User authentication and session management
- User data storage and retrieval
- Email verification workflow
- Password reset functionality

All Back4App API calls are centralized in the backend routes with proper error handling and data transformation.

## User Roles

### Default User
- Created automatically on signup
- Access to dashboard and profile
- Can view own information
- Can update own profile (except role)
- Can delete own account

### Admin User
- Must be assigned through Back4App dashboard or separate admin tool
- All user permissions plus:
  - View all users
  - Delete any user account
  - Access admin user management page

## Notes for Developers

### Adding Admin Users
To create an admin user:
1. Create a normal user account through the signup flow
2. Log into Back4App dashboard
3. Navigate to your User class
4. Find the user and edit the 'role' field to 'admin'

### Security Considerations
- Never expose role selection in public signup forms
- Always enforce role restrictions server-side
- Validate session tokens on every protected route
- Use environment variables for sensitive configuration

### Theme System
The theme toggle uses localStorage persistence and applies classes to the document root. The dark mode implementation follows Tailwind's class-based strategy.

## Recent Updates (Nov 2024)

### Profile Picture Upload
- Users can upload profile pictures with file validation (images only, 5MB max)
- Preview functionality before upload confirmation
- Profile pictures display in sidebar, profile page, and admin user management
- Secure file upload via Back4App File API
- Delete functionality for removing profile pictures

## Future Enhancements

- Image cropping tool for profile pictures
- Advanced role management with multiple roles and permissions
- User activity logs and session history tracking
- Two-factor authentication (2FA) with TOTP
- Social login (OAuth) with Google and GitHub
- Email verification confirmation endpoint
- Password strength requirements
- Account lockout after failed attempts

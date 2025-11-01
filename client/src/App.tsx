import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import VerifyEmail from "@/pages/verify-email";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import UserManagement from "@/pages/user-management";
import { useToast } from "@/hooks/use-toast";
import type { User, LoginInput, SignupInput, PasswordResetRequest, UpdateUserInput } from "@shared/schema";

function Router() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('sessionToken');
          }
        } catch (error) {
          console.error('Session check failed:', error);
          localStorage.removeItem('sessionToken');
        }
      }
    };

    checkSession();
  }, []);

  // Load all users for admin
  useEffect(() => {
    const loadUsers = async () => {
      if (user?.role === 'admin') {
        try {
          const sessionToken = localStorage.getItem('sessionToken');
          const response = await fetch('/api/users', {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setAllUsers(data.results || []);
          }
        } catch (error) {
          console.error('Failed to load users:', error);
        }
      }
    };

    loadUsers();
  }, [user]);

  const handleLogin = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      localStorage.setItem('sessionToken', result.sessionToken);
      setUser(result.user);
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${result.user.username}`,
      });

      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      localStorage.setItem('sessionToken', result.sessionToken);
      setUser(result.user);

      toast({
        title: "Account created!",
        description: "Please verify your email address.",
      });

      setLocation('/verify-email');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sessionToken');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation('/');
    }
  };

  const handlePasswordReset = async (data: PasswordResetRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Password reset request failed');
      }

      setEmailSent(true);
      toast({
        title: "Email sent",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UpdateUserInput) => {
    setIsLoading(true);
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Update failed');
      }

      setUser(result);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch('/api/auth/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      localStorage.removeItem('sessionToken');
      setUser(null);
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      setLocation('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Refresh users list
      setAllUsers(allUsers.filter(u => u.objectId !== userId));
      
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch('/api/auth/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUser(result);
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    }
  };

  const handleProfilePictureDelete = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch('/api/auth/profile-picture', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      setUser(result);
      toast({
        title: "Profile picture removed",
        description: "Your profile picture has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    }
  };

  const publicRoutes = (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login">
        <Login onLogin={handleLogin} isLoading={isLoading} />
      </Route>
      <Route path="/signup">
        <Signup onSignup={handleSignup} isLoading={isLoading} />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword 
          onResetRequest={handlePasswordReset} 
          isLoading={isLoading}
          emailSent={emailSent}
        />
      </Route>
      <Route path="/verify-email">
        <VerifyEmail email={user?.email} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );

  const authenticatedRoutes = (
    <SidebarProvider style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar user={user ? {
          username: user.username,
          email: user.email,
          role: user.role,
        } : undefined} onLogout={handleLogout} />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b border-border">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-8 md:p-12">
            <Switch>
              <Route path="/dashboard">
                <Dashboard 
                  user={user ? {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified,
                    createdAt: user.createdAt,
                  } : undefined}
                  stats={{
                    totalUsers: allUsers.length,
                    activeUsers: allUsers.filter(u => u.emailVerified).length,
                    adminUsers: allUsers.filter(u => u.role === 'admin').length,
                  }}
                />
              </Route>
              <Route path="/profile">
                <Profile
                  user={user || undefined}
                  onUpdate={handleUpdateProfile}
                  onDelete={handleDeleteAccount}
                  onProfilePictureUpload={handleProfilePictureUpload}
                  onProfilePictureDelete={handleProfilePictureDelete}
                  isLoading={isLoading}
                />
              </Route>
              {user?.role === 'admin' && (
                <Route path="/admin/users">
                  <UserManagement
                    users={allUsers}
                    onDeleteUser={handleDeleteUser}
                    isLoading={isLoading}
                  />
                </Route>
              )}
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );

  return user ? authenticatedRoutes : publicRoutes;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="auth-app-theme">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

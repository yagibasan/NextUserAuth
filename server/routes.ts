import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { signupSchema, loginSchema, passwordResetRequestSchema, updateUserSchema } from "@shared/schema";

const BACK4APP_APP_ID = process.env.BACK4APP_APPLICATION_ID;
const BACK4APP_REST_KEY = process.env.BACK4APP_REST_API_KEY;
const BACK4APP_BASE_URL = "https://parseapi.back4app.com";

// Helper function to make Back4App API requests
async function back4AppRequest(
  endpoint: string,
  options: RequestInit = {},
  sessionToken?: string
) {
  const headers: HeadersInit = {
    "X-Parse-Application-Id": BACK4APP_APP_ID!,
    "X-Parse-REST-API-Key": BACK4APP_REST_KEY!,
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (sessionToken) {
    headers["X-Parse-Session-Token"] = sessionToken;
  }

  const response = await fetch(`${BACK4APP_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`Back4App API Error (${endpoint}):`, {
      status: response.status,
      statusText: response.statusText,
      error: data.error,
      code: data.code,
      fullResponse: data
    });
    throw new Error(data.error || "Back4App request failed");
  }

  return data;
}

// Middleware to verify authentication
function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionToken = authHeader.substring(7);
  req.sessionToken = sessionToken;
  next();
}

// Middleware to verify admin role
async function requireAdmin(req: any, res: any, next: any) {
  try {
    const user = await back4AppRequest("/users/me", {}, req.sessionToken);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Sign Up
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);
      
      // Security: Always set new users to 'user' role by default
      // Admin role should only be assigned through a separate admin interface
      const signupData = {
        username: data.username,
        email: data.email,
        password: data.password,
        role: 'user', // Force user role for all new signups
      };
      
      const result = await back4AppRequest("/users", {
        method: "POST",
        body: JSON.stringify(signupData),
      });

      const user = {
        objectId: result.objectId,
        username: signupData.username,
        email: signupData.email,
        role: 'user',
        emailVerified: false,
        createdAt: result.createdAt,
        updatedAt: result.createdAt,
      };

      res.status(201).json({
        user,
        sessionToken: result.sessionToken,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(400).json({ error: error.message || "Signup failed" });
      }
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);

      const result = await back4AppRequest("/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const user = {
        objectId: result.objectId,
        username: result.username,
        email: result.email,
        role: result.role || 'user',
        emailVerified: result.emailVerified || false,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      res.json({
        user,
        sessionToken: result.sessionToken,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    }
  });

  // Logout
  app.post("/api/auth/logout", requireAuth, async (req: any, res) => {
    try {
      await back4AppRequest("/logout", {
        method: "POST",
      }, req.sessionToken);

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get Current User
  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const result = await back4AppRequest("/users/me", {}, req.sessionToken);

      const user = {
        objectId: result.objectId,
        username: result.username,
        email: result.email,
        role: result.role || 'user',
        emailVerified: result.emailVerified || false,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      res.json(user);
    } catch (error: any) {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  // Update Current User
  app.put("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const data = updateUserSchema.parse(req.body);

      // Security: Prevent users from changing their own role
      // Remove role from update data to prevent privilege escalation
      const { role, ...safeData } = data;

      // Remove undefined values
      const updateData = Object.fromEntries(
        Object.entries(safeData).filter(([_, v]) => v !== undefined)
      );

      const result = await back4AppRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify(updateData),
      }, req.sessionToken);

      // Fetch updated user data
      const updatedUser = await back4AppRequest("/users/me", {}, req.sessionToken);

      const user = {
        objectId: updatedUser.objectId,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role || 'user',
        emailVerified: updatedUser.emailVerified || false,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

      res.json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  });

  // Delete Current User Account
  app.delete("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      await back4AppRequest("/users/me", {
        method: "DELETE",
      }, req.sessionToken);

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Request Password Reset
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const data = passwordResetRequestSchema.parse(req.body);

      await back4AppRequest("/requestPasswordReset", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
      });

      res.json({ success: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  });

  // Get All Users (Admin only)
  app.get("/api/users", requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const result = await back4AppRequest("/users", {}, req.sessionToken);

      const users = result.results.map((user: any) => ({
        objectId: user.objectId,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        emailVerified: user.emailVerified || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      res.json({ results: users });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete User by ID (Admin only)
  app.delete("/api/users/:userId", requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;

      await back4AppRequest(`/users/${userId}`, {
        method: "DELETE",
      }, req.sessionToken);

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

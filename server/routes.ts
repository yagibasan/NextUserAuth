import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import multer from "multer";
import Parse from "parse/node";
import { signupSchema, loginSchema, passwordResetRequestSchema, updateUserSchema, updateRoleSchema, type ActivityType } from "@shared/schema";

// Initialize Parse SDK
Parse.initialize(
  process.env.BACK4APP_APPLICATION_ID!,
  process.env.BACK4APP_REST_API_KEY!, // This is used as JavaScript Key
  process.env.BACK4APP_MASTER_KEY
);
Parse.serverURL = "https://parseapi.back4app.com";

// Enable Parse Server environment (allows server-side operations)
(Parse as any).CoreManager.set('SERVER_AUTH_TYPE', 'api');

// Middleware to verify authentication
async function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sessionToken = authHeader.substring(7);
    const query = new Parse.Query(Parse.Session);
    query.equalTo('sessionToken', sessionToken);
    query.include('user');
    const session = await query.first({ useMasterKey: true });
    
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    req.sessionToken = sessionToken;
    req.currentUser = session.get('user');
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

// Middleware to verify admin role
async function requireAdmin(req: any, res: any, next: any) {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    await req.currentUser.fetch({ useMasterKey: true });
    
    if (req.currentUser.get('role') !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    req.user = req.currentUser.toJSON();
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

// Helper function to log user activity (using Parse SDK)
async function logActivity(
  userId: string,
  username: string,
  activityType: ActivityType,
  ipAddress?: string,
  userAgent?: string,
  metadata?: Record<string, any>
) {
  try {
    const ActivityLog = Parse.Object.extend("ActivityLog");
    const log = new ActivityLog();
    log.set("userId", userId);
    log.set("username", username);
    log.set("activityType", activityType);
    if (ipAddress) log.set("ipAddress", ipAddress);
    if (userAgent) log.set("userAgent", userAgent);
    if (metadata) log.set("metadata", metadata);
    await log.save(null, { useMasterKey: true });
  } catch (error) {
    // Log activity errors but don't fail the main request
    console.error("Failed to log activity:", error);
  }
}

// Configure multer for file uploads (memory storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(file.mimetype);
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Sign Up
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);
      
      // Create new Parse.User with master key (required for server-side signup)
      const parseUser = new Parse.User();
      parseUser.set('username', data.username);
      parseUser.set('email', data.email);
      parseUser.set('password', data.password);
      parseUser.set('role', 'user'); // Force user role for all new signups
      
      // Sign up the user with master key
      await parseUser.signUp(null, { useMasterKey: true });

      const user = {
        objectId: parseUser.id,
        username: parseUser.get('username'),
        email: parseUser.get('email'),
        role: parseUser.get('role') || 'user',
        emailVerified: parseUser.get('emailVerified') || false,
        createdAt: parseUser.get('createdAt').toISOString(),
        updatedAt: parseUser.get('updatedAt').toISOString(),
      };

      res.status(201).json({
        user,
        sessionToken: parseUser.getSessionToken(),
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

      // Log in using Parse SDK
      const parseUser = await Parse.User.logIn(data.username, data.password);

      const user = {
        objectId: parseUser.id,
        username: parseUser.get('username'),
        email: parseUser.get('email'),
        role: parseUser.get('role') || 'user',
        emailVerified: parseUser.get('emailVerified') || false,
        profilePicture: parseUser.get('profilePicture'),
        createdAt: parseUser.get('createdAt').toISOString(),
        updatedAt: parseUser.get('updatedAt').toISOString(),
      };

      res.json({
        user,
        sessionToken: parseUser.getSessionToken(),
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
      await Parse.User.logOut();
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get Current User
  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      await req.currentUser.fetch({ useMasterKey: true });

      const user = {
        objectId: req.currentUser.id,
        username: req.currentUser.get('username'),
        email: req.currentUser.get('email'),
        role: req.currentUser.get('role') || 'user',
        emailVerified: req.currentUser.get('emailVerified') || false,
        profilePicture: req.currentUser.get('profilePicture'),
        createdAt: req.currentUser.get('createdAt').toISOString(),
        updatedAt: req.currentUser.get('updatedAt').toISOString(),
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
      const { role, ...safeData } = data;

      // Update user with Parse SDK
      if (safeData.username) req.currentUser.set('username', safeData.username);
      if (safeData.email) req.currentUser.set('email', safeData.email);
      if (safeData.password) req.currentUser.set('password', safeData.password);

      await req.currentUser.save(null, { useMasterKey: true });

      const user = {
        objectId: req.currentUser.id,
        username: req.currentUser.get('username'),
        email: req.currentUser.get('email'),
        role: req.currentUser.get('role') || 'user',
        emailVerified: req.currentUser.get('emailVerified') || false,
        profilePicture: req.currentUser.get('profilePicture'),
        createdAt: req.currentUser.get('createdAt').toISOString(),
        updatedAt: req.currentUser.get('updatedAt').toISOString(),
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
      await req.currentUser.destroy({ useMasterKey: true });
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Request Password Reset
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const data = passwordResetRequestSchema.parse(req.body);
      await Parse.User.requestPasswordReset(data.email);
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
      const query = new Parse.Query(Parse.User);
      const results = await query.find({ useMasterKey: true });

      const users = results.map((user) => ({
        objectId: user.id,
        username: user.get('username'),
        email: user.get('email'),
        role: user.get('role') || 'user',
        emailVerified: user.get('emailVerified') || false,
        profilePicture: user.get('profilePicture'),
        createdAt: user.get('createdAt').toISOString(),
        updatedAt: user.get('updatedAt').toISOString(),
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
      const query = new Parse.Query(Parse.User);
      const user = await query.get(userId, { useMasterKey: true });
      await user.destroy({ useMasterKey: true });
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Upload Profile Picture
  app.post("/api/auth/profile-picture", requireAuth, upload.single('profilePicture'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Create Parse.File from buffer
      const parseFile = new Parse.File(req.file.originalname, Array.from(req.file.buffer), req.file.mimetype);
      await parseFile.save();

      // Update user profile with file reference
      req.currentUser.set('profilePicture', {
        name: parseFile.name(),
        url: parseFile.url(),
      });
      await req.currentUser.save(null, { useMasterKey: true });

      const user = {
        objectId: req.currentUser.id,
        username: req.currentUser.get('username'),
        email: req.currentUser.get('email'),
        role: req.currentUser.get('role') || 'user',
        emailVerified: req.currentUser.get('emailVerified') || false,
        profilePicture: req.currentUser.get('profilePicture'),
        createdAt: req.currentUser.get('createdAt').toISOString(),
        updatedAt: req.currentUser.get('updatedAt').toISOString(),
      };

      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete Profile Picture
  app.delete("/api/auth/profile-picture", requireAuth, async (req: any, res) => {
    try {
      req.currentUser.unset('profilePicture');
      await req.currentUser.save(null, { useMasterKey: true });

      const user = {
        objectId: req.currentUser.id,
        username: req.currentUser.get('username'),
        email: req.currentUser.get('email'),
        role: req.currentUser.get('role') || 'user',
        emailVerified: req.currentUser.get('emailVerified') || false,
        profilePicture: req.currentUser.get('profilePicture'),
        createdAt: req.currentUser.get('createdAt').toISOString(),
        updatedAt: req.currentUser.get('updatedAt').toISOString(),
      };

      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update User Role (Admin Only)
  app.put("/api/users/:userId/role", requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const data = updateRoleSchema.parse(req.body);

      // Security: Prevent admins from changing their own role
      if (userId === req.user.objectId) {
        return res.status(403).json({ error: "Cannot change your own role" });
      }

      // Update user role using Parse SDK
      const query = new Parse.Query(Parse.User);
      const user = await query.get(userId, { useMasterKey: true });
      user.set('role', data.role);
      await user.save(null, { useMasterKey: true });

      const userData = {
        objectId: user.id,
        username: user.get('username'),
        email: user.get('email'),
        role: user.get('role') || 'user',
        emailVerified: user.get('emailVerified') || false,
        profilePicture: user.get('profilePicture'),
        createdAt: user.get('createdAt').toISOString(),
        updatedAt: user.get('updatedAt').toISOString(),
      };

      res.json(userData);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

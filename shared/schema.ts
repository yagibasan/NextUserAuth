import { z } from "zod";

// Back4App User Schema (based on Parse Server User class)
export const userSchema = z.object({
  objectId: z.string(),
  username: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().optional(),
  sessionToken: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Authentication Schemas
export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['user', 'admin']).default('user'),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// API Response Types
export interface AuthResponse {
  user: User;
  sessionToken: string;
}

export interface ApiError {
  code: number;
  error: string;
}

export interface UsersListResponse {
  results: User[];
  count?: number;
}

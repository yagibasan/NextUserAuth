import Parse from '../lib/parse';
import type { User, SignupInput, LoginInput, UpdateUserInput } from '@shared/schema';

export class AuthService {
  // Signup - Create new user
  static async signup(data: SignupInput): Promise<{ user: User; sessionToken: string }> {
    try {
      const parseUser = new Parse.User();
      parseUser.set('username', data.username);
      parseUser.set('email', data.email);
      parseUser.set('password', data.password);
      
      await parseUser.signUp();
      
      // Set role with current session
      parseUser.set('role', 'user');
      await parseUser.save();

      return {
        user: this.parseUserToUser(parseUser),
        sessionToken: parseUser.getSessionToken()!
      };
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  // Login
  static async login(data: LoginInput): Promise<{ user: User; sessionToken: string }> {
    try {
      const parseUser = await Parse.User.logIn(data.username, data.password);
      
      return {
        user: this.parseUserToUser(parseUser),
        sessionToken: parseUser.getSessionToken()!
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await Parse.User.logOut();
      localStorage.removeItem('sessionToken');
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) return null;

      await currentUser.fetch();
      return this.parseUserToUser(currentUser);
    } catch (error: any) {
      return null;
    }
  }

  // Update profile
  static async updateProfile(data: UpdateUserInput): Promise<User> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      if (data.username) currentUser.set('username', data.username);
      if (data.email) currentUser.set('email', data.email);
      if (data.password) currentUser.set('password', data.password);

      await currentUser.save();
      return this.parseUserToUser(currentUser);
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  // Delete account
  static async deleteAccount(): Promise<void> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      await currentUser.destroy();
      localStorage.removeItem('sessionToken');
    } catch (error: any) {
      throw new Error(error.message || 'Account deletion failed');
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(file: File): Promise<User> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      // Validate file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Create Parse File
      const parseFile = new Parse.File(file.name, file);
      await parseFile.save();

      // Update user profile
      currentUser.set('profilePicture', {
        name: parseFile.name(),
        url: parseFile.url()
      });

      await currentUser.save();
      return this.parseUserToUser(currentUser);
    } catch (error: any) {
      throw new Error(error.message || 'Profile picture upload failed');
    }
  }

  // Delete profile picture
  static async deleteProfilePicture(): Promise<User> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      currentUser.unset('profilePicture');
      await currentUser.save();
      return this.parseUserToUser(currentUser);
    } catch (error: any) {
      throw new Error(error.message || 'Profile picture deletion failed');
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await Parse.User.requestPasswordReset(email);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset request failed');
    }
  }

  // Helper: Convert Parse.User to User type
  private static parseUserToUser(parseUser: Parse.User): User {
    return {
      objectId: parseUser.id || '',
      username: parseUser.get('username') || '',
      email: parseUser.get('email') || '',
      role: parseUser.get('role') || 'user',
      emailVerified: parseUser.get('emailVerified') || false,
      profilePicture: parseUser.get('profilePicture'),
      createdAt: parseUser.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: parseUser.updatedAt?.toISOString() || new Date().toISOString()
    };
  }

  // Become user with session token (for authentication persistence)
  static async becomeUser(sessionToken: string): Promise<User> {
    try {
      const parseUser = await Parse.User.become(sessionToken);
      return this.parseUserToUser(parseUser);
    } catch (error: any) {
      throw new Error('Invalid or expired session');
    }
  }
}

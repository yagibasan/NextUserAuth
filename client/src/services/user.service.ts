import Parse from '../lib/parse';
import type { User } from '@shared/schema';

export class UserService {
  // Get all users (admin only)
  static async getAllUsers(): Promise<User[]> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      await currentUser.fetch();
      const role = currentUser.get('role');
      
      if (role !== 'admin') {
        throw new Error('Forbidden: Admin access required');
      }

      const query = new Parse.Query(Parse.User);
      query.limit(1000);
      query.descending('createdAt');
      
      const users = await query.find();
      
      return users.map(user => ({
        objectId: user.id || '',
        username: user.get('username') || '',
        email: user.get('email') || '',
        role: user.get('role') || 'user',
        emailVerified: user.get('emailVerified') || false,
        profilePicture: user.get('profilePicture'),
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: user.updatedAt?.toISOString() || new Date().toISOString()
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  }

  // Update user role (admin only)
  static async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      await currentUser.fetch();
      const currentRole = currentUser.get('role');
      
      if (currentRole !== 'admin') {
        throw new Error('Forbidden: Admin access required');
      }

      // Prevent changing own role
      if (userId === currentUser.id) {
        throw new Error('Cannot change your own role');
      }

      const query = new Parse.Query(Parse.User);
      const targetUser = await query.get(userId);

      if (!targetUser) {
        throw new Error('User not found');
      }

      targetUser.set('role', role);
      await targetUser.save(null, { useMasterKey: false });

      return {
        objectId: targetUser.id || '',
        username: targetUser.get('username') || '',
        email: targetUser.get('email') || '',
        role: targetUser.get('role') || 'user',
        emailVerified: targetUser.get('emailVerified') || false,
        profilePicture: targetUser.get('profilePicture'),
        createdAt: targetUser.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: targetUser.updatedAt?.toISOString() || new Date().toISOString()
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user role');
    }
  }

  // Delete user (admin only)
  static async deleteUser(userId: string): Promise<void> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      await currentUser.fetch();
      const currentRole = currentUser.get('role');
      
      if (currentRole !== 'admin') {
        throw new Error('Forbidden: Admin access required');
      }

      // Prevent deleting self
      if (userId === currentUser.id) {
        throw new Error('Cannot delete your own account');
      }

      const query = new Parse.Query(Parse.User);
      const targetUser = await query.get(userId);

      if (!targetUser) {
        throw new Error('User not found');
      }

      await targetUser.destroy(null, { useMasterKey: false });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete user');
    }
  }
}

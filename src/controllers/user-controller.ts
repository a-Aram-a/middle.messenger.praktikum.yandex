import { userAPI, type ProfileData, type PasswordData } from '@/app/api/user-api';
import { type User } from '@/app/api/auth-api';
import store from '@/core/store/store';
import { Router } from '@/core/router';

class UserController {
  private readonly router;

  constructor() {
    this.router = new Router('#app');
  }

  public async updateProfile(data: ProfileData): Promise<User | null> {
    try {
      const user = await userAPI.updateProfile(data);
      store.set('user', user);
      this.router.go('/settings');
      return user;
    } catch (e: any) {
      const errorMessage = e.reason || e.message || 'Failed to update profile';
      console.error('Update profile failed:', errorMessage);
      alert(`Error: ${errorMessage}`);
      return null;
    }
  }

  public async updateAvatar(file: File): Promise<User | null> {
    try {
      const user = await userAPI.updateAvatar(file);
      store.set('user', user);
      return user;
    } catch (e: any) {
      const errorMessage = e.reason || e.message || 'Failed to update avatar';
      console.error('Update avatar failed:', errorMessage);
      alert(`Error: ${errorMessage}`);
      return null;
    }
  }

  public async updatePassword(data: PasswordData): Promise<boolean> {
    try {
      await userAPI.updatePassword(data);
      this.router.go('/settings');
      return true;
    } catch (e: any) {
      const errorMessage = e.reason || e.message || 'Failed to update password';
      console.error('Update password failed:', errorMessage);
      alert(`Error: ${errorMessage}`);
      return false;
    }
  }

  public async searchUsers(login: string): Promise<User[]> {
    try {
      return await userAPI.searchUsers(login);
    } catch (e: any) {
      const errorMessage = e.reason || e.message || 'Failed to search users';
      console.error('Search users failed:', errorMessage);
      alert(`Error: ${errorMessage}`);
      return [];
    }
  }
}

export default new UserController();

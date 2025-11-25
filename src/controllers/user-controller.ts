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
      console.error('Update profile failed:', e.reason || e.message);
      return null;
    }
  }

  public async updateAvatar(file: File): Promise<User | null> {
    try {
      const user = await userAPI.updateAvatar(file);
      store.set('user', user);
      return user;
    } catch (e: any) {
      console.error('Update avatar failed:', e.reason || e.message);
      return null;
    }
  }

  public async updatePassword(data: PasswordData): Promise<boolean> {
    try {
      await userAPI.updatePassword(data);
      this.router.go('/settings');
      return true;
    } catch (e: any) {
      console.error('Update password failed:', e.reason || e.message);
      return false;
    }
  }

  public async searchUsers(login: string): Promise<User[]> {
    try {
      return await userAPI.searchUsers(login);
    } catch (e: any) {
      console.error('Search users failed:', e.reason || e.message);
      return [];
    }
  }
}

export default new UserController();

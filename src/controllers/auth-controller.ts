import { authAPI, type SigninData, type SignupData, type User } from '@/app/api/auth-api';
import store from '@/core/store/store';
import { Router } from '@/core/router';

class AuthController {
  private readonly router;

  constructor() {
    this.router = new Router('#app');
  }

  public async signin(data: SigninData) {
    try {
      await authAPI.signin(data);
      await this.fetchUser();
      this.router.go('/messenger');
    } catch (e: any) {
      console.error('Signin failed:', e.reason || e.message);
    }
  }

  public async signup(data: SignupData) {
    try {
      await authAPI.signup(data);
      await this.fetchUser();
      this.router.go('/messenger');
    } catch (e: any) {
      console.error('Signup failed:', e.reason || e.message);
    }
  }

  public async fetchUser(): Promise<User | null> {
    try {
      const user = await authAPI.getUser();
      store.set('user', user);
      return user;
    } catch (e) {
      store.set('user', null);
      return null;
    }
  }

  public async logout() {
    try {
      await authAPI.logout();
      store.set('user', null);
      this.router.go('/');
    } catch (e: any) {
      console.error('Logout failed:', e.reason || e.message);
    }
  }
}

export default new AuthController();

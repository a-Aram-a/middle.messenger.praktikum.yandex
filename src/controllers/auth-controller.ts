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
      const errorMessage = e.reason || e.message || 'Failed to sign in';
      console.error('Signin failed:', errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  }

  public async signup(data: SignupData) {
    try {
      await authAPI.signup(data);
      await this.fetchUser();
      this.router.go('/messenger');
    } catch (e: any) {
      const errorMessage = e.reason || e.message || 'Failed to sign up';
      console.error('Signup failed:', errorMessage);
      alert(`Error: ${errorMessage}`);
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
      const errorMessage = e.reason || e.message || 'Failed to logout';
      console.error('Logout failed:', errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  }
}

export default new AuthController();

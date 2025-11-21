import './app/style/main.scss';

import {Router} from '@/core/router';
import {LoginPage} from '@/pages/login';
import {RegistrationPage} from '@/pages/registration';
import {NotFoundPage} from '@/pages/404';
import {ServerErrorPage} from '@/pages/500';
import {HomePage} from '@/pages/home';
import {ProfileEditDataPage, ProfileEditPasswordPage, ProfilePage} from '@/pages/profile';
import authController from '@/controllers/auth-controller';
import store from '@/core/store/store';

enum Routes {
  Index = '/',
  SignUp = '/sign-up',
  Settings = '/settings',
  Messenger = '/messenger',
  ProfileEditData = '/profile-edit-data',
  ProfileEditPassword = '/profile-edit-password',
  ServerError = '/500',
  NotFound = '/404',
}

document.addEventListener('DOMContentLoaded', async () => {
  const router = new Router('#app');

  router
    .use(Routes.Index, LoginPage)
    .use(Routes.SignUp, RegistrationPage)
    .use(Routes.Settings, ProfilePage)
    .use(Routes.Messenger, HomePage)
    .use(Routes.ProfileEditData, ProfileEditDataPage)
    .use(Routes.ProfileEditPassword, ProfileEditPasswordPage)
    .use(Routes.ServerError, ServerErrorPage)
    .use(Routes.NotFound, NotFoundPage);


  // Start the application by checking auth status first
  try {
    await authController.fetchUser();
    const {user} = store.getState();
    const currentPath = window.location.pathname;

    router.start();

    if (user) {
      if (currentPath === Routes.Index || currentPath === Routes.SignUp) {
        router.go(Routes.Messenger);
      }
    } else {
      const protectedRoutes = [Routes.Messenger, Routes.Settings, Routes.ProfileEditData, Routes.ProfileEditPassword];
      if (protectedRoutes.includes(currentPath as Routes)) {
        router.go(Routes.Index);
      }
    }
  } catch (e) {
    console.error('App initialization failed', e);

    router.start();
    router.go(Routes.Index);
  }
});


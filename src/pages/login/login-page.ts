import {Block} from '@/core/block';
import {MainLayout} from '@/layout/main';
import {AuthForm} from '@/components/auth-form';
import {TextInput} from '@/components/text-input';
import {Button} from '@/components/button';
import {Link} from '@/components/link';
import {ValidationRule} from '@/utils/validation';
import {ContentBlock} from '@/core/content-block';
import template from './login-page.hbs?raw';
import {setPageMetadata} from '@/utils/metadata';
import authController from '@/controllers/auth-controller';
import {type SigninData} from '@/app/api/auth-api';

export class LoginPage extends Block {
  constructor() {
    setPageMetadata({title: 'Sign in'});

    const loginInput = new TextInput({
      name: 'login',
      label: 'Login',
      validationRule: ValidationRule.Login,
    });

    const passwordInput = new TextInput({
      name: 'password',
      label: 'Password',
      type: 'password',
      validationRule: ValidationRule.Password,
    });

    const submitButton = new Button({
      label: 'Sign in',
      type: 'submit',
    });

    const registrationLink = new Link({
      href: '/sign-up',
      label: 'Registration',
      className: 'auth-form__link',
    });

    const authForm = new AuthForm({
      title: 'Log in',
      fields: [loginInput, passwordInput],
      buttons: [submitButton, registrationLink],
      onSubmit: (data) => {
        authController.signin(data as SigninData);
      },
    });

    // Wrap the page with MainLayout
    const mainLayout = new MainLayout({
      content: new ContentBlock({
        template: template,
        authForm: authForm,
      }),
    });

    super({
      mainLayout,
    });
  }

  render() {
    return '{{{ mainLayout }}}';
  }
}

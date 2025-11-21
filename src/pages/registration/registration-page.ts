import {Block} from '@/core/block';
import {MainLayout} from '@/layout/main';
import {AuthForm} from '@/components/auth-form';
import {TextInput} from '@/components/text-input';
import {Button} from '@/components/button';
import {Link} from '@/components/link';
import {ValidationRule} from '@/utils/validation';
import {ContentBlock} from '@/core/content-block';
import template from './registration-page.hbs?raw';
import {setPageMetadata} from '@/utils/metadata';
import authController from '@/controllers/auth-controller';
import {type SignupData} from '@/app/api/auth-api';

export class RegistrationPage extends Block {
  constructor() {
    setPageMetadata({title: 'Sign up'});

    const fields = [
      new TextInput({name: 'email', label: 'Email', type: 'email', validationRule: ValidationRule.Email}),
      new TextInput({name: 'login', label: 'Login', validationRule: ValidationRule.Login}),
      new TextInput({name: 'first_name', label: 'First Name', validationRule: ValidationRule.FirstName}),
      new TextInput({name: 'second_name', label: 'Second Name', validationRule: ValidationRule.SecondName}),
      new TextInput({name: 'phone', label: 'Phone', type: 'tel', validationRule: ValidationRule.Phone}),
      new TextInput({
        name: 'password',
        label: 'Password',
        type: 'password',
        validationRule: ValidationRule.Password,
      }),
      new TextInput({
        name: 'password_repeat',
        label: 'Repeat Password',
        type: 'password',
        validationRule: ValidationRule.Password,
      }),
    ];

    const submitButton = new Button({
      label: 'Sign up',
      type: 'submit',
    });

    const loginLink = new Link({
      href: '/',
      label: 'Log in',
      className: 'auth-form__link',
    });

    const authForm = new AuthForm({
      title: 'Registration',
      fields: fields,
      buttons: [submitButton, loginLink],
      onSubmit: (data) => {
        if (data.password !== data.password_repeat) {
          const repeatField = fields.find(f => f.name === 'password_repeat');
          if (repeatField) {
            repeatField.setProps({error: 'Passwords do not match', value: repeatField.value()});
          }
          return;
        }
        delete data.password_repeat;

        authController.signup(data as SignupData);
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

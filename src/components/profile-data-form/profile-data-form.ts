import './profile-data-form.scss';

import { Block, type Props } from '@/core/block';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { ProfileAvatar } from '@/components/profile-avatar';
import { ValidationRule } from '@/utils/validation';
import template from './profile-data-form.hbs?raw';
import { validateAndCollectData } from '@/utils/validation';
import { connect } from '@/core/store/store';
import { type User } from '@/app/api/auth-api';
import userController from '@/controllers/user-controller';
import { API_BASE_URL } from '@/core/constants';

interface ProfileDataFormProps extends Props {
  isDisabled?: boolean;
  onSubmit?: (data: Record<string, string>) => void;
  user?: User | null;
}

class ProfileDataFormBase extends Block<ProfileDataFormProps> {
  private _fields: TextInput[];

  constructor(props: ProfileDataFormProps) {
    const user = props.user;

    const fields = [
      new TextInput({
        name: 'email',
        label: 'Email',
        type: 'email',
        initialValue: user?.email || '',
        validationRule: ValidationRule.Email,
      }),
      new TextInput({
        name: 'login',
        label: 'Login',
        initialValue: user?.login || '',
        validationRule: ValidationRule.Login,
      }),
      new TextInput({
        name: 'first_name',
        label: 'First Name',
        initialValue: user?.first_name || '',
        validationRule: ValidationRule.FirstName,
      }),
      new TextInput({
        name: 'second_name',
        label: 'Second Name',
        initialValue: user?.second_name || '',
        validationRule: ValidationRule.SecondName,
      }),
      new TextInput({
        name: 'display_name',
        label: 'Display Name',
        initialValue: user?.display_name || '',
        validationRule: ValidationRule.Login,
      }),
      new TextInput({
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        initialValue: user?.phone || '',
        validationRule: ValidationRule.Phone,
      }),
    ];

    if (props.isDisabled) {
      fields.forEach(field => field.setProps({ disabled: true }));
    }

    const avatarUrl = user?.avatar
      ? `${API_BASE_URL}/resources${user.avatar}`
      : '/images/icons/avatar-placeholder.svg';

    super({
      ...props,
      profileAvatar: new ProfileAvatar({
        avatarUrl,
        disabled: props.isDisabled,
        onAvatarChange: (file: File) => userController.updateAvatar(file),
      }),
      displayName: user?.display_name || user?.first_name || '',
      fields: fields,
      submitButton: !props.isDisabled ? new Button({ type: 'submit', label: 'Save' }) : undefined,
      events: {
        submit: (event: Event) => this.handleSubmit(event),
      },
    });

    this._fields = fields;
  }

  componentDidUpdate(oldProps: ProfileDataFormProps, newProps: ProfileDataFormProps): boolean {
    if (oldProps.user !== newProps.user && newProps.user) {
      const user = newProps.user;
      this._fields[0].setProps({ initialValue: user.email, value: user.email });
      this._fields[1].setProps({ initialValue: user.login, value: user.login });
      this._fields[2].setProps({ initialValue: user.first_name, value: user.first_name });
      this._fields[3].setProps({ initialValue: user.second_name, value: user.second_name });
      this._fields[4].setProps({ initialValue: user.display_name || '', value: user.display_name || '' });
      this._fields[5].setProps({ initialValue: user.phone, value: user.phone });

      const avatarUrl = user.avatar
        ? `${API_BASE_URL}/resources${user.avatar}`
        : '/images/icons/avatar-placeholder.svg';
      (this.children.profileAvatar as unknown as ProfileAvatar).setProps({ avatarUrl });

      this.setProps({ displayName: user.display_name || user.first_name || '' });
    }
    return true;
  }

  handleSubmit(event: Event) {
    event.preventDefault();

    const fields = this.children.fields as TextInput[];
    const { isValid, data } = validateAndCollectData(fields);

    if (!isValid) {
      return;
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    }
  }

  render() {
    return template;
  }
}

export const ProfileDataForm = connect((state) => ({
  user: state.user as User | null,
}))(ProfileDataFormBase);

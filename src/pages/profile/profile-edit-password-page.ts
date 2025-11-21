import { Block } from '@/core/block';
import { ProfileLayout } from '@/layout/profile';
import { ProfilePasswordForm } from '@/components/profile-password-form';
import { setPageMetadata } from '@/utils/metadata';
import userController from '@/controllers/user-controller';
import { type PasswordData } from '@/app/api/user-api';

export class ProfileEditPasswordPage extends Block {
  constructor() {
    setPageMetadata({ title: 'Change Password', description: 'Change your account password.' });

    const profilePasswordForm = new ProfilePasswordForm({
      onSubmit: (data) => {
        userController.updatePassword(data as PasswordData);
      },
    });

    const profileLayout = new ProfileLayout({
      profileForm: profilePasswordForm,
      profileButtons: [],
    });

    super({
      profileLayout,
    });
  }

  render() {
    return '{{{ profileLayout }}}';
  }
}

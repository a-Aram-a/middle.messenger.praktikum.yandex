import { Block } from '@/core/block';
import { ProfileLayout } from '@/layout/profile';
import { ProfileDataForm } from '@/components/profile-data-form';
import { setPageMetadata } from '@/utils/metadata';
import userController from '@/controllers/user-controller';
import { type ProfileData } from '@/app/api/user-api';

export class ProfileEditDataPage extends Block {
  constructor() {
    setPageMetadata({ title: 'Edit Profile', description: 'Edit your profile information.' });

    const profileDataForm = new ProfileDataForm({
      onSubmit: (data) => {
        userController.updateProfile(data as ProfileData);
      },
    });


    const profileLayout = new ProfileLayout({
      profileForm: profileDataForm,
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

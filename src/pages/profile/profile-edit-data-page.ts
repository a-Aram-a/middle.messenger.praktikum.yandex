import { Block } from '@/core/block';
import { ProfileLayout } from '@/layout/profile';
import { ProfileDataForm } from '@/components/profile-data-form';
import { setPageMetadata } from '@/utils/metadata';

export class ProfileEditDataPage extends Block {
  constructor() {
    setPageMetadata({ title: 'Edit Profile', description: 'Edit your profile information.' });

    const profileDataForm = new ProfileDataForm({
      onSubmit: (data) => {
        console.log('Profile data form submitted:', data);
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

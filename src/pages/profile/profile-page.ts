import { Block } from '@/core/block';
import { ProfileLayout } from '@/layout/profile';
import { ProfileDataForm } from '@/components/profile-data-form';
import { Link } from '@/components/link';
import { setPageMetadata } from '@/utils/metadata';

export class ProfilePage extends Block {
  constructor() {
    setPageMetadata({ title: 'Profile', description: 'View your profile information.' });

    const profileDataForm = new ProfileDataForm({
      isDisabled: true,
    });

    const profileButtons = [
      new Link({ href: '/profile-edit-data', label: 'Edit Data', className: 'profile-page__button' }),
      new Link({ href: '/profile-edit-password', label: 'Change the password', className: 'profile-page__button' }),
      new Link({ href: '/login', label: 'Log Out', className: 'profile-page__button link_danger' }),
    ];

    const profileLayout = new ProfileLayout({
      profileForm: profileDataForm,
      profileButtons: profileButtons,
    });

    super({
      profileLayout,
    });
  }

  render() {
    return '{{{ profileLayout }}}';
  }
}

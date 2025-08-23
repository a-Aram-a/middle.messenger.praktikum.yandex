import {Block} from '@/core/block';
import {ProfileLayout} from '@/layout/profile';
import {ProfilePasswordForm} from '@/components/profile-password-form';
import {setPageMetadata} from '@/utils/metadata';

export class ProfileEditPasswordPage extends Block {
    constructor() {
        setPageMetadata({title: 'Change Password', description: 'Change your account password.'},);

        const profilePasswordForm = new ProfilePasswordForm({
            onSubmit: (data) => {
                console.log('Password form submitted:', data);
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

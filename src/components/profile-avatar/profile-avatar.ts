import './profile-avatar.scss';

import { Block, type Props } from '@/core/block';
import template from './profile-avatar.hbs?raw';

interface ProfileAvatarProps extends Props {
  avatarUrl: string;
  className?: string;
  disabled?: boolean;
  onAvatarChange?: (file: File) => void;
}

export class ProfileAvatar extends Block<ProfileAvatarProps> {
  constructor(props: ProfileAvatarProps) {
    super({
      className: '',
      ...props,
    });
  }

  public componentDidMount(): void {
    const input = this.getContent()?.querySelector('input[type="file"]') as HTMLInputElement;
    if (input && this.props.onAvatarChange) {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file && this.props.onAvatarChange) {
          this.props.onAvatarChange(file);
        }
      });
    }
  }

  render() {
    return template;
  }
}

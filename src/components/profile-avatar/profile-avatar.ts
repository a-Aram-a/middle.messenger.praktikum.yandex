import './profile-avatar.scss'

import {Block, type Props} from "@/core/block";
import template from './profile-avatar.hbs?raw';

interface ProfileAvatarProps extends Props {
    avatarUrl: string
    className?: string
}

export class ProfileAvatar extends Block<ProfileAvatarProps> {
    constructor(props: ProfileAvatarProps) {
        super({
            className: '',
            ...props
        });
    }

    render() {
        return template;
    }
}

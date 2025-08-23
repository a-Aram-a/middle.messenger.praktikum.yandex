import './chat-header.scss';

import {Block, type Props} from '@/core/block';
import template from './chat-header.hbs?raw';

interface ChatHeaderProps extends Props {
    avatarUrl: string;
    name: string;
}

export class ChatHeader extends Block<ChatHeaderProps> {
    constructor(props: ChatHeaderProps) {
        super(props);
    }

    render() {
        return template;
    }
}

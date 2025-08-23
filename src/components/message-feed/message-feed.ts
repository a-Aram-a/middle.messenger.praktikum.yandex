import './message-feed.scss';

import {Block, type Props} from '@/core/block';
import template from './message-feed.hbs?raw';
import {Message} from "@/components/message";
import {DateSeparator} from "@/components/date-separator";

interface MessageFeedProps extends Props {
    items: (Message | DateSeparator)[];
}

export class MessageFeed extends Block<MessageFeedProps> {
    constructor(props: MessageFeedProps) {
        super(props);
    }

    render() {
        return template;
    }
}

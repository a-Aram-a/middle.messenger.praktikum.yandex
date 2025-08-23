import './link.scss'

import {Block, type Props} from '@/core/block';
import template from './link.hbs?raw';

interface LinkProps extends Props {
    href: string;
    label?: string;
    content?: Block;
    variant?: 'primary' | 'danger' | 'button' | 'button-primary';
    className?: string;
}

export class Link extends Block<LinkProps> {
    constructor(props: LinkProps) {
        super({
            variant: 'primary',
            ...props,
        });
    }

    render() {
        return template;
    }
}

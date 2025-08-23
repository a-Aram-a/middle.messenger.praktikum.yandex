import './error-page.scss';

import {Block, type Props} from '@/core/block';
import {Link} from '@/components/link';
import template from './error-page.hbs?raw';

interface ErrorPageProps extends Props {
    errorCode: string;
    errorMessage: string;
}

export class ErrorPage extends Block<ErrorPageProps> {
    constructor(props: ErrorPageProps) {
        super({
            ...props,
            homeLink: new Link({
                href: '/home',
                label: 'Go to Home',
                className: 'error-page__link',
            }),
        });
    }

    render() {
        return template;
    }
}

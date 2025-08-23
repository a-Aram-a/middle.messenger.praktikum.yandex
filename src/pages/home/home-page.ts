import './home-page.scss';

import {Block} from '@/core/block';
import {MainLayout} from '@/layout/main';
import {Link} from '@/components/link';
import {SearchInput} from '@/components/search-input';
import {setPageMetadata} from '@/utils/metadata';
import {ContentBlock} from '@/core/content-block';
import template from './home-page.hbs?raw';

export class HomePage extends Block {
    constructor() {
        setPageMetadata({title: 'Home', description: 'Your chats and messages.'},);

        const profileLink = new Link({
            href: '/profile',
            label: 'Profile >',
            className: 'home-page__profile-link',
        });

        const searchInput = new SearchInput({
            onInput: (value) => {
                console.log('Search input:', value);
            },
        });

        // Wrap the page with MainLayout
        const mainLayout = new MainLayout({
            content: new ContentBlock({
                template: template,
                profileLink: profileLink,
                searchInput: searchInput,
            }),
        });

        super({
            mainLayout,
        });
    }

    render() {
        return '{{{ mainLayout }}}';
    }
}

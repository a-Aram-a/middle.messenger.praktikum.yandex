import { Block } from '@/core/block';
import { MainLayout } from '@/layout/main';
import { Link } from '@/components/link';
import { setPageMetadata } from '@/utils/metadata';
import { ContentBlock } from '@/core/content-block';
import template from './index-page.hbs?raw';

export class IndexPage extends Block {
  constructor() {
    setPageMetadata({ title: 'Home', description: 'A secure messaging app built with modern web technologies.' });

    const pageLinks = [
      { href: '/', label: 'Log In' },
      { href: '/sign-up', label: 'Registration' },
      { href: '/404', label: 'Error 404' },
      { href: '/500', label: 'Error 500' },
      { href: '/messenger', label: 'Messenger (Chat)' },
      { href: '/settings', label: 'Profile' },
      { href: '/profile-edit-data', label: 'Edit profile data' },
      { href: '/profile-edit-password', label: 'Edit password' },
    ];

    const linkComponents = pageLinks.map(link => new Link(link));

    // Wrap the page with MainLayout
    const mainLayout = new MainLayout({
      content: new ContentBlock({
        template: template,
        title: 'Nuclear Messenger',
        description: 'A secure messaging app built with modern web technologies.',
        links: linkComponents,
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

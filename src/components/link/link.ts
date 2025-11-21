import './link.scss';

import {Block, type Props} from '@/core/block';
import {Router} from '@/core/router';
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
      events: {
        click: (event: Event) => this.navigate(event),
      },
    });
  }

  navigate(event: Event) {
    event.preventDefault();

    const router = new Router('#app');
    router.go(this.props.href);
  }

  render() {
    return template;
  }
}

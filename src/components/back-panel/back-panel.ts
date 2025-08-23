import './back-panel.scss';

import { Block, type Props } from '@/core/block';
import template from './back-panel.hbs?raw';
import { Link } from '@/components/link';

interface BackPanelProps extends Props {
  backLink: string;
}

export class BackPanel extends Block<BackPanelProps> {
  constructor(props: BackPanelProps) {
    super({
      link: new Link({
        href: props.backLink,
        variant: 'button-primary',
        className: 'back-panel__link',
        label: '←',
      }),
      ...props,
    });
  }

  render() {
    return template;
  }
}

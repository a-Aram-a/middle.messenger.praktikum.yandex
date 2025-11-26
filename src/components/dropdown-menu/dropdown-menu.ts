import './dropdown-menu.scss';

import { Block, type Props } from '@/core/block';
import template from './dropdown-menu.hbs?raw';

interface MenuItemProps extends Props {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export class MenuItem extends Block<MenuItemProps> {
  constructor(props: MenuItemProps) {
    const variantClass = props.variant === 'danger' ? 'dropdown-menu__item_danger' : '';
    super({
      ...props,
      className: variantClass,
      events: {
        click: () => props.onClick(),
      },
    });
  }

  render() {
    return '<button class="dropdown-menu__item {{className}}">{{label}}</button>';
  }
}

interface DropdownMenuProps extends Props {
  items: MenuItem[];
}

export class DropdownMenu extends Block<DropdownMenuProps> {
  render() {
    return template;
  }
}

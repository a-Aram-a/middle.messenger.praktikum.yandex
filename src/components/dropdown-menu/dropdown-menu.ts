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
    super({
      ...props,
      events: {
        click: () => props.onClick(),
      },
    });
  }

  render() {
    const variantClass = this.props.variant === 'danger' ? 'dropdown-menu__item_danger' : '';
    return `<button class="dropdown-menu__item ${variantClass}">{{label}}</button>`;
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

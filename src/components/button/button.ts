import './button.scss';

import { Block, type Props } from '@/core/block';
import template from './button.hbs?raw';


interface ButtonProps extends Props {
  label?: string;
  content?: Block;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  className?: string;
}

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super({
      type: 'button',
      variant: 'primary',
      ...props,
    });
  }

  render() {
    return template;
  }
}

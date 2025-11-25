import './modal.scss';

import { Block, type Props } from '@/core/block';
import template from './modal.hbs?raw';

interface ModalProps extends Props {
  title?: string;
  body: Block;
  actions?: Block[];
  onClose?: () => void;
}

export class Modal extends Block<ModalProps> {
  constructor(props: ModalProps) {
    super({
      ...props,
      events: {
        'click@.modal__overlay': () => {
          if (props.onClose) {
            props.onClose();
          }
        },
      },
    });
  }

  render() {
    return template;
  }
}

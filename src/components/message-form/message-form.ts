import './message-form.scss';

import { Block, type Props } from '@/core/block';
import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';
import { ValidationRule } from '@/utils/validation';
import template from './message-form.hbs?raw';

interface MessageFormProps extends Props {
  onSubmit: (message: string) => void;
}

export class MessageForm extends Block<MessageFormProps> {
  constructor(props: MessageFormProps) {
    const attachButton = new Button({
      label: '',
      variant: 'secondary',
      className: 'message-form__attach-button',
      events: {
        click: () => {
          console.log('Attach button clicked!');
        },
      },
    });

    const messageInput = new TextInput({
      name: 'message',
      label: '',
      placeholder: 'Message',
      validationRule: ValidationRule.Message,
      className: 'message-form__input',
    });

    const sendButton = new Button({
      type: 'submit',
      label: '→',
      className: 'message-form__send-button',
    });

    super({
      ...props,
      attachButton: attachButton,
      messageInput: messageInput,
      sendButton: sendButton,
      events: {
        submit: (event: Event) => this.handleSubmit(event),
      },
    });
  }

  private handleSubmit(event: Event) {
    event.preventDefault();

    const messageInput = this.children.messageInput as TextInput;
    const isMessageValid = messageInput.validate();

    if (!isMessageValid) {
      return;
    }

    this.props.onSubmit(messageInput.value());

    messageInput.setProps({ value: '' });
  }

  render() {
    return template;
  }
}

import { Block, type Props } from '@/core/block';
import { Modal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';
import { ValidationRule } from '@/utils/validation';
import chatController from '@/controllers/chat-controller';
import template from './create-chat-modal.hbs?raw';

interface CreateChatModalProps extends Props {
  onClose: () => void;
}

class CreateChatFormBody extends Block {
  private _input: TextInput;

  constructor() {
    const input = new TextInput({
      name: 'title',
      label: 'Chat name',
      validationRule: ValidationRule.ChatName,
    });

    super({ input });
    this._input = input;
  }

  public getTitle(): string {
    return this._input.value();
  }

  public validate(): boolean {
    return this._input.validate();
  }

  render() {
    return template;
  }
}

export class CreateChatModal extends Block<CreateChatModalProps> {
  constructor(props: CreateChatModalProps) {
    const formBody = new CreateChatFormBody();

    const createButton = new Button({
      label: 'Create',
      type: 'button',
      events: {
        click: async () => {
          if (!formBody.validate()) return;

          const title = formBody.getTitle();
          if (title) {
            await chatController.createChat(title);
            props.onClose();
          }
        },
      },
    });

    const cancelButton = new Button({
      label: 'Cancel',
      variant: 'secondary',
      type: 'button',
      events: {
        click: () => props.onClose(),
      },
    });

    const modal = new Modal({
      title: 'Create new chat',
      body: formBody,
      actions: [createButton, cancelButton],
      onClose: props.onClose,
    });

    super({
      ...props,
      modal,
    });
  }

  render() {
    return '{{{modal}}}';
  }
}

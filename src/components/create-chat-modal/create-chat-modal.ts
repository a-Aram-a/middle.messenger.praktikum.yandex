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

  constructor(props: { onSubmit: () => void }) {
    const input = new TextInput({
      name: 'title',
      label: 'Chat name',
      validationRule: ValidationRule.ChatName,
    });

    super({
      input,
      events: {
        submit: (e: Event) => {
          e.preventDefault();
          props.onSubmit();
        },
      },
    });
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
    let formBody: CreateChatFormBody;

    const handleSubmit = async () => {
      if (!formBody.validate()) return;

      const title = formBody.getTitle();
      if (title) {
        await chatController.createChat(title);
        props.onClose();
      }
    };

    formBody = new CreateChatFormBody({ onSubmit: handleSubmit });

    const createButton = new Button({
      label: 'Create',
      type: 'submit',
      form: 'create-chat-form',
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

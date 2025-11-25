import { Block, type Props } from '@/core/block';
import { Modal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';
import { ValidationRule } from '@/utils/validation';
import userController from '@/controllers/user-controller';
import chatController from '@/controllers/chat-controller';
import template from './user-modal.hbs?raw';

interface UserModalProps extends Props {
  chatId: number;
  mode: 'add' | 'remove';
  onClose: () => void;
}

class UserModalFormBody extends Block {
  private _input: TextInput;

  constructor() {
    const input = new TextInput({
      name: 'login',
      label: 'User login',
      validationRule: ValidationRule.Login,
    });

    super({ input });
    this._input = input;
  }

  public getLogin(): string {
    return this._input.value();
  }

  public validate(): boolean {
    return this._input.validate();
  }

  public setError(message: string): void {
    this._input.setProps({ error: message, value: this._input.value() });
  }

  render() {
    return template;
  }
}

export class UserModal extends Block<UserModalProps> {
  constructor(props: UserModalProps) {
    const formBody = new UserModalFormBody();
    const isAdd = props.mode === 'add';

    const actionButton = new Button({
      label: isAdd ? 'Add' : 'Remove',
      type: 'button',
      variant: isAdd ? 'primary' : 'primary',
      events: {
        click: async () => {
          if (!formBody.validate()) return;

          const login = formBody.getLogin();
          const users = await userController.searchUsers(login);

          if (users.length === 0) {
            formBody.setError('User not found');
            return;
          }

          const user = users[0];
          let success: boolean;

          if (isAdd) {
            success = await chatController.addUserToChat(user.id, props.chatId);
          } else {
            success = await chatController.removeUserFromChat(user.id, props.chatId);
          }

          if (success) {
            props.onClose();
          } else {
            formBody.setError(isAdd ? 'Failed to add user' : 'Failed to remove user');
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
      title: isAdd ? 'Add user' : 'Remove user',
      body: formBody,
      actions: [actionButton, cancelButton],
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

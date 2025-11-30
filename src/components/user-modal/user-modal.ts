import './user-select-modal.scss';

import { Block, type Props } from '@/core/block';
import { Modal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';
import { ValidationRule } from '@/utils/validation';
import userController from '@/controllers/user-controller';
import chatController from '@/controllers/chat-controller';
import { type ChatUser } from '@/app/api/chat-api';
import template from './user-modal.hbs?raw';
import selectTemplate from './user-select-modal.hbs?raw';

interface UserModalProps extends Props {
  chatId: number;
  mode: 'add' | 'remove';
  onClose: () => void;
  users?: ChatUser[];
}

class UserModalFormBody extends Block {
  private _input: TextInput;

  constructor(props: { onSubmit: () => void }) {
    const input = new TextInput({
      name: 'login',
      label: 'User login',
      validationRule: ValidationRule.Login,
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

class UserSelectFormBody extends Block {
  constructor(props: { users: ChatUser[]; onSubmit: () => void }) {
    super({
      users: props.users.map(u => ({ ...u, id: u.login })),
      events: {
        submit: (e: Event) => {
          e.preventDefault();
          props.onSubmit();
        },
      },
    });
  }

  public getUserId(): string {
    const select = this.getContent()?.querySelector('select[name="userId"]') as HTMLSelectElement;
    return select?.value || '';
  }

  public validate(): boolean {
    return !!this.getUserId();
  }

  public setError(message: string): void {
    this.setProps({ error: message });
  }

  render() {
    return selectTemplate;
  }
}

export class UserModal extends Block<UserModalProps> {
  constructor(props: UserModalProps) {
    const isAdd = props.mode === 'add';
    const useSelect = !isAdd && props.users && props.users.length > 0;

    const handleSubmitText = async (formBody: UserModalFormBody) => {
      if (!formBody.validate()) return;

      const login = formBody.getLogin();
      const users = await userController.searchUsers(login);

      if (users.length === 0) {
        formBody.setError('User not found');
        return;
      }

      const user = users[0];
      const success = isAdd
        ? await chatController.addUserToChat(user.id, props.chatId)
        : await chatController.removeUserFromChat(user.id, props.chatId);

      if (success) {
        props.onClose();
      } else {
        formBody.setError(isAdd ? 'Failed to add user' : 'Failed to remove user');
      }
    };

    const handleSubmitSelect = async (formBody: UserSelectFormBody) => {
      if (!formBody.validate()) return;

      const userLogin = formBody.getUserId();

      // Search for the user to get their ID
      const users = await userController.searchUsers(userLogin);

      if (users.length === 0) {
        formBody.setError('User not found');
        return;
      }

      const user = users[0];
      const success = await chatController.removeUserFromChat(user.id, props.chatId);

      if (success) {
        props.onClose();
      } else {
        formBody.setError('Failed to remove user');
      }
    };

    let formBody: UserModalFormBody | UserSelectFormBody;

    if (useSelect) {
      formBody = new UserSelectFormBody({
        users: props.users!,
        onSubmit: () => handleSubmitSelect(formBody as UserSelectFormBody),
      });
    } else {
      formBody = new UserModalFormBody({
        onSubmit: () => handleSubmitText(formBody as UserModalFormBody),
      });
    }

    const actionButton = new Button({
      label: isAdd ? 'Add' : 'Remove',
      type: 'submit',
      variant: isAdd ? 'primary' : 'primary',
      form: useSelect ? 'user-select-form' : 'user-modal-form',
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

import { Block, type Props } from '@/core/block';
import { ChatHeader } from '@/components/chat-header';
import { MessageFeed } from '@/components/message-feed';
import { MessageForm } from '@/components/message-form';
import { Button } from '@/components/button';
import { DropdownMenu, MenuItem } from '@/components/dropdown-menu';
import { UserModal } from '@/components/user-modal';
import { type Chat } from '@/app/api/chat-api';
import template from './chat-view.hbs?raw';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://ya-praktikum.tech/api/v2';

interface ChatViewProps extends Props {
  chat: Chat;
}

export class ChatView extends Block<ChatViewProps> {
  private _isMenuOpen = false;

  constructor(props: ChatViewProps) {
    const { chat } = props;

    const avatarUrl = chat.avatar
      ? `${API_BASE_URL}/resources${chat.avatar}`
      : '/images/icons/avatar-placeholder.svg';

    const chatHeader = new ChatHeader({
      avatarUrl,
      name: chat.title,
    });

    const menuButton = new Button({
      className: 'chat-view__menu-button',
      label: '',
      events: {
        click: (e: Event) => {
          e.stopPropagation();
          this.toggleMenu();
        },
      },
    });

    const dropdownMenu = new DropdownMenu({
      items: [
        new MenuItem({
          label: 'Add a user',
          onClick: () => this.showUserModal('add'),
        }),
        new MenuItem({
          label: 'Remove a user',
          onClick: () => this.showUserModal('remove'),
          variant: 'danger',
        }),
      ],
    });

    const messageFeed = new MessageFeed({ items: [] });

    const messageForm = new MessageForm({
      onSubmit: (message) => {
        console.log('Message to send:', message);
      },
    });

    super({
      ...props,
      chatHeader,
      menuButton,
      dropdownMenu,
      messageFeed,
      messageForm,
      isMenuOpen: false,
      userModal: null,
    });
  }

  private toggleMenu(): void {
    this._isMenuOpen = !this._isMenuOpen;
    this.setProps({ isMenuOpen: this._isMenuOpen });
  }

  private closeMenu(): void {
    if (this._isMenuOpen) {
      this._isMenuOpen = false;
      this.setProps({ isMenuOpen: false });
    }
  }

  private showUserModal(mode: 'add' | 'remove'): void {
    this.closeMenu();
    const modal = new UserModal({
      chatId: this.props.chat.id,
      mode,
      onClose: () => this.hideUserModal(),
    });
    this.setProps({ userModal: modal });
  }

  private hideUserModal(): void {
    this.setProps({ userModal: null });
  }

  public componentDidMount(): void {
    document.addEventListener('click', () => this.closeMenu());
  }

  render() {
    return template;
  }
}

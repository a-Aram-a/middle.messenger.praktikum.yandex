import { Block, type Props } from '@/core/block';
import { ChatHeader } from '@/components/chat-header';
import { MessageFeed } from '@/components/message-feed';
import { MessageForm } from '@/components/message-form';
import { Message } from '@/components/message';
import { Button } from '@/components/button';
import { DropdownMenu, MenuItem } from '@/components/dropdown-menu';
import { UserModal } from '@/components/user-modal';
import { type Chat, type Message as MessageType } from '@/app/api/chat-api';
import { connect } from '@/core/store/store';
import chatController from '@/controllers/chat-controller';
import { type User } from '@/app/api/auth-api';
import template from './chat-view.hbs?raw';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://ya-praktikum.tech/api/v2';

interface ChatViewProps extends Props {
  chat: Chat;
  messages?: MessageType[];
  user?: User;
}

class ChatViewBase extends Block<ChatViewProps> {
  private _isMenuOpen = false;

  private _messageFeed: MessageFeed;

  constructor(props: ChatViewProps) {
    const { chat, messages = [], user } = props;

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

    const messageItems = messages.map(msg => new Message({
      text: msg.content,
      timestamp: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isIncoming: user ? msg.user_id !== user.id : false,
    }));

    const messageFeed = new MessageFeed({ items: messageItems });

    const messageForm = new MessageForm({
      onSubmit: (message) => {
        if (message.trim()) {
          chatController.sendMessage(message);
        }
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

    this._messageFeed = messageFeed;
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

  public componentDidUpdate(oldProps: ChatViewProps, newProps: ChatViewProps): boolean {
    if (oldProps.messages !== newProps.messages) {
      const messageItems = (newProps.messages || []).map(msg => new Message({
        text: msg.content,
        timestamp: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isIncoming: newProps.user ? msg.user_id !== newProps.user.id : false,
      }));
      this._messageFeed.setProps({ items: messageItems });
      return false;
    }
    return true;
  }

  render() {
    return template;
  }
}

export const ChatView = connect((state) => ({
  messages: state.messages as MessageType[] | undefined,
  user: state.user as User | undefined,
}))(ChatViewBase);

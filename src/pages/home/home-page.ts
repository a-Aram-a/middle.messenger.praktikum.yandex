import './home-page.scss';

import { Block, type Props } from '@/core/block';
import { MainLayout } from '@/layout/main';
import { Link } from '@/components/link';
import { SearchInput } from '@/components/search-input';
import { ChatList } from '@/components/chat-list';
import { ChatItem } from '@/components/chat-item';
import { Button } from '@/components/button';
import { setPageMetadata } from '@/utils/metadata';
import { ContentBlock } from '@/core/content-block';
import template from './home-page.hbs?raw';
import chatController from '@/controllers/chat-controller';
import { connect } from '@/core/store/store';
import { type Chat } from '@/app/api/chat-api';
import { CreateChatModal } from '@/components/create-chat-modal';
import { ChatPlaceholder } from '@/components/chat-placeholder';
import { ChatView } from '@/components/chat-view';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://ya-praktikum.tech/api/v2';

interface HomePageProps extends Props {
  chats?: Chat[];
  selectedChat?: Chat | null;
}

class HomePageBase extends Block<HomePageProps> {
  private _chatList: ChatList;

  private _contentBlock: ContentBlock;

  constructor(props: HomePageProps) {
    setPageMetadata({ title: 'Home', description: 'Your chats and messages.' });

    const profileLink = new Link({ href: '/settings', label: 'Profile >', className: 'home-page__profile-link' });
    const searchInput = new SearchInput({ onInput: (value) => console.log('Search:', value) });

    const createChatButton = new Button({
      label: '+ New Chat',
      variant: 'secondary',
      className: 'home-page__create-chat-btn',
      events: {
        click: () => this.showCreateChatModal(),
      },
    });

    const chatItems = (props.chats || []).map(chat => new ChatItem({
      id: chat.id,
      avatarUrl: chat.avatar ? `${API_BASE_URL}/resources${chat.avatar}` : '/images/icons/avatar-placeholder.svg',
      name: chat.title,
      lastMessageTime: chat.last_message?.time ? new Date(chat.last_message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      lastMessageText: chat.last_message?.content || '',
      unreadCount: chat.unread_count || undefined,
    }));
    const chatList = new ChatList({ chats: chatItems });

    const chatContent = props.selectedChat
      ? new ChatView({ chat: props.selectedChat })
      : new ChatPlaceholder();

    // Wrap the page with MainLayout
    const contentBlock = new ContentBlock({
      template: template,
      profileLink,
      searchInput,
      createChatButton,
      chatList,
      chatContent,
      createChatModal: null,
    });

    const mainLayout = new MainLayout({
      content: contentBlock,
    });

    super({
      ...props,
      mainLayout,
    });

    this._chatList = chatList;
    this._contentBlock = contentBlock;
  }

  private showCreateChatModal(): void {
    const modal = new CreateChatModal({
      onClose: () => this.hideCreateChatModal(),
    });
    this._contentBlock.setProps({ createChatModal: modal });
  }

  private hideCreateChatModal(): void {
    this._contentBlock.setProps({ createChatModal: null });
  }

  public componentDidMount(): void {
    chatController.getChats();
  }

  componentDidUpdate(oldProps: HomePageProps, newProps: HomePageProps): boolean {
    if (oldProps.chats !== newProps.chats) {
      const chatItems = (newProps.chats || []).map(chat => new ChatItem({
        id: chat.id,
        avatarUrl: chat.avatar ? `${API_BASE_URL}/resources${chat.avatar}` : '/images/icons/avatar-placeholder.svg',
        name: chat.title,
        lastMessageTime: chat.last_message?.time ? new Date(chat.last_message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        lastMessageText: chat.last_message?.content || '',
        unreadCount: chat.unread_count || undefined,
      }));
      this._chatList.setProps({ chats: chatItems });
    }

    if (oldProps.selectedChat !== newProps.selectedChat) {
      const chatContent = newProps.selectedChat
        ? new ChatView({ chat: newProps.selectedChat })
        : new ChatPlaceholder();
      this._contentBlock.setProps({ chatContent });
    }

    return false;
  }

  render() {
    return '{{{ mainLayout }}}';
  }
}

export const HomePage = connect((state) => ({
  chats: state.chats as Chat[] | undefined,
  selectedChat: state.selectedChat as Chat | null | undefined,
}))(HomePageBase);

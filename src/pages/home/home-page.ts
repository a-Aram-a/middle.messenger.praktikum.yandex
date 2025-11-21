import './home-page.scss';

import { Block } from '@/core/block';
import { MainLayout } from '@/layout/main';
import { Link } from '@/components/link';
import { SearchInput } from '@/components/search-input';
import { ChatList } from '@/components/chat-list';
import { ChatItem } from '@/components/chat-item';
import { ChatHeader } from '@/components/chat-header';
import { MessageFeed } from '@/components/message-feed';
import { Message } from '@/components/message';
import { DateSeparator } from '@/components/date-separator';
import { MessageForm } from '@/components/message-form';
import { Button } from '@/components/button';
import { setPageMetadata } from '@/utils/metadata';
import { ContentBlock } from '@/core/content-block';
import template from './home-page.hbs?raw';

export class HomePage extends Block {
  constructor() {
    setPageMetadata({ title: 'Home', description: 'Your chats and messages.' });

    const profileLink = new Link({ href: '/settings', label: 'Profile >', className: 'home-page__profile-link' });
    const searchInput = new SearchInput({ onInput: (value) => console.log('Search:', value) });

    // mock chats data
    const chatItems = [
      new ChatItem({
        id: 1,
        avatarUrl: '/images/icons/avatar-placeholder.svg',
        name: 'Ilya',
        lastMessageTime: '15:12',
        lastMessageText: 'Friends, I have a special news release for you!...',
        unreadCount: 4,
      }),
      new ChatItem({
        id: 2,
        avatarUrl: '/images/icons/avatar-placeholder.svg',
        name: 'Vadim',
        lastMessageTime: 'Fri',
        lastMessageSender: 'You:',
        lastMessageText: 'Cool!',
        isActive: true,
      }),
    ];
    const chatList = new ChatList({ chats: chatItems });

    const chatHeader = new ChatHeader({ avatarUrl: '/images/icons/avatar-placeholder.svg', name: 'Vadim' });

    const menuButton = new Button({
      className: 'chat-view__menu-button',
      label: '',
      events: {
        click: () => {
          console.log('Menu button clicked!');
        },
      },
    });

    // mock messages data
    const messageItems = [
      new DateSeparator({ date: '19 июня' }),
      new Message({
        text: 'Hi! Look, an interesting piece of lunar space history has surfaced here.',
        timestamp: '11:56',
        isIncoming: true,
      }),
      new Message({ imageUrl: '/images/image-placeholder.jpg', timestamp: '11:57', isIncoming: true }),
      new Message({ text: 'Cool!', timestamp: '12:00', isIncoming: false }),
    ];
    const messageFeed = new MessageFeed({ items: messageItems });

    const messageForm = new MessageForm({
      onSubmit: (message) => {
        console.log('Message to send:', message);
      },
    });

    // Wrap the page with MainLayout
    const mainLayout = new MainLayout({
      content: new ContentBlock({
        template: template,
        profileLink,
        searchInput,
        chatList,
        chatHeader,
        menuButton,
        messageFeed,
        messageForm,
      }),
    });

    super({
      mainLayout,
    });
  }

  render() {
    return '{{{ mainLayout }}}';
  }
}

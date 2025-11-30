import './profile-layout.scss';

import { Block, type Props } from '@/core/block';
import { MainLayout } from '@/layout/main';
import { BackPanel } from '@/components/back-panel';
import { ContentBlock } from '@/core/content-block';
import template from './profile-layout.hbs?raw';

interface ProfileLayoutProps extends Props {
  profileForm: Block;
  profileButtons: Block | Block[];
}


export class ProfileLayout extends MainLayout {
  constructor(props: ProfileLayoutProps) {
    super({
      ...props,
      content: new ContentBlock({
        ...props,
        backPanel: new BackPanel({ backLink: '/messenger' }),
        template: template,
      }),
    });
  }
}

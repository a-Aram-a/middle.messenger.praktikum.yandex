import { Block, type Props } from '@/core/block';

interface ContentBlockProps extends Props {
  template: string;
}

export class ContentBlock extends Block<ContentBlockProps> {
  render() {
    return this.props.template;
  }
}

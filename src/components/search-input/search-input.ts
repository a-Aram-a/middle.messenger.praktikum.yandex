import './search-input.scss';

import { Block, type Props } from '@/core/block';
import template from './search-input.hbs?raw';

interface SearchInputProps extends Props {
  onInput?: (value: string) => void
}

export class SearchInput extends Block<SearchInputProps> {
  constructor(props: SearchInputProps) {
    super({
      events: {
        'input@input': (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (props.onInput) {
            props.onInput(target.value);
          }
        },
      },
      ...props,
    });
  }

  render() {
    return template;
  }
}

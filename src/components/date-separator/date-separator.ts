import './date-separator.scss';

import { Block, type Props } from '@/core/block';
import template from './date-separator.hbs?raw';

interface DateSeparatorProps extends Props {
  date: string;
}

export class DateSeparator extends Block<DateSeparatorProps> {
  render() {
    return template;
  }
}

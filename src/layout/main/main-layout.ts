import {Block, type Props} from '@/core/block';
import template from './main-layout.hbs?raw';

interface MainLayoutProps extends Props {
    content: Block | Block[];
}

export class MainLayout extends Block<MainLayoutProps> {
    constructor(props: MainLayoutProps) {
        super(props);
    }

    render() {
        return template;
    }
}

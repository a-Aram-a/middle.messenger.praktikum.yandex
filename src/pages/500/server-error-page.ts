import {Block} from '@/core/block';
import {MainLayout} from '@/layout/main';
import {ErrorPage} from '@/components/error-page';
import {setPageMetadata} from '@/utils/metadata';

export class ServerErrorPage extends Block {
    constructor() {
        setPageMetadata({title: '500', description: 'Internal Server Error'});

        const errorContent = new ErrorPage({
            errorCode: '500',
            errorMessage: 'Internal Server Error',
        });

        // Wrap the page with MainLayout
        const mainLayout = new MainLayout({
            content: errorContent,
        });

        super({
            mainLayout,
        });
    }

    render() {
        return '{{{ mainLayout }}}';
    }
}

import {Block} from '@/core/block';
import {MainLayout} from '@/layout/main';
import {ErrorPage} from '@/components/error-page';
import {setPageMetadata} from '@/utils/metadata';

export class NotFoundPage extends Block {
    constructor() {
        setPageMetadata({title: '404', description: 'Page not found'},);

        const errorContent = new ErrorPage({
            errorCode: '404',
            errorMessage: 'Page Not Found',
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

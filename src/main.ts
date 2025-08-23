import './app/style/main.scss';

import {renderDOM} from '@/core/render-dom';
import {LoginPage} from '@/pages/login';
import {RegistrationPage} from "@/pages/registration";
import {NotFoundPage} from "@/pages/404";
import {ServerErrorPage} from "@/pages/500";
import {IndexPage} from "@/pages/index";
import {HomePage} from "@/pages/home";
import {ProfileEditDataPage, ProfileEditPasswordPage, ProfilePage} from "@/pages/profile";

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    let page;

    switch (path) {
        case '/':
            page = new IndexPage();
            break;

        case '/login':
            page = new LoginPage();
            break;
        case '/registration':
            page = new RegistrationPage();
            break;

        case '/home':
            page = new HomePage();
            break;

        case '/profile':
            page = new ProfilePage();
            break;
        case '/profile-edit-data':
            page = new ProfileEditDataPage()
            break;
        case '/profile-edit-password':
            page = new ProfileEditPasswordPage()
            break;

        case '/500':
            page = new ServerErrorPage();
            break;

        case '/404':
        default:
            page = new NotFoundPage();
            break;
    }

    renderDOM('#app', page);
});

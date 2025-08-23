import './auth-form.scss';

import {Block, type Props} from '@/core/block';
import {TextInput} from '@/components/text-input';
import {validateAndCollectData} from '@/utils/validation';
import template from './auth-form.hbs?raw';


interface AuthFormProps extends Props {
    title: string;
    fields: TextInput[];
    buttons: Block[];
    onSubmit?: (data: Record<string, string>) => void;
}

export class AuthForm extends Block<AuthFormProps> {
    constructor(props: AuthFormProps) {
        super({
            ...props,
            events: {
                submit: (event: Event) => this.handleSubmit(event),
            },
        });
    }

    private handleSubmit(event: Event) {
        event.preventDefault();

        const {isValid, data} = validateAndCollectData(this.props.fields);

        if (isValid && this.props.onSubmit) {
            this.props.onSubmit(data);
        }
    }

    render() {
        return template;
    }
}

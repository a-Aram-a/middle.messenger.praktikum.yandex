import './profile-data-form.scss';

import {Block, type Props} from '@/core/block.ts';
import {Button} from '@/components/button';
import {TextInput} from '@/components/text-input';
import {ProfileAvatar} from '@/components/profile-avatar';
import {ValidationRule} from '@/utils/validation';
import template from './profile-data-form.hbs?raw';
import {validateAndCollectData} from "@/utils/validation";


interface ProfileDataFormProps extends Props {
    isDisabled?: boolean;
    onSubmit?: (data: Record<string, string>) => void;
}

export class ProfileDataForm extends Block<ProfileDataFormProps> {
    constructor(props: ProfileDataFormProps) {
        const fields = [
            new TextInput({
                name: 'email',
                label: 'Email',
                type: 'email',
                initialValue: 'pochta@yandex.ru',
                validationRule: ValidationRule.Email
            }),
            new TextInput({
                name: 'login',
                label: 'Login',
                initialValue: 'ivanivanov',
                validationRule: ValidationRule.Login
            }),
            new TextInput({
                name: 'first_name',
                label: 'First Name',
                initialValue: 'Ivan',
                validationRule: ValidationRule.FirstName
            }),
            new TextInput({
                name: 'second_name',
                label: 'Second Name',
                initialValue: 'Ivanov',
                validationRule: ValidationRule.SecondName
            }),
            new TextInput({
                name: 'display_name',
                label: 'Display Name',
                initialValue: 'Van123',
                validationRule: ValidationRule.Login
            }),
            new TextInput({
                name: 'phone',
                label: 'Phone Number',
                type: 'tel',
                initialValue: '+79099673030',
                validationRule: ValidationRule.Phone
            }),
        ];

        if (props.isDisabled) {
            fields.forEach(field => field.setProps({disabled: true}));
        }

        super({
            ...props,
            profileAvatar: new ProfileAvatar({
                avatarUrl: '/images/icons/avatar-placeholder.svg',
                disabled: props.isDisabled,
            }),
            displayName: 'Van123',
            fields: fields,
            submitButton: !props.isDisabled ? new Button({type: 'submit', label: 'Save'}) : undefined,
            events: {
                submit: (event: Event) => this.handleSubmit(event),
            },
        });
    }

    handleSubmit(event: Event) {
        event.preventDefault();

        const fields = this.children.fields as TextInput[];
        const {isValid, data} = validateAndCollectData(fields);

        if (!isValid) {
            return;
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(data);
        }
    }

    render() {
        return template;
    }
}

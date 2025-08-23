import './profile-password-form.scss';

import {Block, type Props} from '@/core/block.ts';
import {Button} from '@/components/button';
import {TextInput} from '@/components/text-input';
import {validateAndCollectData, ValidationRule} from '@/utils/validation';
import template from './profile-password-form.hbs?raw';

interface ProfilePasswordFormProps extends Props {
    onSubmit?: (data: Record<string, string>) => void;
}

export class ProfilePasswordForm extends Block<ProfilePasswordFormProps> {
    constructor(props: ProfilePasswordFormProps) {
        const oldPasswordInput = new TextInput({
            name: 'oldPassword',
            label: 'Old password',
            type: 'password',
            validationRule: ValidationRule.Password,
        });
        const newPasswordInput = new TextInput({
            name: 'newPassword',
            label: 'New Password',
            type: 'password',
            validationRule: ValidationRule.Password,
        });
        const repeatNewPasswordInput = new TextInput({
            name: 'repeatNewPassword',
            label: 'Repeat New Password',
            type: 'password',
            validationRule: ValidationRule.Password,
        });

        super({
            ...props,
            fields: [
                oldPasswordInput,
                newPasswordInput,
                repeatNewPasswordInput,
            ],
            submitButton: new Button({type: 'submit', label: 'Save'}),
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

        if (data.newPassword !== data.repeatNewPassword) {
            const repeatField = fields.find(f => f.name === 'repeatNewPassword');
            if (repeatField) {
                repeatField.setProps({
                    error: "Passwords do not match",
                    value: repeatField.value(),
                });
            }
            return;
        }

        if (this.props.onSubmit) {
            delete data.repeatNewPassword;
            this.props.onSubmit(data);
        }
    }

    render() {
        return template;
    }
}

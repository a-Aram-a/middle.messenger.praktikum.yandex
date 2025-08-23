import './text-input.scss';

import {Block, type Props} from '@/core/block';
import {ValidationRule, validate} from '@/utils/validation';
import template from './text-input.hbs?raw';

interface TextInputProps extends Props {
    name: string;
    label: string;
    type?: 'text' | 'password' | 'email' | 'tel';
    initialValue?: string;
    validationRule?: ValidationRule;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export class TextInput extends Block<TextInputProps> {
    constructor(props: TextInputProps) {
        super({
            type: 'text',
            ...props,
            value: props.initialValue || '',
            events: {
                ...props.events,
                'blur@input': () => {
                    this.validate();
                },
            },
        });
    }

    public validate(): boolean {
        const value = this.value();
        const rule = this.props.validationRule;
        let isValid = true;

        if (rule) {
            isValid = validate(rule, value);
        }

        this.setProps({
            error: isValid ? '' : 'Invalid input',
            value: value,
        });

        return isValid;
    }

    public get name(): string {
        return this.props.name;
    }

    public value() {
        const input = this.element?.querySelector('input');
        return input?.value || '';
    }

    render() {
        return template;
    }
}

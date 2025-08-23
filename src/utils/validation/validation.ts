export enum ValidationRule {
    FirstName = 'first_name',
    SecondName = 'second_name',
    Login = 'login',
    Email = 'email',
    Password = 'password',
    Phone = 'phone',
    Message = 'message',
}

const validationPatterns: Record<ValidationRule, RegExp> = {
    [ValidationRule.FirstName]: /^[А-ЯЁA-Z][а-яёa-z-]+$/,
    [ValidationRule.SecondName]: /^[А-ЯЁA-Z][а-яёa-z-]+$/,
    [ValidationRule.Login]: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
    [ValidationRule.Email]: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    [ValidationRule.Password]: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    [ValidationRule.Phone]: /^\+?\d{10,15}$/,
    [ValidationRule.Message]: /.+/,
};

export function validate(rule: ValidationRule, value: string): boolean {
    if (rule === ValidationRule.Message) {
        return value.trim().length > 0;
    }
    
    return validationPatterns[rule].test(value);
}

import { AbstractControl } from '@angular/forms';

export interface FormElement {
    label?: string;
    isDisabled?: boolean;
    name: string;
    placeholder: string;
    errorMessage: string;
    inputType: 'text' | 'password' | 'email' | 'phone' | 'range' | 'date' |
    'dateTime' | 'time' | 'switch' | 'group' | 'formArray' | 'formGroup' | 'number' | 'textarea';
    outputType: 'single' | 'select' | 'radioGroup' | 'array' | 'object';
    listner?: (value: any, controls: { [key: string]: AbstractControl }) => void;
    options?: { key: string; value: string; }[];
    scheme?: FormElement[];
    validators?: (string
        // 'required' | 'email' | 'min:' | 'minLength:' | 'max:' | 'maxLength:' | 'pattern:'
    )[];
}

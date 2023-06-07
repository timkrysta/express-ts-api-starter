export default class ValidationMessage {
    static templates = {
        required: 'The :attribute field is required.',
        email: 'The :attribute must be a valid email address.',
        min: {
            string: 'The :attribute must be at least :min characters.',
        },
        max: {
            string: 'The :attribute must not be greater than :max characters.',
        },
        between: {
            string: 'The :attribute must be between :min and :max characters.',
        },
    };

    static _replaceAttributePlaceholder(attribute: string, template) {
        return template.replace(':attribute', attribute);
    }

    static required(attribute: string) {
        return this._replaceAttributePlaceholder(attribute, this.templates.required);
    }

    static email(attribute: string) {
        return this._replaceAttributePlaceholder(attribute, this.templates.email);
    }

    static minString(attribute: string, min) {
        return this._replaceAttributePlaceholder(attribute, this.templates.min.string.replace(':min', min));
    }

    static maxString(attribute: string, max) {
        return this._replaceAttributePlaceholder(attribute, this.templates.max.string.replace(':max', max));
    }

    static betweenString(attribute: string, min, max) {
        return this._replaceAttributePlaceholder(
            attribute,
            this.templates.between.string.replace(':min', min).replace(':max', max),
        );
    }
}

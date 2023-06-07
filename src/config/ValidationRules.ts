import { body } from 'express-validator';
import ValidationMessage from '../utils/ValidationMessage';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 255;
export const EMAIL_MAX_LENGTH = 255;
export const FIRST_NAME_MAX_LENGTH = 100;
export const LAST_NAME_MAX_LENGTH = 100;

export class AuthValidationRules {
    public static register() {
        return [
            body('email')
                .notEmpty()
                .withMessage(ValidationMessage.required('email'))
                .isEmail()
                .withMessage(ValidationMessage.email('email'))
                .isLength({ max: EMAIL_MAX_LENGTH })
                .withMessage(ValidationMessage.maxString('email', EMAIL_MAX_LENGTH)),
            body('password')
                .notEmpty()
                .withMessage(ValidationMessage.required('password'))
                .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
                .withMessage(ValidationMessage.betweenString('password', PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)),
            body('firstName')
                .notEmpty()
                .withMessage(ValidationMessage.required('firstName'))
                .isLength({ max: FIRST_NAME_MAX_LENGTH })
                .withMessage(ValidationMessage.maxString('firstName', FIRST_NAME_MAX_LENGTH)),
            body('lastName')
                .notEmpty()
                .withMessage(ValidationMessage.required('lastName'))
                .isLength({ max: LAST_NAME_MAX_LENGTH })
                .withMessage(ValidationMessage.maxString('lastName', LAST_NAME_MAX_LENGTH)),
        ];
    }

    public static login() {
        return [
            body('email')
                .notEmpty()
                .withMessage(ValidationMessage.required('email'))
                .isEmail()
                .withMessage(ValidationMessage.email('email')),
            body('password').notEmpty().withMessage(ValidationMessage.required('password')),
        ];
    }
}

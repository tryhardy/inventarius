import { Result, ValidationError, checkSchema, validationResult } from 'express-validator';
import { required, isEmail, isLength, isLengthPassword, confirmPassword, checkCompany, checkWorker} from './fields';

//Базовые параметры валидации данных, приходящих в пост запросе на создание пользователя
let UserValidationParams = {
    name: {
        notEmpty: required,
        isLength: isLength,
    },
    last_name: {
        notEmpty: required,
        isLength: isLength,
    },
    email: isEmail,
    password: {
        notEmpty: required,
        isLength: isLengthPassword
    },
    confirm_password: confirmPassword
};

let UserValidationSimpleParams = { ...UserValidationParams };
UserValidationSimpleParams['company'] = checkCompany;

let UserValidationInviteParams = { ...UserValidationParams };
UserValidationInviteParams['worker'] = checkWorker;

export const UserValidationSimple = checkSchema(UserValidationSimpleParams);
export const UserValidationInvite = checkSchema(UserValidationInviteParams);


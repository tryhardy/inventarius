import * as Joi from 'joi';
import { companyValidator } from '../functions';

//TODO Требования к паролю: Длина от 8 символов, Заглавные буквы (A-Z), Строчные буквы (a-z), Цифры (0-9)

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const passwordErrorMessage = 'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length';

//Создаем пользователя без компании
export const userCreateSchema = Joi.object({}).keys({
    name: Joi.string().min(2).max(256).required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().regex(strongPasswordRegex).messages({ 
        'string.pattern.base': passwordErrorMessage
    }),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({ 
        'any.only': '{{#label}} does not match' 
    }),
    company: Joi.object().custom(companyValidator),
    group: Joi.string(),
    active: Joi.boolean()
})
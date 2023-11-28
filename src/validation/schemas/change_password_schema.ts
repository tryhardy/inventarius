import * as Joi from 'joi';
import { companyValidator } from '../functions';

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const passwordErrorMessage = 'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length';

//Создаем пользователя без компании
export const changePasswordSchema = Joi.object({}).keys({
    password: Joi.string().required().regex(strongPasswordRegex).messages({ 
        'string.pattern.base': passwordErrorMessage
    }),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({ 
        'any.only': '{{#label}} does not match' 
    })
})
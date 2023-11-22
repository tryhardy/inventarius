import * as Joi from 'joi';
import { companyValidator } from '../functions';

//Создаем пользователя без компании
export const changePasswordSchema = Joi.object({}).keys({
    password: Joi.string().min(8).required(),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({ 
        'any.only': '{{#label}} does not match' 
    })
})
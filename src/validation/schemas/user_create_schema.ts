import * as Joi from 'joi';
import { companyValidator } from '../functions';

//Создаем пользователя без компании
export const userCreateSchema = Joi.object({}).keys({
    name: Joi.string().min(2).max(256).required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({ 
        'any.only': '{{#label}} does not match' 
    }),
    company: Joi.object().custom(companyValidator)
})
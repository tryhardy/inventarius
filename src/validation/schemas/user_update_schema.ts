import * as Joi from 'joi';

//Создаем пользователя без компании
export const userUpdateSchema = Joi.object({}).keys({
    name: Joi.string().min(2).max(256),
    last_name: Joi.string().min(2).max(256), 
    email: Joi.string().email(),
    password: Joi.string().min(8),
    active: Joi.boolean(),
    group: Joi.string(),
    confirm_password: Joi.any().equal(Joi.ref('password')).label('Confirm password').messages({ 
        'any.only': '{{#label}} does not match' 
    }),
})
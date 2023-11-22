import * as Joi from 'joi';

//Создаем пользователя без компании
export const loginSchema = Joi.object({}).keys({
    login: Joi.string().required(),
    password: Joi.string().required(),
})
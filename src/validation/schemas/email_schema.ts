import * as Joi from 'joi';

//Создаем пользователя без компании
export const emailSchema = Joi.object({}).keys({
    email: Joi.string().email().required()
})
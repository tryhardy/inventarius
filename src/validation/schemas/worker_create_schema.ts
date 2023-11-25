import * as Joi from 'joi';

//Создаем пользователя без компании
export const workerCreateSchema = Joi.object({}).keys({
    name: Joi.string().min(2).max(256).required(),
    last_name: Joi.string().min(2).max(256),
    post: Joi.string().min(2).max(256),
    role: Joi.string().min(2).max(256),
    active: Joi.boolean(),
    email: Joi.string().email()
})
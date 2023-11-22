import * as Joi from 'joi';

//Создаем пользователя без компании
export const userFilterSchema = Joi.object({}).keys({
    name: Joi.string().min(2).max(256),
    last_name: Joi.string().min(2).max(256),
    email: Joi.string().email(),
    active: Joi.boolean(),
    group: Joi.string(),

    limit: Joi.number(),
    page: Joi.number(),

    id: Joi.alternatives(
        Joi.string(),
        Joi.array().items(Joi.string())
    )
})
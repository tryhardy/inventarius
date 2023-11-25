import * as Joi from 'joi';

//Создаем пользователя без компании
export const companyFilterSchema = Joi.object({}).keys({
    name: Joi.string().min(2).max(256),
    address: Joi.string(),
    active: Joi.boolean(),
    type: Joi.string(),
    creator: Joi.string(),

    //Искать компанию по юзеру
    user: Joi.string(),
    is_owner: Joi.boolean(),
    is_worker: Joi.boolean(),
    worker_role: Joi.string(),

    limit: Joi.number(),
    page: Joi.number(),

    id: Joi.alternatives(
        Joi.string(),
        Joi.array().items(Joi.string())
    )
})
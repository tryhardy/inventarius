import * as Joi from 'joi';

export const userSchema = Joi.object({}).keys({
    name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().required(),
    //company: Joi.object(ICompany)
})
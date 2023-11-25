import * as Joi from 'joi';
import { companyValidator } from '../functions';

//Создаем пользователя без компании
export const companyCreateSchema = Joi.object({}).keys({
    type: Joi.string().required(),
    name: Joi.string(),
    address: Joi.string(),
})
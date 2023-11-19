import { attachMiddleware } from "@decorators/express";
import { Response, NextFunction, Request } from 'express';
import { createValidator } from "express-joi-validation";
import { ObjectSchema } from "joi";
import { IEnumValidationTypes } from "../enums/enum_validation";
import { AppError } from "../common/result/error";
import { IEnumStatuses } from "../enums/enum_statuses";
import { IEnumErrorCodes } from "../enums/error_codes";

export function ValidationMiddleware(schema: ObjectSchema, type: string) 
{   
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) 
    {
        attachMiddleware(target, propertyKey, (req : Request, res : Response, next : NextFunction) => 
        {
            try {
                if (!(<any>Object).values(IEnumValidationTypes).includes(type)) {
                    type = IEnumValidationTypes.query;
                }
    
                const { error } = schema.validate(req[type]);
    
                if (error) {
                    throw new AppError(IEnumErrorCodes.VALIDATION_ERROR, 'Validation error', error.details)
                }
    
                next();
            }
            catch (error) {
                next(error);
            }
        })
    }
}

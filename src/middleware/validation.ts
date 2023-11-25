import { attachMiddleware } from "@decorators/express";
import { Response, NextFunction, Request } from 'express';
import { createValidator } from "express-joi-validation";
import { ObjectSchema } from "joi";
import { IEnumValidationTypes } from "../enums/enum_validation";
import { AppError } from "../common/result/error";
import { IEnumStatuses } from "../enums/enum_statuses";
import { IEnumErrorCodes } from "../enums/error_codes";

export function ValidationMiddleware(schema: ObjectSchema, type: string = IEnumValidationTypes.query) 
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
                    let messages = {
                        errors: {}
                    };
                    error.details.forEach((detail, index, details) => {
                        if (!messages.errors[detail.path[index]]) messages.errors[detail.path[index]] = [];
                        messages.errors[detail.path[index]].push(detail.message);
                    });
                    throw new AppError(IEnumErrorCodes.VALIDATION_ERROR, 'Validation error', messages)
                }
    
                next();
            }
            catch (error) {
                next(error);
            }
        })
    }
}

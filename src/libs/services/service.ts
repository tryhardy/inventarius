import { AppError } from "../classes/error";
import { ErrorCodes } from "../interfaces/enums/error-codes";

export class Service
{
    errorMessage = 'Database request error';

    getError(error) : AppError
    {
        let errors = error.errors;
        let messages = {};
        errors.forEach((item, i) => {
            if (messages[item.path]) {
                messages[item.path].push(item.message);
            }
            else {
                messages[item.path] = [
                    item.message
                ];
            }
        }) 

        
        return new AppError(ErrorCodes.BAD_REQUEST, this.errorMessage, messages);
    }
}
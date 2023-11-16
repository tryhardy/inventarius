import { AppError } from "../classes/error";
import { AppSuccess } from "../classes/success";
import { ErrorCodes } from "../interfaces/enums/error_codes";

export class Service
{
    errorMessage = 'Database request error';

    getError(error) : AppError
    {
        let errors = error.errors;
        let messages = {};
        console.log(errors)
        if (errors && errors.length > 0) {
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
        }
        
        return new AppError(ErrorCodes.BAD_REQUEST, this.errorMessage, messages);
    }

    getSuccess(result) : AppSuccess
    {
        return new AppSuccess(result);
    }
}
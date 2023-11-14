import { validationResult } from "express-validator";

export class Validation
{
    protected errors : [];

    constructor(req: Request)
    {
        const result = validationResult(req);
        const resultArray = result.array()
        var errors;

        if (resultArray.length > 0) {
            errors = this.format(resultArray)
        }

        this.errors = errors
    }

    getErrors()
    {
        return this.errors;
    }

    /**
     * Форматируем ошибки так, как нам это нужно
     * @param errors 
     * @returns 
     */
    protected format(errors)
    {
        var result = {};

        errors.forEach((item, i, arr) => {

            if (!item.msg) return;

            item = this.replaceMessage(item);

            if (result[item.path]) {
                result[item.path].push(item.msg)
            }
            else {
                result[item.path] = [
                    item.msg
                ];
            }
        });

        return result;
    }

    protected replaceMessage(item)
    {
        switch (item.type) {
            case 'field':
                item.msg = item.msg.replace('#FIELD#', item.path)
                break;
        }

        return item;
    }
}
import { JWT } from "../common/jwt";
import { AppError } from "../common/result/error";
import { IEnumErrorCodes } from "../enums/error_codes";
import { HashModel, HashSchema } from "../models/hash";
import { Service } from "./service";

export class HashService extends Service<HashModel>
{
    errorMessage = 'Hash verify failed';

    constructor()
    {
        super(HashSchema);
    }

    /**
     * Сохранить хэш, который уже был использован при смене пароля
     * @param hash 
     * @returns 
     */
    async save (hash: string)
    {
        return await this.model.create({
            hash: hash
        })
    }

    async verify(hash : string, secret : string)
    {       
        let hashData = JWT.verify(hash, secret);
        if (!hashData || !hashData.data || !hashData.data.id) {
            throw new AppError(IEnumErrorCodes.BAD_REQUEST, this.errorMessage)
        }

        //Проверяем хэш в базе/
        //Если он уже там есть, тогда он уже был использован - не позволяем сменить пароль
        let isNewHash = await this.check(hash);
        if (!isNewHash) {
            throw new AppError(IEnumErrorCodes.BAD_REQUEST, this.errorMessage)
        }

        return hashData;
    }

    /**
     * Возвращает true - если такого хеша еще нет в базе
     * false - если хеш уже был использован
     * @param hash 
     * @returns 
     */
    async check (hash: string) : Promise<boolean>
    {
        let alreadyExist = await this.model.findOne({
            where: {
                hash: hash
            }
        })

        if (alreadyExist && alreadyExist.id) return false;

        return true;
    }

}
import { ChangePasswordModel, ChangePasswordSchema } from "../models/change_password";
import { Service } from "./service";

export class ChangePasswordService extends Service<ChangePasswordModel>
{
    constructor()
    {
        super(ChangePasswordSchema);
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
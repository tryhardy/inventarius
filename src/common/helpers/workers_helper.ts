import { debug } from "../../app";
import { UsersService } from "../../services/users_service";
import { JWT_INVITE_WORKER_SECRET, JWT_TIME_JWT_INVITE_WORKER_SECRET } from "../constants";
import { JWT } from "../jwt";

export class WorkersHelper
{
    static async invite(email: string, company_id: string, worker_id: string) : Promise<string>
    {
        let userService = new UsersService;
        let checkUser = await userService.findOne({email: email});

        //Инвайт с созданием нового пользователя или нет?
        let current_user_id;
        if (checkUser && checkUser.id) {
            current_user_id = checkUser.id
        }

        let token = JWT.generateAccessToken({
                user_id: current_user_id ?? null,
                company_id: company_id,
                worker_id: worker_id
            },
            JWT_TIME_JWT_INVITE_WORKER_SECRET,
            JWT_INVITE_WORKER_SECRET
        )

        //TODO SEND EMAIL отправлять сгенерированную ссылку с хэшом на емайл пользователю

        if (debug) {
            return token;
        }

        return '';
    }
}
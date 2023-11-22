import { DEFAULT_COMPANY_ROLE } from "../common/constants";
import { IWorkerCreateDTO } from "../interfaces/models/workers/iworker_create_dto";
import { WorkersModel, WorkersSchema } from "../models/workers";
import { CompanyRolesService } from "./company_roles_service";
import { Service } from "./service";

export class WorkersService extends Service<WorkersModel>
{
    constructor()
    {
        super(WorkersSchema);
    }

    async create(params : IWorkerCreateDTO) : Promise<WorkersModel>
    {
        try {

            let currentRole;

            if (!params.role_id) {
                let defaultRoleCode = DEFAULT_COMPANY_ROLE;               
                currentRole = await (new CompanyRolesService).getByCode(defaultRoleCode);

                if (!currentRole.id) {
                    throw new Error('User company role not found in database');
                }
                params.role_id = currentRole.id
            }

            let data : IWorkerCreateDTO = {
                name : params.name,
                last_name : params.last_name,
                post : params.post,
                active: params.active,
                company_id: params.company_id, 
                user_id : params.user_id ?? null,
                role_id : params.role_id,
                is_owner: params.is_owner
            }

            let result = await this.model.create(data);

            if (result) {
                console.log(result)
                return result;
            }
            else {
                throw new Error('Worker does not created');
            }
        }
        finally {}
    }
}
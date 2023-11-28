import db from './config/db.js';

import { UserGroupsSchema } from './models/user_groups.js';
import { UsersSchema } from './models/users.js';
import { HashSchema } from './models/hash.js';
import { CompanyTypesSchema } from './models/company_types.js';
import { CompanyRolesSchema } from './models/company_roles.js';
import { CompaniesSchema } from './models/companies.js';
import { WorkersSchema } from './models/workers.js';

// Таблицы, используемые на проекте, сами создаются, со всеми взаимосвязями
// Если такая таблица уже есть, она обновляется
db.sync({
    alter: true
}).then(()=>{
    console.log("Tables have been created or updated");
}).catch(err=>console.log(err));
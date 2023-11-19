import { Controller } from "@decorators/express";
import { DefaultMiddleware } from "../middleware/errors";

/**
 * Дефолтный контроллер по сути нужен для того, чтобы установить 404 ошибку, 
 * если ни один из выше обозначенных роутов не подошел
 * По умолчанию вызывается DefaultMiddleware.use - который и устанавливает ошибку 404
 */
@Controller('', [DefaultMiddleware])
export class DefaultController 
{}
import * as express from 'express';
import { createServer } from 'http';
import { mongoClient } from './config/mongo';
import db from './config/db';
import 'winston-mongodb';
import 'dotenv/config';
import { Container, ERROR_MIDDLEWARE, attachControllers } from '@decorators/express';

const app = express.default();
const server = createServer(app);
const port = process.env.PORT || 3000;
export const debug = true;

//TODO настроить миграции на проекте
//TODO обновить readme.md
//TODO донастроить докер

// Postgres connect
db.authenticate().catch(error => console.error(error))

// Import middlewares
import { LoggerMiddleware } from './middleware/loggers';
import { DefaultMiddleware } from './middleware/errors';

// Import Controllers
import { UsersController } from './controllers/users_controller';
import { DefaultController } from './controllers/default_controller';
import { AuthController } from './controllers/auth_controller';
import { extractToken } from './middleware/extract_token';
import { CompaniesController } from './controllers/companies_controller';
import { WorkersController } from './controllers/workers_controller';

const router = express.Router();
const defaultRouter = express.Router();

//Парсим данные из request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логируем все входящие запросы к АПИ
app.use(LoggerMiddleware.getRoutLogger);

// Путь к хранилищу файлов для публичного использования
app.use(express.static("public"));

// Извлекает JWT токен из Request и помещает в Request['auth_data']
app.use(extractToken);

app.use('/api/', router); //Api текущей версии
app.use('', defaultRouter);

// Роуты к апи текущей версии
attachControllers(router, [
    AuthController,
    UsersController,
    CompaniesController,
    WorkersController
]);

// Если ни один из роутов не подошел, тогда устанавливаем по умолчанию ошибку 404
attachControllers(defaultRouter, [
    DefaultController 
]);

Container.provide([
    { 
        //Обработка (приведение в единообразный вид) и логирование ошибок
        provide: ERROR_MIDDLEWARE, 
        useValue: DefaultMiddleware.setError
    },
]);  

async function start() {
    try {
        // Test connection to MongoDB
        mongoClient.connect().then((obj) => {
            console.log('Connected to database MongoDB');
        }).catch((error) => {
            console.error('ERROR:', error.message); 
        });

        // Таблицы, используемые на проекте, сами создаются
        // Если такая таблица уже есть, она обновляется
        // db.sync({
        //     alter: true
        // }).then(()=>{
        //     console.log("Tables have been created or updated");
        // }).catch(err=>console.log(err));
        

        // Start our application
        app.listen(port);
    }
    catch (e) {
        console.log(e)
    }
}

start();
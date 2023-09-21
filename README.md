## Описание
Ниже описан использованный технологический стек:

- Express.js
- PostgreSQL
- MongoDB
- Docker
- Node.js >20

## Контейнеры

В режиме **разработки (dev)** в файле docker-compose.dev.yml используются следующие контейнеры для корректной работы приложения на локальной машине:
- postgres - сервис с БД PostgreSQL
- pgadmin-compose - сервис для удобного управления БД PostgreSQL
- mongo - сервис c БД MongoDB
- mongo-express - сервис для удобного управления БД MongoDB
- inventarius - сервис с приложением на Express.js

В **боевом режиме (prod)** предполагается, что все вышеуказанные сервисы уже запущены, поэтому файл docker-compose.prod.yml не содержит других контейнеров, кроме контейнера с приложением.

## Установка

Для корректной работы контейнеров и самого приложения требуется создать файл **.env** следующего содержания:
```bash
#Run with docker-compose
DOCKER_MONGO_PORT='8081'
DOCKER_MONGO_URL='mongodb://root:password@mongo:27017/'
DOCKER_MONGO_DBNAME='inventarius'
DOCKER_MONGO_INITDB_ROOT_USERNAME='root'
DOCKER_MONGO_INITDB_ROOT_PASSWORD='password'

DOCKER_DB_PORT='5432'
DOCKER_DB_DATABASE='inventarius'
#важно, чтобы название БД совпадало с именем юзера
DOCKER_DB_USERNAME='inventarius' 
DOCKER_DB_PASSWORD='inventarius'
DOCKER_DB_HOST='postgres'

DOCKER_PORT='3000'

#Run in simple mode
PORT='3000'
MONGO_URL='mongodb://127.0.0.1:27017/'
MONGO_DBNAME='inventarius'
DB_HOST='localhost'
DB_DATABASE='inventarius'
DB_USERNAME='inventarius'
DB_PASSWORD='inventarius'
```  

```bash
#Устанавливаем все зависимости командой:
$ npm install
```

## Старт приложения через Docker  

```bash
#Запуск приложения в режиме разработки
npm run docker:dev

#Запуск приложения в режиме продакшена
npm run docker:prod
```

## Старт приложения без Docker

```bash
# Билд в режиме разработки с отслеживанием изменений
$ npm run start:dev

# Билд в продакшене
$ npm run start:prod
```

## Ошибки

Коды ошибок хранятся в **/src/options/error-codes.ts**.  
Методы, в которых прописан вывод ошибок: **/src/middleware/errors.ts**  

Виды ошибок client-side:
- 400 - 'Bad Request' - ошибка валидации/результат не найден в БД
- 401 - 'Unauthorized' - пользователь неавторизован
- 403 - 'Access denied' - Отказано в доступе
- 404 - 'Rout not found' - Маршрут не найден    
    
Как вывести ошибку в роуте:
```ts
import { ErrorCodes } from '/src/enums/error-codes';

router.get('/test', (req, res, next) => {
    // res.send() - не вызываем
    // в метод next() передаем код ошибки
    // если не передать код ошибки - тогда по умолчанию выведется 404
    next(ErrorCodes.BAD_REQUEST);
});
```
Формат вывода ошибок (json):

```json
{
    "status": "ERROR",
    "code": 404,
    "message": "Rout not found"
}
```

## Логирование

Для записи логов используются следующие библиотеки:
- winston
- express-winston
- winston-mongodb

Логи по умолчанию пишутся в папку **/logs/**, а также сохраняются в БД MongoDB.

В логи записывается каждое обращение к api перед роутингом.  
В логи записывается каждая ошибка обращения к api после роутинга.  
Логировать можно что угодно: отправку писем, изменения записей в БД и т.д. 
```ts
import { getLogger } from '/src/middleware/loggers/logger'

router.get('/test', (req, res, next) => {

    /**
     * data - передаем, если необходимо сохранить какие-то специфические 
     * кастомные данные. По умолчанию {}
     * 
     * req - объект запроса. Передаем, если нужно
     * подтягивать информацию о url, ip адресе и тп. По умолчанию {}
     * 
     * path - путь к файлу логов. По умолчанию /logs/
     * 
     * collection - таблица в БД. По умолчанию - logs
     */
    const logger = getLogger(
        data : object,
        req : object,                
        path : string, 
        collection : string
    );
    
    logger.log({
        level: 'info',
        message: 'This is super secret - hide it.',
    })
});
```



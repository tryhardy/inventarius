## Описание
Технологический стек:

- Express.js
- PostgreSQL
- MongoDB
- Docker
- Node.js >= 20

## Контейнеры

В режиме **разработки (dev)** в файле docker-compose.dev.yml используются следующие контейнеры для корректной работы приложения на локальной машине:
- postgres - сервис с БД PostgreSQL
- pgadmin-compose - сервис для удобного управления БД PostgreSQL
- mongo - сервис c БД MongoDB
- mongo-express - сервис для удобного управления БД MongoDB
- inventarius - сервис с приложением на Express.js

В **боевом режиме (prod)** предполагается, что все вышеуказанные сервисы уже запущены, поэтому файл docker-compose.prod.yml не содержит других контейнеров, кроме контейнера с приложением.

## Установка

Для корректной работы контейнеров и самого приложения требуется создать файл **.env** (пример в файле .env-example)

```bash
#Устанавливаем все зависимости командой:
$ npm install
```

## Способы запуска:
- Через Docker
- Без Docker

## Старт приложения через Docker  

Первый запуск обязательно выполнять одной из следующих команд:
```bash
#Запуск приложения в режиме разработки
npm run docker:start:dev

#Запуск приложения в режиме продакшена
npm run docker:start:prod
```
Сервер запустится в первый раз с node v20, установятся все необходимые зависимости и миграции.

## Старт приложения без Docker

```bash
# Билд в режиме разработки с отслеживанием изменений
$ npm run start:dev

# Билд в продакшене
$ npm run start:prod
```

## Ошибки

Коды ошибок хранятся в **\src\enums\error-codes.ts**.  
Методы, в которых прописан вывод ошибок: **\src\middleware\errors.ts**  

Виды ошибок client-side:
- 400 - 'Bad Request' - ошибка валидации/результат не найден в БД
- 401 - 'Unauthorized' - пользователь неавторизован
- 403 - 'Access denied' - Отказано в доступе
- 404 - 'Rout not found' - Маршрут не найден    
- 417 - 'Validation error' - Ошибка валидации
    
Как вывести ошибку в роуте:
```ts
import { ErrorCodes } from '/src/enums/error-codes';

router.get('/test', (req, res, next) => {
    // если не передать код ошибки первым аргументом - тогда по умолчанию выведется ошибка 404
    try {
        throw new AppError(
            IEnumErrorCodes.BAD_REQUEST, 
            'Some message', 
            {data: 'Some data'}
        );

    }
    catch(error) {
        next(error);
    }
});
```
Формат вывода ошибок (json):

```js
//Экземпляр класса AppError
interface IError {
    status: number;
    code : number;
    data ?: any;
    message ?: string;
    date: string
}
```

## Логирование

Для записи логов используются следующие библиотеки:
- winston
- express-winston
- winston-mongodb

Логи по умолчанию пишутся в папку **/logs/**, а также сохраняются в БД MongoDB (если есть подключение к этой БД).

В логи записывается каждое обращение к api перед роутингом.  
В логи записывается каждая ошибка обращения к api после роутинга.  
Логировать можно что угодно: отправку писем, изменения записей в БД и т.д., методом, описанным ниже:
```ts
import { LoggerMiddleware } from '/src/middleware/loggers'

router.get('/test', (req, res, next) => {

    //Вызов кастомного лога
    let data = {};
    LoggerMiddleware.getLog(data, req, 'info').log({
        level: LoggerMiddleware.baseLogLevel,
        message: `Some data to log`
    });

    res.send('test');
});
```



## Описание
Ниже описан технологический стек, использованный на бэкенде:

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

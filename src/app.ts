import * as express from 'express';
import { createServer } from 'http';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { Client } from 'pg';
import 'dotenv/config';

const app = express.default();
const server = createServer(app);
const port = process.env.PORT || 3000;

//MONGO CONNECT
const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DBNAME;
const mongoClient = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

//POSTGRES CONNECT
const pgClient = new Client({
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME
});

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send('Inventarius api')
})

async function start() {
    try {
        // Test connection to MongoDB
        await mongoClient.connect()
            .then((obj) => {
                console.log('Connected to database MongoDB');
            })
            .catch((error) => {
                console.error('ERROR:', error.message);
            });

        const mongoDb = mongoClient.db(dbName);

        // Test connection to PostgreSQL
        await pgClient.connect()
            .then((obj) => {
                    console.log('Connected to database PostgreSQL');
            })
            .catch((error) => {
                console.error('ERROR:', error.message);
            });

        app.listen(port);
    }
    catch (e) {
        console.log(e)
    }
}

start();
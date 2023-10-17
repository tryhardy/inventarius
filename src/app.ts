import * as express from 'express';
import { createServer } from 'http';
import { mongoClient } from './options/mongo';
import { Client } from 'pg';
import 'winston-mongodb';
import 'dotenv/config';

const app = express.default();
const server = createServer(app);
const port = process.env.PORT || 3000;

// Postgres connect
const pgClient = new Client({
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME
});

// Import routes
import routIndex from './routes/index';

// Import middlewares
import { routLogger, errorRoutLogger } from './middleware/loggers';
import { setDefaultError, error400, error401, error403, error404 } from './middleware/errors';

// Use routes

// Logging all requests
app.use(routLogger);

// Path to files storage for public usage
app.use(express.static("public"));

// Api routes
app.use('/', routIndex);

// Error handlers
app.use(setDefaultError) // Default error code - 404
app.use(error400, error401, error403, error404);

// Log request result errors
app.use(errorRoutLogger);

async function start() {
    try {
        // Test connection to MongoDB
        mongoClient.connect().then((obj) => {
            console.log('Connected to database MongoDB');
        }).catch((error) => {
            console.error('ERROR:', error.message);
        });

        // Test connection to PostgreSQL
        await pgClient.connect().then((obj) => {
            console.log('Connected to database PostgreSQL');
        }).catch((error) => {
            console.error('ERROR:', error.message);
        });

        // Start our application
        app.listen(port);
    }
    catch (e) {
        console.log(e)
    }
}

start();
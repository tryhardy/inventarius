import * as express from 'express';
import { createServer } from 'http';
import { mongoClient } from './options/mongo';
import db from './db';
import 'winston-mongodb';
import 'dotenv/config';

const app = express.default();
const server = createServer(app);
const port = process.env.PORT || 3000;

// Postgres connect
db.authenticate().catch(error => console.error(error))

// Import routes
import routIndex from './routes/index';
import routUser from './routes/user';

// Import middlewares
import { routLogger, errorRoutLogger } from './middleware/loggers';
import { setDefaultError, setError } from './middleware/errors';

app.use(express.json())

// Use routes

// Logging all requests
app.use(routLogger);

// Path to files storage for public usage
app.use(express.static("public"));

// Api routes
app.use('/api', routIndex);
app.use('/api', routUser);

// Error handlers
app.use(setDefaultError) // Default error code - 404
app.use(setError);

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

        // Start our application
        app.listen(port);
    }
    catch (e) {
        console.log(e)
    }
}

start();
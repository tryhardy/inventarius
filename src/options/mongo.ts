import 'dotenv/config';
import { MongoClient } from 'mongodb';

export const url = process.env.MONGO_URL;
export const dbName = process.env.MONGO_DBNAME;
export const mongoClient = new MongoClient(url);
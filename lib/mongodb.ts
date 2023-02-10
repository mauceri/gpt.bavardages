//import "server-only";

import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.ATLAS_URI;
const options:MongoClientOptions= {
    useUnifiedTopology: true,
    useNewUrlParser: true,
} as MongoClientOptions;

var mongoClient:any = null;
var database:any = null;

if (!process.env.ATLAS_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}

export async function connectToDatabase(db_name:string) {
    try {
        if (mongoClient && database) {
            return { mongoClient, database };
        }
        if (process.env.NODE_ENV === "development") {
            if (!mongoClient) {
                mongoClient = await (new MongoClient(uri as string, options)).connect();
                mongoClient = mongoClient;
            }
        } else {
            mongoClient = await (new MongoClient(uri as string, options)).connect();
        }
        database = await mongoClient?.db(db_name);
        return { mongoClient, database };
    } catch (e) {
        console.error(e);
    }
}

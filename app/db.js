const { version } = require("os");
const { MongoClient } = require("mongodb");

if (!process.env.DB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    }
});

async function getDB(name) {
    try {
        await client.connect();
        console.log("CONNECTED TO DB");
        return client.db(name);
    } catch (error) {
        console.error("Error connecting to DB:", error);
    }
}

export async function getCollection(collectionName) {
    const db = await getDB('user_database');
    if (db) return db.collection(collectionName);
    return null;
}

// Get a collection from any database name (useful for storing rooms in a separate DB)
export async function getCollectionForDB(dbName, collectionName) {
    const db = await getDB(dbName);
    if (db) return db.collection(collectionName);
    return null;
}

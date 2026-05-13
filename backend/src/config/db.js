const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  const client = new MongoClient(mongoUri);

  await client.connect();
  db = client.db();

  console.log("MongoDB connected");
}

function getDB() {
  if (!db) {
    throw new Error("Database is not connected");
  }

  return db;
}

module.exports = {
  connectDB,
  getDB,
};

const { MongoClient } = require("mongodb");

const mongoUri =
  "mongodb+srv://rostyslavshyianexternal_db_user:TestPassword12345@cluster0.eljvsqf.mongodb.net/jetbrains?retryWrites=true&w=majority&appName=Cluster0";

let db;

async function connectDB() {
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

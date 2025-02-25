import { MongoClient } from 'mongodb';
import { MONGODB_URI } from './config';

let db;

export async function connectToDatabase() {
  if (db) return db;
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db();
  return db;
}

export async function getUserRecord(whatsappNumber) {
  const database = await connectToDatabase();
  const collection = database.collection('userRecords');
  return await collection.findOne({ whatsappNumber });
}

export async function createUserRecord(whatsappNumber) {
  const database = await connectToDatabase();
  const collection = database.collection('userRecords');
  const newUserRecord = { whatsappNumber, sessions: [] };
  await collection.insertOne(newUserRecord);
  return newUserRecord;
}

export async function addSession(whatsappNumber, session) {
  const database = await connectToDatabase();
  const collection = database.collection('userRecords');
  await collection.updateOne(
    { whatsappNumber },
    { $push: { sessions: session } }
  );
}

export async function getLastSession(whatsappNumber) {
  const database = await connectToDatabase();
  const collection = database.collection('userRecords');
  const userRecord = await collection.findOne({ whatsappNumber });
  if (userRecord && userRecord.sessions.length > 0) {
    return userRecord.sessions[userRecord.sessions.length - 1];
  }
  return null;
}

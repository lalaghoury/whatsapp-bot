import { MongoClient } from 'mongodb';
import twilio from 'twilio';
import { config } from 'dotenv';

config();

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { Body, From } = req.body;

  try {
    await client.connect();
    const database = client.db('attendance');
    const users = database.collection('users');

    const user = await users.findOne({ phone: From });

    if (!user) {
      await users.insertOne({ phone: From, sessions: [] });
    }

    if (Body.toLowerCase() === 'check in') {
      await users.updateOne({ phone: From }, { $push: { sessions: { checkIn: new Date(), checkOut: null } } });
      twilioClient.messages.create({
        body: 'You have checked in successfully.',
        from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
        to: From
      });
    } else if (Body.toLowerCase() === 'check out') {
      const lastSession = user.sessions[user.sessions.length - 1];
      if (lastSession && !lastSession.checkOut) {
        await users.updateOne({ phone: From, 'sessions.checkOut': null }, { $set: { 'sessions.$.checkOut': new Date() } });
        twilioClient.messages.create({
          body: 'You have checked out successfully.',
          from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
          to: From
        });
      } else {
        twilioClient.messages.create({
          body: 'You need to check in first.',
          from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
          to: From
        });
      }
    } else {
      twilioClient.messages.create({
        body: 'Invalid command. Please send "check in" or "check out".',
        from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
        to: From
      });
    }

    res.status(200).send("Message received");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
}

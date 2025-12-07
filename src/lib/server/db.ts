import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'degidev';

const client = new MongoClient(MONGODB_URI);

export const db = client.db(DB_NAME);

export const collections = {
	users: db.collection('users'),
	sessions: db.collection('sessions'),
	projects: db.collection('projects')
};

export async function connectDB() {
	await client.connect();
	console.log('Connected to MongoDB');
}

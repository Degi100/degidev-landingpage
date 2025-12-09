import { MongoClient } from 'mongodb';
import { building } from '$app/environment';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'degidev';

const client = new MongoClient(MONGODB_URI);

// Don't connect during build time
if (!building) {
	await client.connect();
}

export const db = client.db(DB_NAME);

export const collections = {
	users: db.collection('users'),
	sessions: db.collection('sessions'),
	projects: db.collection('projects')
};

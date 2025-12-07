import { Lucia } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { db } from './db';

const adapter = new MongodbAdapter(
	db.collection('sessions'),
	db.collection('users')
);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production'
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}

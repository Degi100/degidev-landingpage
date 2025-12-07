import { MongoClient } from 'mongodb';
import { hash } from '@node-rs/argon2';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'degidev';

async function setupAdmin() {
	const username = process.argv[2];
	const password = process.argv[3];

	if (!username || !password) {
		console.error('Usage: bun run scripts/setup-admin.ts <username> <password>');
		process.exit(1);
	}

	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		const db = client.db(DB_NAME);
		const users = db.collection('users');

		const existingUser = await users.findOne({ username: username.toLowerCase() });

		if (existingUser) {
			console.log('User existiert bereits!');
			process.exit(1);
		}

		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		await users.insertOne({
			username: username.toLowerCase(),
			password_hash: passwordHash
		});

		console.log(`Admin User "${username}" wurde erstellt!`);

		// Create indexes
		await db.collection('sessions').createIndex({ user_id: 1 });
		await db.collection('sessions').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

		console.log('Indexes wurden erstellt!');
	} catch (error) {
		console.error('Fehler:', error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

setupAdmin();

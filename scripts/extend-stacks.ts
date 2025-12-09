import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'degidev';

// Extended stacks with 10-15 technologies each
const EXTENDED_STACKS: Record<string, string[]> = {
	'CloudSync Pro': [
		'React', 'TypeScript', 'Tailwind', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'AWS S3', 'Socket.IO', 'JWT', 'Zod'
	],
	'TaskFlow': [
		'Vue', 'TypeScript', 'SCSS', 'NestJS', 'MongoDB', 'Prisma', 'Redis', 'Docker', 'JWT', 'Zod', 'Vitest', 'Framer Motion'
	],
	'CodeReview AI': [
		'Next.js', 'TypeScript', 'Tailwind', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'OpenAI', 'LangChain', 'Zod'
	],
	'DevMetrics': [
		'React', 'TypeScript', 'Tailwind', 'Three.js', 'D3.js', 'Express', 'PostgreSQL', 'InfluxDB', 'Redis', 'Docker', 'Grafana', 'Prometheus'
	],
	'SecureVault': [
		'SvelteKit', 'TypeScript', 'SCSS', 'Rust', 'PostgreSQL', 'Redis', 'Docker', 'WebCrypto', 'JWT', 'Zod', 'Vitest'
	],
	'DataPipeline': [
		'Go', 'TypeScript', 'React', 'Tailwind', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Kafka', 'Grafana', 'Prometheus'
	],
	'MobileKit': [
		'React', 'TypeScript', 'Expo', 'NativeWind', 'Zustand', 'tRPC', 'Zod', 'Jest', 'Firebase', 'Redux', 'Framer Motion'
	],
	'AIAssistant': [
		'Python', 'FastAPI', 'TypeScript', 'React', 'Tailwind', 'PostgreSQL', 'Redis', 'Docker', 'OpenAI', 'LangChain', 'Pinecone', 'Zod'
	]
};

async function extendStacks() {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		console.log('Verbunden mit MongoDB...');

		const db = client.db(DB_NAME);
		const projects = db.collection('projects');

		// Get all existing projects
		const existingProjects = await projects.find({}).toArray();
		console.log(`\n${existingProjects.length} Projekte gefunden.\n`);

		let updated = 0;

		for (const project of existingProjects) {
			const newStack = EXTENDED_STACKS[project.name];

			if (newStack) {
				await projects.updateOne(
					{ _id: project._id },
					{ $set: { stack: newStack } }
				);
				console.log(`✓ ${project.name}: ${project.stack?.length || 0} → ${newStack.length} Techs`);
				updated++;
			} else {
				console.log(`- ${project.name}: Kein erweiterter Stack definiert`);
			}
		}

		console.log(`\n${updated} Projekte aktualisiert!`);

	} catch (error) {
		console.error('Fehler:', error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

extendStacks();

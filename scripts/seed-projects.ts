import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'degidev';

const DEMO_PROJECTS = [
	{
		name: 'DegiDev Portfolio',
		url: 'https://degidev.de',
		description: 'Meine persoenliche Portfolio-Seite mit Projektuebersicht',
		icon: null,
		repoUrl: 'https://github.com/degidev/portfolio',
		stack: ['SvelteKit', 'TypeScript', 'SCSS', 'MongoDB', 'Lucia', 'Bun', 'Vite', 'Zod', 'Docker', 'Redis'],
		status: 'live',
		order: 0
	},
	{
		name: 'Task Manager Pro',
		url: 'https://tasks.degidev.de',
		description: 'Vollstaendige Aufgabenverwaltung mit Teams und Projekten',
		icon: null,
		repoUrl: 'https://github.com/degidev/taskmanager',
		stack: ['React', 'TypeScript', 'Tailwind', 'Express', 'PostgreSQL', 'Prisma', 'JWT', 'Docker', 'Redis', 'Socket.IO', 'Zod'],
		status: 'live',
		order: 1
	},
	{
		name: 'Chat Application',
		url: 'https://chat.degidev.de',
		description: 'Echtzeit-Chat mit Raeumen und Direktnachrichten',
		icon: null,
		repoUrl: 'https://github.com/degidev/chat-app',
		stack: ['Next.js', 'TypeScript', 'Tailwind', 'Socket.IO', 'MongoDB', 'NextAuth', 'Cloudinary', 'Zod', 'Docker', 'Redis', 'Framer Motion'],
		status: 'beta',
		order: 2
	},
	{
		name: 'E-Commerce Platform',
		url: 'https://shop.degidev.de',
		description: 'Moderner Online-Shop mit Warenkorb und Bezahlung',
		icon: null,
		repoUrl: 'https://github.com/degidev/ecommerce',
		stack: ['Vue', 'TypeScript', 'SCSS', 'NestJS', 'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'JWT', 'Cloudinary', 'Zod', 'Vitest'],
		status: 'wip',
		order: 3
	},
	{
		name: 'Analytics Dashboard',
		url: 'https://analytics.degidev.de',
		description: 'Datenvisualisierung und Business Intelligence',
		icon: null,
		repoUrl: 'https://github.com/degidev/analytics',
		stack: ['React', 'TypeScript', 'Tailwind', 'Three.js', 'D3.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'JWT', 'Zod'],
		status: 'coming_soon',
		order: 4
	},
	{
		name: 'API Gateway',
		url: 'https://api.degidev.de',
		description: 'Zentraler API Gateway fuer alle Services',
		icon: null,
		repoUrl: 'https://github.com/degidev/api-gateway',
		stack: ['Hono', 'TypeScript', 'Bun', 'Redis', 'Docker', 'JWT', 'Zod', 'Vitest', 'Prometheus', 'Grafana'],
		status: 'live',
		order: 5
	},
	{
		name: 'Blog CMS',
		url: 'https://blog.degidev.de',
		description: 'Headless CMS fuer technische Blog-Artikel',
		icon: null,
		repoUrl: 'https://github.com/degidev/blog-cms',
		stack: ['Astro', 'TypeScript', 'Tailwind', 'MongoDB', 'Cloudinary', 'Docker', 'Zod', 'MDX', 'Shiki', 'RSS'],
		status: 'live',
		order: 6
	},
	{
		name: 'Mobile App',
		url: 'https://app.degidev.de',
		description: 'Cross-Platform Mobile App mit React Native',
		icon: null,
		repoUrl: 'https://github.com/degidev/mobile-app',
		stack: ['React', 'TypeScript', 'Expo', 'NativeWind', 'Zustand', 'tRPC', 'Zod', 'Jest', 'Detox', 'Firebase'],
		status: 'wip',
		order: 7
	},
	{
		name: 'DevOps Toolkit',
		url: 'https://devops.degidev.de',
		description: 'CI/CD Pipelines und Infrastructure as Code',
		icon: null,
		repoUrl: 'https://github.com/degidev/devops-toolkit',
		stack: ['Go', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GitHub Actions', 'Prometheus', 'Grafana', 'Loki', 'ArgoCD'],
		status: 'beta',
		order: 8
	},
	{
		name: 'AI Assistant',
		url: 'https://ai.degidev.de',
		description: 'KI-gesteuerter Coding Assistant',
		icon: null,
		repoUrl: 'https://github.com/degidev/ai-assistant',
		stack: ['Python', 'FastAPI', 'TypeScript', 'React', 'Tailwind', 'PostgreSQL', 'Redis', 'Docker', 'OpenAI', 'LangChain', 'Pinecone'],
		status: 'coming_soon',
		order: 9
	},
	{
		name: 'File Storage',
		url: 'https://files.degidev.de',
		description: 'Cloud-Speicher mit End-to-End Verschluesselung',
		icon: null,
		repoUrl: 'https://github.com/degidev/file-storage',
		stack: ['SvelteKit', 'TypeScript', 'SCSS', 'Rust', 'PostgreSQL', 'MinIO', 'Docker', 'WebCrypto', 'Zod', 'Vitest'],
		status: 'wip',
		order: 10
	},
	{
		name: 'Monitoring Stack',
		url: 'https://monitor.degidev.de',
		description: 'Zentrale Ueberwachung aller Services',
		icon: null,
		repoUrl: 'https://github.com/degidev/monitoring',
		stack: ['Go', 'TypeScript', 'React', 'Tailwind', 'InfluxDB', 'Grafana', 'Prometheus', 'Alertmanager', 'Docker', 'Kubernetes'],
		status: 'live',
		order: 11
	}
];

async function seedProjects() {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		console.log('Verbunden mit MongoDB...');

		const db = client.db(DB_NAME);
		const projects = db.collection('projects');

		// Clear existing projects
		const deleteResult = await projects.deleteMany({});
		console.log(`${deleteResult.deletedCount} existierende Projekte geloescht.`);

		// Insert demo projects
		const insertResult = await projects.insertMany(DEMO_PROJECTS);
		console.log(`${insertResult.insertedCount} Demo-Projekte erstellt!`);

		console.log('\nProjekte:');
		DEMO_PROJECTS.forEach((p, i) => {
			console.log(`  ${i + 1}. ${p.name} (${p.status}) - ${p.stack.length} Techs`);
		});

	} catch (error) {
		console.error('Fehler:', error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

seedProjects();

export type Category = 'frontend' | 'backend' | 'database' | 'tools' | 'language';

export interface TechItem {
	name: string;
	category: Category;
	icon: string;
}

// Map tech names to their category and devicon class
const TECH_INFO: Record<string, { category: Category; icon: string }> = {
	// Frontend
	'React': { category: 'frontend', icon: 'react' },
	'React (TSX)': { category: 'frontend', icon: 'react' },
	'React (JSX)': { category: 'frontend', icon: 'react' },
	'React Router': { category: 'frontend', icon: 'reactrouter' },
	'Next.js': { category: 'frontend', icon: 'nextjs' },
	'Vue': { category: 'frontend', icon: 'vuejs' },
	'Vue Router': { category: 'frontend', icon: 'vuejs' },
	'Nuxt': { category: 'frontend', icon: 'nuxtjs' },
	'Svelte': { category: 'frontend', icon: 'svelte' },
	'SvelteKit': { category: 'frontend', icon: 'svelte' },
	'Angular': { category: 'frontend', icon: 'angular' },
	'Solid': { category: 'frontend', icon: 'solidjs' },
	'Preact': { category: 'frontend', icon: 'react' },
	'Astro': { category: 'frontend', icon: 'astro' },
	'Gatsby': { category: 'frontend', icon: 'gatsby' },
	'Remix': { category: 'frontend', icon: 'remix' },
	'Tailwind': { category: 'frontend', icon: 'tailwindcss' },
	'SCSS': { category: 'frontend', icon: 'sass' },
	'Styled Components': { category: 'frontend', icon: 'css3' },
	'Emotion': { category: 'frontend', icon: 'css3' },
	'Redux': { category: 'frontend', icon: 'redux' },
	'Zustand': { category: 'frontend', icon: 'react' },
	'MobX': { category: 'frontend', icon: 'mobx' },
	'Three.js': { category: 'frontend', icon: 'threejs' },
	'GSAP': { category: 'frontend', icon: 'javascript' },
	'Framer Motion': { category: 'frontend', icon: 'framermotion' },

	// Backend
	'Express': { category: 'backend', icon: 'express' },
	'Fastify': { category: 'backend', icon: 'fastify' },
	'Koa': { category: 'backend', icon: 'nodejs' },
	'Hono': { category: 'backend', icon: 'nodejs' },
	'Elysia': { category: 'backend', icon: 'bun' },
	'NestJS': { category: 'backend', icon: 'nestjs' },
	'Lucia': { category: 'backend', icon: 'nodejs' },
	'NextAuth': { category: 'backend', icon: 'nextjs' },
	'Auth.js': { category: 'backend', icon: 'nodejs' },
	'Passport': { category: 'backend', icon: 'nodejs' },
	'JWT': { category: 'backend', icon: 'nodejs' },
	'bcrypt': { category: 'backend', icon: 'nodejs' },
	'Multer': { category: 'backend', icon: 'nodejs' },
	'Cloudinary': { category: 'backend', icon: 'cloudflare' },
	'Sharp': { category: 'backend', icon: 'nodejs' },
	'Socket.IO': { category: 'backend', icon: 'socketio' },
	'tRPC': { category: 'backend', icon: 'trpc' },
	'GraphQL': { category: 'backend', icon: 'graphql' },
	'Apollo': { category: 'backend', icon: 'graphql' },

	// Database
	'MongoDB': { category: 'database', icon: 'mongodb' },
	'Prisma': { category: 'database', icon: 'prisma' },
	'Drizzle': { category: 'database', icon: 'postgresql' },
	'PostgreSQL': { category: 'database', icon: 'postgresql' },
	'MySQL': { category: 'database', icon: 'mysql' },
	'SQLite': { category: 'database', icon: 'sqlite' },
	'Redis': { category: 'database', icon: 'redis' },

	// Tools
	'Vite': { category: 'tools', icon: 'vitejs' },
	'Webpack': { category: 'tools', icon: 'webpack' },
	'esbuild': { category: 'tools', icon: 'esbuild' },
	'Turborepo': { category: 'tools', icon: 'turborepo' },
	'Bun': { category: 'tools', icon: 'bun' },
	'Zod': { category: 'tools', icon: 'typescript' },
	'Jest': { category: 'tools', icon: 'jest' },
	'Vitest': { category: 'tools', icon: 'vitest' },
	'Playwright': { category: 'tools', icon: 'playwright' },
	'Cypress': { category: 'tools', icon: 'cypressio' },
	'Electron': { category: 'tools', icon: 'electron' },
	'Tauri': { category: 'tools', icon: 'tauri' },
	'Docker': { category: 'tools', icon: 'docker' },

	// Languages
	'TypeScript': { category: 'language', icon: 'typescript' },
	'JavaScript': { category: 'language', icon: 'javascript' },
	'Python': { category: 'language', icon: 'python' },
	'Go': { category: 'language', icon: 'go' },
	'Rust': { category: 'language', icon: 'rust' },
	'Java': { category: 'language', icon: 'java' },
	'C#': { category: 'language', icon: 'csharp' },
	'C++': { category: 'language', icon: 'cplusplus' },
	'C': { category: 'language', icon: 'c' },
	'PHP': { category: 'language', icon: 'php' },
	'Ruby': { category: 'language', icon: 'ruby' },
	'Swift': { category: 'language', icon: 'swift' },
	'Kotlin': { category: 'language', icon: 'kotlin' },
	'Dart': { category: 'language', icon: 'dart' },
	'CSS': { category: 'language', icon: 'css3' },
	'HTML': { category: 'language', icon: 'html5' },
	'Shell': { category: 'language', icon: 'bash' },
	'Lua': { category: 'language', icon: 'lua' },
};

// Category colors (CSS custom properties)
export const CATEGORY_COLORS: Record<Category, string> = {
	frontend: '#61dafb',   // React blue
	backend: '#68a063',    // Node green
	database: '#f7a600',   // Orange
	tools: '#a855f7',      // Purple
	language: '#6b7280',   // Gray
};

// Icons that only have 'original' variant (not 'plain')
const ORIGINAL_ONLY_ICONS = new Set([
	'express',
	'nextjs',
	'prisma',
	'socketio',
	'trpc',
	'framermotion',
	'threejs',
]);

// Get the full devicon class name
export function getDeviconClass(icon: string): string {
	const variant = ORIGINAL_ONLY_ICONS.has(icon) ? 'original' : 'plain';
	return `devicon-${icon}-${variant}`;
}

export function techNameToItem(name: string): TechItem {
	const info = TECH_INFO[name];
	if (info) {
		return { name, ...info };
	}
	// Default fallback for unknown tech
	return {
		name,
		category: 'tools',
		icon: 'devicon'
	};
}

export function stackToTechItems(stack: string[]): TechItem[] {
	return stack.map(techNameToItem);
}

// Group tech items by category, sorted by importance
export function groupByCategory(items: TechItem[]): Record<Category, TechItem[]> {
	const groups: Record<Category, TechItem[]> = {
		frontend: [],
		backend: [],
		database: [],
		tools: [],
		language: []
	};

	for (const item of items) {
		groups[item.category].push(item);
	}

	return groups;
}

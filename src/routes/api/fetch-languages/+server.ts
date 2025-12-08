import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export type Category = 'frontend' | 'backend' | 'database' | 'tools' | 'language';

export interface TechItem {
	name: string;
	category: Category;
	icon: string;
}

interface TechInfo {
	name: string;
	category: Category;
	icon: string; // devicon class name
}

// Framework detection mapping with category and icon info
const TECH_MAP: Record<string, TechInfo> = {
	// Frontend Frameworks
	'react': { name: 'React', category: 'frontend', icon: 'react' },
	'react-dom': { name: 'React', category: 'frontend', icon: 'react' },
	'react-router-dom': { name: 'React Router', category: 'frontend', icon: 'reactrouter' },
	'next': { name: 'Next.js', category: 'frontend', icon: 'nextjs' },
	'vue': { name: 'Vue', category: 'frontend', icon: 'vuejs' },
	'vue-router': { name: 'Vue Router', category: 'frontend', icon: 'vuejs' },
	'nuxt': { name: 'Nuxt', category: 'frontend', icon: 'nuxtjs' },
	'svelte': { name: 'Svelte', category: 'frontend', icon: 'svelte' },
	'@sveltejs/kit': { name: 'SvelteKit', category: 'frontend', icon: 'svelte' },
	'angular': { name: 'Angular', category: 'frontend', icon: 'angular' },
	'@angular/core': { name: 'Angular', category: 'frontend', icon: 'angular' },
	'solid-js': { name: 'Solid', category: 'frontend', icon: 'solidjs' },
	'preact': { name: 'Preact', category: 'frontend', icon: 'react' },
	'astro': { name: 'Astro', category: 'frontend', icon: 'astro' },
	'gatsby': { name: 'Gatsby', category: 'frontend', icon: 'gatsby' },
	'remix': { name: 'Remix', category: 'frontend', icon: 'remix' },
	'@remix-run/react': { name: 'Remix', category: 'frontend', icon: 'remix' },

	// Backend Frameworks
	'express': { name: 'Express', category: 'backend', icon: 'express' },
	'fastify': { name: 'Fastify', category: 'backend', icon: 'fastify' },
	'koa': { name: 'Koa', category: 'backend', icon: 'nodejs' },
	'hono': { name: 'Hono', category: 'backend', icon: 'nodejs' },
	'elysia': { name: 'Elysia', category: 'backend', icon: 'bun' },
	'nestjs': { name: 'NestJS', category: 'backend', icon: 'nestjs' },
	'@nestjs/core': { name: 'NestJS', category: 'backend', icon: 'nestjs' },

	// Databases
	'mongodb': { name: 'MongoDB', category: 'database', icon: 'mongodb' },
	'mongoose': { name: 'MongoDB', category: 'database', icon: 'mongodb' },
	'prisma': { name: 'Prisma', category: 'database', icon: 'prisma' },
	'@prisma/client': { name: 'Prisma', category: 'database', icon: 'prisma' },
	'drizzle-orm': { name: 'Drizzle', category: 'database', icon: 'postgresql' },
	'pg': { name: 'PostgreSQL', category: 'database', icon: 'postgresql' },
	'mysql2': { name: 'MySQL', category: 'database', icon: 'mysql' },
	'better-sqlite3': { name: 'SQLite', category: 'database', icon: 'sqlite' },
	'redis': { name: 'Redis', category: 'database', icon: 'redis' },
	'ioredis': { name: 'Redis', category: 'database', icon: 'redis' },

	// Build Tools & Runtime
	'vite': { name: 'Vite', category: 'tools', icon: 'vitejs' },
	'@vitejs/plugin-react': { name: 'Vite', category: 'tools', icon: 'vitejs' },
	'webpack': { name: 'Webpack', category: 'tools', icon: 'webpack' },
	'esbuild': { name: 'esbuild', category: 'tools', icon: 'esbuild' },
	'turbo': { name: 'Turborepo', category: 'tools', icon: 'turborepo' },
	'bun': { name: 'Bun', category: 'tools', icon: 'bun' },

	// Styling
	'tailwindcss': { name: 'Tailwind', category: 'frontend', icon: 'tailwindcss' },
	'sass': { name: 'SCSS', category: 'frontend', icon: 'sass' },
	'styled-components': { name: 'Styled Components', category: 'frontend', icon: 'css3' },
	'@emotion/react': { name: 'Emotion', category: 'frontend', icon: 'css3' },

	// State Management
	'redux': { name: 'Redux', category: 'frontend', icon: 'redux' },
	'@reduxjs/toolkit': { name: 'Redux', category: 'frontend', icon: 'redux' },
	'zustand': { name: 'Zustand', category: 'frontend', icon: 'react' },
	'mobx': { name: 'MobX', category: 'frontend', icon: 'mobx' },

	// Validation & Utils
	'zod': { name: 'Zod', category: 'tools', icon: 'typescript' },

	// Auth
	'lucia': { name: 'Lucia', category: 'backend', icon: 'nodejs' },
	'next-auth': { name: 'NextAuth', category: 'backend', icon: 'nextjs' },
	'@auth/core': { name: 'Auth.js', category: 'backend', icon: 'nodejs' },
	'passport': { name: 'Passport', category: 'backend', icon: 'nodejs' },
	'jsonwebtoken': { name: 'JWT', category: 'backend', icon: 'nodejs' },

	// File/Media
	'multer': { name: 'Multer', category: 'backend', icon: 'nodejs' },
	'cloudinary': { name: 'Cloudinary', category: 'backend', icon: 'cloudflare' },
	'sharp': { name: 'Sharp', category: 'backend', icon: 'nodejs' },

	// Testing
	'jest': { name: 'Jest', category: 'tools', icon: 'jest' },
	'vitest': { name: 'Vitest', category: 'tools', icon: 'vitest' },
	'playwright': { name: 'Playwright', category: 'tools', icon: 'playwright' },
	'cypress': { name: 'Cypress', category: 'tools', icon: 'cypressio' },

	// Realtime & API
	'socket.io': { name: 'Socket.IO', category: 'backend', icon: 'socketio' },
	'trpc': { name: 'tRPC', category: 'backend', icon: 'trpc' },
	'@trpc/server': { name: 'tRPC', category: 'backend', icon: 'trpc' },
	'graphql': { name: 'GraphQL', category: 'backend', icon: 'graphql' },
	'apollo-server': { name: 'Apollo', category: 'backend', icon: 'graphql' },
	'@apollo/client': { name: 'Apollo', category: 'frontend', icon: 'graphql' },

	// Desktop
	'electron': { name: 'Electron', category: 'tools', icon: 'electron' },
	'tauri': { name: 'Tauri', category: 'tools', icon: 'tauri' },
	'@tauri-apps/api': { name: 'Tauri', category: 'tools', icon: 'tauri' },

	// Animation
	'three': { name: 'Three.js', category: 'frontend', icon: 'threejs' },
	'gsap': { name: 'GSAP', category: 'frontend', icon: 'javascript' },
	'framer-motion': { name: 'Framer Motion', category: 'frontend', icon: 'framermotion' },
};

// Language to icon mapping
const LANGUAGE_ICONS: Record<string, string> = {
	'TypeScript': 'typescript',
	'JavaScript': 'javascript',
	'Python': 'python',
	'Go': 'go',
	'Rust': 'rust',
	'Java': 'java',
	'C#': 'csharp',
	'C++': 'cplusplus',
	'C': 'c',
	'PHP': 'php',
	'Ruby': 'ruby',
	'Swift': 'swift',
	'Kotlin': 'kotlin',
	'Dart': 'dart',
	'SCSS': 'sass',
	'CSS': 'css3',
	'HTML': 'html5',
	'Shell': 'bash',
	'Lua': 'lua',
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Nicht autorisiert' }, { status: 401 });
	}

	const { repoUrl } = await request.json();

	if (!repoUrl) {
		return json({ error: 'Repository URL erforderlich' }, { status: 400 });
	}

	try {
		const url = new URL(repoUrl);
		const pathParts = url.pathname.split('/').filter(Boolean);

		if (pathParts.length < 2) {
			return json({ languages: [], frameworks: [] });
		}

		const owner = pathParts[0];
		const repo = pathParts[1];
		const isGitHub = url.hostname === 'github.com';

		const headers = {
			'User-Agent': 'DegiDev-LandingPage/1.0',
			Accept: 'application/json'
		};

		// Fetch languages
		let languagesApiUrl: string;
		if (isGitHub) {
			languagesApiUrl = `https://api.github.com/repos/${owner}/${repo}/languages`;
		} else {
			languagesApiUrl = `${url.origin}/api/v1/repos/${owner}/${repo}/languages`;
		}

		const languagesResponse = await fetch(languagesApiUrl, { headers });
		let topLanguages: TechItem[] = [];

		if (languagesResponse.ok) {
			const languagesData = await languagesResponse.json();
			const entries = Object.entries(languagesData) as [string, number][];
			const sorted = entries.sort((a, b) => b[1] - a[1]);
			topLanguages = sorted.slice(0, 3).map(([lang]) => languageToTechItem(lang));
		}

		// Fetch package.json for framework detection (including monorepo support)
		let frameworks: TechItem[] = [];
		const branch = isGitHub ? 'main' : 'main';

		// Try multiple package.json locations for monorepo support
		const packagePaths = [
			'package.json',
			'frontend/package.json',
			'backend/package.json',
			'shared/package.json',
			'server/package.json',
			'client/package.json',
			'app/package.json',
			'web/package.json',
			'api/package.json',
			'packages/app/package.json',
			'packages/web/package.json',
			'packages/api/package.json',
			'packages/shared/package.json',
			'apps/web/package.json',
			'apps/api/package.json',
		];

		for (const path of packagePaths) {
			let packageJsonUrl: string;
			if (isGitHub) {
				packageJsonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
			} else {
				packageJsonUrl = `${url.origin}/${owner}/${repo}/raw/branch/${branch}/${path}`;
			}

			try {
				let response = await fetch(packageJsonUrl, { headers });

				// Try master branch if main fails (only for root package.json)
				if (!response.ok && isGitHub && path === 'package.json') {
					packageJsonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`;
					response = await fetch(packageJsonUrl, { headers });
				}

				if (response.ok) {
					const packageJson = await response.json();
					const detected = detectFrameworks(packageJson);
					// Merge by name to avoid duplicates
					for (const item of detected) {
						if (!frameworks.some(f => f.name === item.name)) {
							frameworks.push(item);
						}
					}
				}
			} catch {
				// Ignore errors for individual package.json files
			}
		}

		// Combine frameworks and languages, dedupe by name
		const allTech: TechItem[] = [...frameworks];
		for (const lang of topLanguages) {
			if (!allTech.some(t => t.name === lang.name)) {
				allTech.push(lang);
			}
		}

		return json({
			stack: allTech,
			// Legacy format for backward compatibility
			languages: allTech.map(t => t.name),
			frameworks: frameworks.map(f => f.name),
			rawLanguages: topLanguages.map(l => l.name)
		});
	} catch (error) {
		return json({ stack: [], languages: [], frameworks: [] });
	}
};

function detectFrameworks(packageJson: any): TechItem[] {
	const detected: Map<string, TechItem> = new Map();

	const allDeps = {
		...packageJson.dependencies,
		...packageJson.devDependencies
	};

	// Check for TypeScript presence
	const hasTypeScript = allDeps['typescript'] !== undefined;

	for (const [dep, tech] of Object.entries(TECH_MAP)) {
		if (allDeps[dep]) {
			// Special handling for React: convert to TSX or JSX
			if (tech.name === 'React') {
				const name = hasTypeScript ? 'React (TSX)' : 'React (JSX)';
				detected.set(name, { name, category: tech.category, icon: tech.icon });
			} else {
				detected.set(tech.name, tech);
			}
		}
	}

	// Special case: detect Bun from package.json or bun.lockb mention
	if (packageJson.packageManager?.includes('bun') || packageJson.scripts?.dev?.includes('bun')) {
		detected.set('Bun', { name: 'Bun', category: 'tools', icon: 'bun' });
	}

	return Array.from(detected.values());
}

function languageToTechItem(lang: string): TechItem {
	return {
		name: lang,
		category: 'language',
		icon: LANGUAGE_ICONS[lang] || 'devicon'
	};
}

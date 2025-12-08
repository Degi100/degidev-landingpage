import type { PageServerLoad } from './$types';
import { collections } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const projects = await collections.projects.find({}).sort({ order: 1 }).toArray();

	return {
		projects: projects.map((p) => ({
			_id: p._id.toString(),
			name: p.name,
			url: p.url,
			description: p.description,
			icon: p.icon || null,
			stack: p.stack || [],
			order: p.order
		}))
	};
};

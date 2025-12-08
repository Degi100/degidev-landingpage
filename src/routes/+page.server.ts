import type { PageServerLoad, Actions } from './$types';
import { collections } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { ProjectStatus } from '$lib/types';

const validStatuses: ProjectStatus[] = ['live', 'beta', 'wip', 'coming_soon'];

export const load: PageServerLoad = async ({ locals }) => {
	const projects = await collections.projects.find({}).sort({ order: 1 }).toArray();

	return {
		user: locals.user || null,
		projects: projects.map((p) => ({
			_id: p._id.toString(),
			name: p.name,
			url: p.url,
			description: p.description,
			icon: p.icon || null,
			repoUrl: p.repoUrl || null,
			stack: p.stack || [],
			status: (p.status as ProjectStatus) || 'live',
			order: p.order
		}))
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Nicht autorisiert' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const url = formData.get('url') as string;
		const description = formData.get('description') as string;
		const icon = formData.get('icon') as string;
		const repoUrl = formData.get('repoUrl') as string;
		const stack = formData.get('stack') as string;
		const status = formData.get('status') as string;

		if (!name || !url || !description) {
			return fail(400, { error: 'Alle Felder erforderlich' });
		}

		const stackArray = stack
			? stack.split(',').map(s => s.trim()).filter(s => s.length > 0)
			: [];

		const validStatus = validStatuses.includes(status as ProjectStatus) ? status : 'live';
		const count = await collections.projects.countDocuments();

		await collections.projects.insertOne({
			name,
			url,
			description,
			icon: icon || null,
			repoUrl: repoUrl || null,
			stack: stackArray,
			status: validStatus,
			order: count
		});

		return { success: true };
	},

	edit: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Nicht autorisiert' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const url = formData.get('url') as string;
		const description = formData.get('description') as string;
		const icon = formData.get('icon') as string;
		const repoUrl = formData.get('repoUrl') as string;
		const stack = formData.get('stack') as string;
		const status = formData.get('status') as string;

		if (!id || !name || !url || !description) {
			return fail(400, { error: 'Alle Felder erforderlich' });
		}

		const stackArray = stack
			? stack.split(',').map(s => s.trim()).filter(s => s.length > 0)
			: [];

		const validStatus = validStatuses.includes(status as ProjectStatus) ? status : 'live';

		await collections.projects.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					name,
					url,
					description,
					icon: icon || null,
					repoUrl: repoUrl || null,
					stack: stackArray,
					status: validStatus
				}
			}
		);

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Nicht autorisiert' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'ID erforderlich' });
		}

		await collections.projects.deleteOne({ _id: new ObjectId(id) });

		return { success: true };
	}
};

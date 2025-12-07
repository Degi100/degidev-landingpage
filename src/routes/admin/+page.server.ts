import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { collections } from '$lib/server/db';
import { lucia } from '$lib/server/auth';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const projects = await collections.projects.find({}).sort({ order: 1 }).toArray();

	return {
		user: locals.user,
		projects: projects.map((p) => ({
			_id: p._id.toString(),
			name: p.name,
			url: p.url,
			description: p.description,
			icon: p.icon || null,
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

		if (!name || !url || !description) {
			return fail(400, { error: 'Alle Felder erforderlich' });
		}

		const count = await collections.projects.countDocuments();

		await collections.projects.insertOne({
			name,
			url,
			description,
			icon: icon || null,
			order: count
		});

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Nicht autorisiert' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Projekt ID erforderlich' });
		}

		await collections.projects.deleteOne({ _id: new ObjectId(id) });

		return { success: true };
	},

	logout: async ({ cookies, locals }) => {
		if (!locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};

import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { collections } from '$lib/server/db';
import { lucia } from '$lib/server/auth';
import { ObjectId } from 'mongodb';
import { verify, hash } from '@node-rs/argon2';

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
			repoUrl: p.repoUrl || null,
			stack: p.stack || [],
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

		if (!name || !url || !description) {
			return fail(400, { error: 'Alle Felder erforderlich' });
		}

		// Parse stack into array
		const stackArray = stack
			? stack.split(',').map(s => s.trim()).filter(s => s.length > 0)
			: [];

		const count = await collections.projects.countDocuments();

		await collections.projects.insertOne({
			name,
			url,
			description,
			icon: icon || null,
			repoUrl: repoUrl || null,
			stack: stackArray,
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
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Nicht autorisiert' });
		}

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword') as string;
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { passwordError: 'Alle Felder erforderlich' });
		}

		if (newPassword.length < 8) {
			return fail(400, { passwordError: 'Neues Passwort muss mindestens 8 Zeichen haben' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'Passwoerter stimmen nicht ueberein' });
		}

		const user = await collections.users.findOne({ _id: new ObjectId(locals.user.id) });
		if (!user) {
			return fail(400, { passwordError: 'Benutzer nicht gefunden' });
		}

		const validPassword = await verify(user.password_hash, currentPassword);
		if (!validPassword) {
			return fail(400, { passwordError: 'Aktuelles Passwort ist falsch' });
		}

		const newPasswordHash = await hash(newPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		await collections.users.updateOne(
			{ _id: new ObjectId(locals.user.id) },
			{ $set: { password_hash: newPasswordHash } }
		);

		return { passwordSuccess: true };
	}
};

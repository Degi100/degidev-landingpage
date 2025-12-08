import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { collections } from '$lib/server/db';
import { verify } from '@node-rs/argon2';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		if (!username || !password) {
			return fail(400, { error: 'Username und Password erforderlich' });
		}

		const user = await collections.users.findOne({ username: username.toLowerCase() });

		if (!user) {
			return fail(400, { error: 'Ungueltige Anmeldedaten' });
		}

		const validPassword = await verify(user.password_hash, password);

		if (!validPassword) {
			return fail(400, { error: 'Ungueltige Anmeldedaten' });
		}

		const session = await lucia.createSession(user._id.toString(), {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});

		redirect(302, '/admin');
	}
};

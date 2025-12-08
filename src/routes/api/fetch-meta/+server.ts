import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Nicht autorisiert' }, { status: 401 });
	}

	const { url } = await request.json();

	if (!url) {
		return json({ error: 'URL erforderlich' }, { status: 400 });
	}

	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; DegiDev/1.0)'
			}
		});

		const html = await response.text();

		// Extract title
		const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
		const title = titleMatch ? titleMatch[1].trim() : '';

		// Extract description
		const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
			|| html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
		const description = descMatch ? descMatch[1].trim() : '';

		// Extract favicon
		const iconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i)
			|| html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon)["']/i);
		let icon = iconMatch ? iconMatch[1].trim() : '';

		// Make icon URL absolute
		if (icon && !icon.startsWith('http')) {
			const urlObj = new URL(url);
			icon = icon.startsWith('/')
				? `${urlObj.origin}${icon}`
				: `${urlObj.origin}/${icon}`;
		}

		return json({
			title,
			description,
			icon
		});
	} catch (error) {
		return json({ error: 'Konnte Metadaten nicht laden' }, { status: 500 });
	}
};

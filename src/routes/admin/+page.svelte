<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let showAddForm = $state(false);
	let urlInput = $state('');
	let nameInput = $state('');
	let descriptionInput = $state('');
	let iconInput = $state('');
	let repoUrlInput = $state('');
	let stackInput = $state('');
	let loading = $state(false);
	let loadingRepo = $state(false);
	let showPasswordForm = $state(false);

	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleUrlInput() {
		clearTimeout(debounceTimer);
		// Check if URL looks valid
		if (urlInput.match(/^https?:\/\/.+\..+/)) {
			debounceTimer = setTimeout(fetchMeta, 500);
		}
	}

	async function fetchMeta() {
		if (!urlInput || loading) return;
		if (!urlInput.match(/^https?:\/\/.+\..+/)) return;

		loading = true;
		try {
			const res = await fetch('/api/fetch-meta', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: urlInput })
			});

			if (res.ok) {
				const meta = await res.json();
				if (meta.title && !nameInput) nameInput = meta.title;
				if (meta.description && !descriptionInput) descriptionInput = meta.description;
				if (meta.icon && !iconInput) iconInput = meta.icon;
			}
		} catch (e) {
			// Ignore errors, user can fill manually
		}
		loading = false;
	}

	let repoDebounceTimer: ReturnType<typeof setTimeout>;

	function handleRepoUrlInput() {
		clearTimeout(repoDebounceTimer);
		// Check if URL looks like GitHub or Forgejo repo
		if (repoUrlInput.match(/^https?:\/\/.+\/.+\/.+/)) {
			repoDebounceTimer = setTimeout(fetchRepoLanguages, 500);
		}
	}

	async function fetchRepoLanguages() {
		if (!repoUrlInput || loadingRepo) return;

		loadingRepo = true;
		try {
			const res = await fetch('/api/fetch-languages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ repoUrl: repoUrlInput })
			});

			if (res.ok) {
				const data = await res.json();
				if (data.languages && data.languages.length > 0) {
					// Append to existing stack if any
					const existing = stackInput ? stackInput.split(',').map(s => s.trim()) : [];
					const combined = [...new Set([...existing, ...data.languages])];
					stackInput = combined.join(', ');
				}
			}
		} catch (e) {
			// Ignore errors
		}
		loadingRepo = false;
	}

	function resetForm() {
		urlInput = '';
		nameInput = '';
		descriptionInput = '';
		iconInput = '';
		repoUrlInput = '';
		stackInput = '';
	}
</script>

<main class="admin-container">
	<header class="admin-header">
		<div>
			<h1>Admin Dashboard</h1>
			<p>Eingeloggt als {data.user.username}</p>
		</div>
		<div class="header-actions">
			<a href="/" class="btn secondary">Zur Seite</a>
			<form method="POST" action="?/logout" use:enhance>
				<button type="submit" class="secondary">Logout</button>
			</form>
		</div>
	</header>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.success}
		<p class="success">Aktion erfolgreich!</p>
	{/if}

	{#if form?.passwordError}
		<p class="error">{form.passwordError}</p>
	{/if}

	{#if form?.passwordSuccess}
		<p class="success">Passwort erfolgreich geaendert!</p>
	{/if}

	<section class="projects-section">
		<div class="section-header">
			<h2>Projekte ({data.projects.length})</h2>
			<button class="primary" onclick={() => { showAddForm = !showAddForm; if (!showAddForm) resetForm(); }}>
				{showAddForm ? 'Abbrechen' : '+ Neues Projekt'}
			</button>
		</div>

		{#if showAddForm}
			<form method="POST" action="?/add" use:enhance={() => { return async ({ update }) => { await update(); resetForm(); showAddForm = false; }; }} class="add-form">
				<div class="form-grid">
					<div class="field">
						<label for="name">Name</label>
						<input type="text" id="name" name="name" placeholder="Forgejo" bind:value={nameInput} required />
					</div>
					<div class="field">
						<label for="url">URL</label>
						<div class="url-field">
							<input type="url" id="url" name="url" placeholder="https://forgejo.degidev.de" bind:value={urlInput} oninput={handleUrlInput} required />
							{#if loading}
								<span class="loading-indicator">...</span>
							{/if}
						</div>
					</div>
					<div class="field full">
						<label for="description">Beschreibung</label>
						<input type="text" id="description" name="description" placeholder="Git Server" bind:value={descriptionInput} required />
					</div>
					<div class="field full">
						<label for="icon">Icon URL (optional)</label>
						<input type="url" id="icon" name="icon" placeholder="https://..." bind:value={iconInput} />
					</div>
					<div class="field full">
						<label for="repoUrl">Repository URL (optional - fuer Auto-Stack)</label>
						<div class="url-field">
							<input type="url" id="repoUrl" name="repoUrl" placeholder="https://github.com/user/repo" bind:value={repoUrlInput} oninput={handleRepoUrlInput} />
							{#if loadingRepo}
								<span class="loading-indicator">...</span>
							{/if}
						</div>
					</div>
					<div class="field full">
						<label for="stack">Tech Stack (komma-separiert)</label>
						<input type="text" id="stack" name="stack" placeholder="SvelteKit, Bun, MongoDB" bind:value={stackInput} />
					</div>
				</div>
				<button type="submit" class="primary">Projekt hinzufuegen</button>
			</form>
		{/if}

		<div class="projects-list">
			{#each data.projects as project}
				<div class="project-item">
					<div class="project-info">
						<span class="project-icon">{project.name.charAt(0)}</span>
						<div>
							<strong>{project.name}</strong>
							<a href={project.url} target="_blank">{project.url}</a>
						</div>
					</div>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={project._id} />
						<button type="submit" class="delete-btn">Loeschen</button>
					</form>
				</div>
			{:else}
				<p class="empty">Noch keine Projekte. Fuege eins hinzu!</p>
			{/each}
		</div>
	</section>

	<section class="settings-section">
		<div class="section-header">
			<h2>Einstellungen</h2>
			<button class="secondary" onclick={() => showPasswordForm = !showPasswordForm}>
				{showPasswordForm ? 'Abbrechen' : 'Passwort aendern'}
			</button>
		</div>

		{#if showPasswordForm}
			<form method="POST" action="?/changePassword" use:enhance={() => { return async ({ update }) => { await update(); showPasswordForm = false; }; }} class="password-form">
				<div class="form-grid">
					<div class="field full">
						<label for="currentPassword">Aktuelles Passwort</label>
						<input type="password" id="currentPassword" name="currentPassword" required />
					</div>
					<div class="field">
						<label for="newPassword">Neues Passwort</label>
						<input type="password" id="newPassword" name="newPassword" minlength="8" required />
					</div>
					<div class="field">
						<label for="confirmPassword">Passwort bestaetigen</label>
						<input type="password" id="confirmPassword" name="confirmPassword" minlength="8" required />
					</div>
				</div>
				<button type="submit" class="primary">Passwort aendern</button>
			</form>
		{/if}
	</section>
</main>

<style lang="scss">
	.admin-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);

		h1 {
			font-size: 1.75rem;
			margin-bottom: 0.25rem;
		}

		p {
			color: var(--text-secondary);
			font-size: 0.875rem;
		}

		.header-actions {
			display: flex;
			gap: 0.75rem;
			align-items: center;

			.btn {
				padding: 0.75rem 1.5rem;
				border-radius: 8px;
				font-size: 1rem;
				font-weight: 500;
				background: var(--bg-card);
				color: var(--text-primary);
				border: 1px solid var(--border);

				&:hover {
					border-color: var(--accent);
				}
			}
		}
	}

	.error {
		background: rgba(248, 113, 113, 0.1);
		border: 1px solid var(--error);
		color: var(--error);
		padding: 0.75rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.success {
		background: rgba(74, 222, 128, 0.1);
		border: 1px solid var(--success);
		color: var(--success);
		padding: 0.75rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.projects-section {
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1.5rem;

			h2 {
				font-size: 1.25rem;
			}
		}
	}

	.add-form {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;

		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1rem;
			margin-bottom: 1.5rem;

			.field.full {
				grid-column: 1 / -1;
			}

			label {
				display: block;
				margin-bottom: 0.5rem;
				font-size: 0.875rem;
				color: var(--text-secondary);
			}
		}

		.url-field {
			position: relative;

			.loading-indicator {
				position: absolute;
				right: 12px;
				top: 50%;
				transform: translateY(-50%);
				color: var(--accent);
				animation: pulse 1s infinite;
			}
		}
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.projects-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		.empty {
			text-align: center;
			color: var(--text-secondary);
			padding: 3rem;
			background: var(--bg-card);
			border-radius: 12px;
			border: 1px solid var(--border);
		}
	}

	.project-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;

		.project-info {
			display: flex;
			align-items: center;
			gap: 1rem;

			.project-icon {
				width: 40px;
				height: 40px;
				background: var(--bg-secondary);
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 600;
				color: var(--accent);
			}

			strong {
				display: block;
				margin-bottom: 0.125rem;
			}

			a {
				font-size: 0.8rem;
				color: var(--text-secondary);

				&:hover {
					color: var(--accent);
				}
			}
		}

		.delete-btn {
			background: transparent;
			color: var(--error);
			border: 1px solid var(--error);
			padding: 0.5rem 1rem;
			font-size: 0.875rem;

			&:hover {
				background: rgba(248, 113, 113, 0.1);
			}
		}
	}

	.settings-section {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1.5rem;

			h2 {
				font-size: 1.25rem;
			}
		}
	}

	.password-form {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;

		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1rem;
			margin-bottom: 1.5rem;

			.field.full {
				grid-column: 1 / -1;
			}

			label {
				display: block;
				margin-bottom: 0.5rem;
				font-size: 0.875rem;
				color: var(--text-secondary);
			}
		}
	}
</style>

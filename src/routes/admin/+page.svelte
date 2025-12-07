<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let showAddForm = $state(false);
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

	<section class="projects-section">
		<div class="section-header">
			<h2>Projekte ({data.projects.length})</h2>
			<button class="primary" onclick={() => (showAddForm = !showAddForm)}>
				{showAddForm ? 'Abbrechen' : '+ Neues Projekt'}
			</button>
		</div>

		{#if showAddForm}
			<form method="POST" action="?/add" use:enhance class="add-form">
				<div class="form-grid">
					<div class="field">
						<label for="name">Name</label>
						<input type="text" id="name" name="name" placeholder="Forgejo" required />
					</div>
					<div class="field">
						<label for="url">URL</label>
						<input type="url" id="url" name="url" placeholder="https://forgejo.degidev.de" required />
					</div>
					<div class="field full">
						<label for="description">Beschreibung</label>
						<input type="text" id="description" name="description" placeholder="Git Server" required />
					</div>
					<div class="field full">
						<label for="icon">Icon URL (optional)</label>
						<input type="url" id="icon" name="icon" placeholder="https://..." />
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
</style>

<script lang="ts">
	import { enhance } from '$app/forms';
	import TechStack from './TechStack.svelte';
	import { type Project, type ProjectStatus, statusConfig } from '$lib/types';

	let {
		show = false,
		editingProject = null,
		onClose,
		onSuccess
	}: {
		show: boolean;
		editingProject: Project | null;
		onClose: () => void;
		onSuccess: () => void;
	} = $props();

	// Form state
	let urlInput = $state('');
	let nameInput = $state('');
	let descriptionInput = $state('');
	let iconInput = $state('');
	let repoUrlInput = $state('');
	let stackInput = $state('');
	let statusInput = $state<ProjectStatus>('live');
	let loading = $state(false);
	let loadingRepo = $state(false);

	let debounceTimer: ReturnType<typeof setTimeout>;
	let repoDebounceTimer: ReturnType<typeof setTimeout>;

	// Reset or populate form when editingProject changes
	$effect(() => {
		if (show) {
			if (editingProject) {
				urlInput = editingProject.url;
				nameInput = editingProject.name;
				descriptionInput = editingProject.description;
				iconInput = editingProject.icon || '';
				repoUrlInput = editingProject.repoUrl || '';
				stackInput = editingProject.stack?.join(', ') || '';
				statusInput = editingProject.status || 'live';
			} else {
				resetForm();
			}
		}
	});

	function resetForm() {
		urlInput = '';
		nameInput = '';
		descriptionInput = '';
		iconInput = '';
		repoUrlInput = '';
		stackInput = '';
		statusInput = 'live';
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	function handleUrlInput() {
		clearTimeout(debounceTimer);
		if (urlInput.match(/^https?:\/\/.+\..+/)) {
			debounceTimer = setTimeout(fetchMeta, 500);
		}
	}

	async function fetchMeta() {
		if (!urlInput || loading) return;
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
		} catch {
			// Ignore
		}
		loading = false;
	}

	function handleRepoUrlInput() {
		clearTimeout(repoDebounceTimer);
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
				const fetchedData = await res.json();
				if (fetchedData.languages && fetchedData.languages.length > 0) {
					const existing = stackInput ? stackInput.split(',').map(s => s.trim()) : [];
					const combined = [...new Set([...existing, ...fetchedData.languages])];
					stackInput = combined.join(', ');
				}
			}
		} catch {
			// Ignore
		}
		loadingRepo = false;
	}

	function getStackArray() {
		return stackInput.split(',').map(s => s.trim()).filter(Boolean);
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal-backdrop"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="modal">
			<div class="modal-header">
				<h2>{editingProject ? 'Projekt bearbeiten' : 'Neues Projekt'}</h2>
				<button class="modal-close" onclick={onClose}>×</button>
			</div>
			<form method="POST" action={editingProject ? '?/edit' : '?/add'} use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						onSuccess();
						onClose();
					}
					await update();
				};
			}}>
				{#if editingProject}
					<input type="hidden" name="id" value={editingProject._id} />
				{/if}
				<div class="modal-body">
					<div class="form-row">
						<div class="form-group">
							<label for="modal-url">Projekt URL</label>
							<div class="input-with-indicator">
								<input
									type="url"
									id="modal-url"
									name="url"
									placeholder="https://mein-projekt.de"
									bind:value={urlInput}
									oninput={handleUrlInput}
									required
								/>
								{#if loading}
									<span class="input-indicator loading">...</span>
								{/if}
							</div>
							<span class="form-hint">Meta-Daten werden automatisch geladen</span>
						</div>
						<div class="form-group">
							<label for="modal-name">Name</label>
							<input
								type="text"
								id="modal-name"
								name="name"
								placeholder="Mein Projekt"
								bind:value={nameInput}
								required
							/>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="modal-description">Beschreibung</label>
							<input
								type="text"
								id="modal-description"
								name="description"
								placeholder="Kurze Beschreibung des Projekts"
								bind:value={descriptionInput}
								required
							/>
						</div>
						<div class="form-group status-group">
							<label for="modal-status">Status</label>
							<select id="modal-status" name="status" bind:value={statusInput}>
								{#each Object.entries(statusConfig) as [value, config]}
									<option {value}>{config.label || 'Live'}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group icon-group">
							<label for="modal-icon">Icon URL</label>
							<div class="icon-input-row">
								{#if iconInput}
									<div class="icon-preview">
										<img src={iconInput} alt="Icon Preview" />
									</div>
								{:else}
									<div class="icon-preview empty">
										<span>?</span>
									</div>
								{/if}
								<input
									type="url"
									id="modal-icon"
									name="icon"
									placeholder="https://..."
									bind:value={iconInput}
								/>
							</div>
						</div>
					</div>

					<div class="form-divider">
						<span>Tech Stack</span>
					</div>

					<div class="form-group">
						<label for="modal-repo">Repository URL</label>
						<div class="input-with-indicator">
							<input
								type="url"
								id="modal-repo"
								name="repoUrl"
								placeholder="https://github.com/user/repo"
								bind:value={repoUrlInput}
								oninput={handleRepoUrlInput}
							/>
							{#if loadingRepo}
								<span class="input-indicator loading">...</span>
							{/if}
						</div>
						<span class="form-hint">Stack wird automatisch aus package.json erkannt</span>
					</div>

					<div class="form-group">
						<label for="modal-stack">Tech Stack (manuell)</label>
						<input
							type="text"
							id="modal-stack"
							name="stack"
							placeholder="SvelteKit, Bun, MongoDB, TypeScript"
							bind:value={stackInput}
						/>
						{#if stackInput && getStackArray().length > 0}
							<div class="stack-preview">
								<TechStack stack={getStackArray()} />
							</div>
						{/if}
					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn-secondary" onclick={onClose}>Abbrechen</button>
					<button type="submit" class="btn-primary">
						{editingProject ? 'Speichern' : 'Hinzufuegen'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

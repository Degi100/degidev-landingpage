<script lang="ts">
	import { enhance } from '$app/forms';
	import TechStack from './TechStack.svelte';

	interface Project {
		_id: string;
		name: string;
		url: string;
		description: string;
		icon: string | null;
		repoUrl: string | null;
		stack: string[];
		order: number;
	}

	let {
		project,
		isAdmin = false,
		expandedStack,
		deleteConfirm,
		onToggleStack,
		onEdit,
		onDeleteConfirm,
		onDeleteCancel
	}: {
		project: Project;
		isAdmin?: boolean;
		expandedStack: string | null;
		deleteConfirm: string | null;
		onToggleStack: (id: string, event: MouseEvent) => void;
		onEdit: (project: Project, event: MouseEvent) => void;
		onDeleteConfirm: (id: string, event: MouseEvent) => void;
		onDeleteCancel: (event: MouseEvent) => void;
	} = $props();

	const isExpanded = $derived(expandedStack === project._id);
	const isDeleting = $derived(deleteConfirm === project._id);
</script>

<a href={project.url} class="card" target="_blank" rel="noopener noreferrer">
	<div class="card-icon">
		{#if project.icon}
			<img src={project.icon} alt={project.name} />
		{:else}
			<span class="placeholder-icon">{project.name.charAt(0)}</span>
		{/if}
	</div>
	<div class="card-content">
		<h2>{project.name}</h2>
		<p>{project.description}</p>
		<div class="card-bottom">
			{#if project.stack && project.stack.length > 0}
				<div class="tech-stack-wrapper">
					<button
						class="stack-toggle"
						class:expanded={isExpanded}
						onclick={(e) => onToggleStack(project._id, e)}
					>
						<span class="stack-label">Stack ({project.stack.length})</span>
						<span class="stack-arrow">▼</span>
					</button>
					{#if isExpanded}
						<TechStack stack={project.stack} />
					{/if}
				</div>
			{/if}
			{#if isAdmin}
				<div class="card-actions">
					<button class="edit-icon" onclick={(e) => onEdit(project, e)} title="Bearbeiten">✎</button>
					{#if isDeleting}
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<form method="POST" action="?/delete" use:enhance onclick={(e) => e.stopPropagation()}>
							<input type="hidden" name="id" value={project._id} />
							<button type="submit" class="confirm-delete">Ja</button>
							<button type="button" class="cancel-delete" onclick={onDeleteCancel}>Nein</button>
						</form>
					{:else}
						<button class="delete-icon" onclick={(e) => onDeleteConfirm(project._id, e)} title="Loeschen">×</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</a>
